const STORAGE_BUCKET = "hair-diagnosis-images";

type SupabaseConfig = {
  url: string;
  publishableKey: string;
  secretKey: string;
};

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabaseの接続情報が設定されていません。");
    this.name = "SupabaseConfigurationError";
  }
}

export class SupabaseRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SupabaseRequestError";
    this.status = status;
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publishableKey || !secretKey) throw new SupabaseConfigurationError();
  return { url, publishableKey, secretKey };
}

export async function serviceJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers
    }
  });

  if (!response.ok) throw await toRequestError(response);
  if (response.status === 204) return undefined as T;
  const responseText = await response.text();
  if (!responseText) return undefined as T;
  return JSON.parse(responseText) as T;
}

export async function authJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}/auth/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.publishableKey,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers
    }
  });

  if (!response.ok) throw await toRequestError(response);
  return (await response.json()) as T;
}

export async function uploadPrivateImage(
  path: string,
  bytes: Buffer,
  contentType: "image/jpeg" | "image/webp"
): Promise<void> {
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${encodePath(path)}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": contentType,
      "x-upsert": "false"
    },
    body: Uint8Array.from(bytes).buffer
  });

  if (!response.ok) throw await toRequestError(response);
}

export async function deletePrivateImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      apikey: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prefixes: paths })
  });

  if (!response.ok) throw await toRequestError(response);
}

export async function createPrivateImageUrl(path: string, expiresIn = 60): Promise<string> {
  const config = getSupabaseConfig();
  const response = await fetch(
    `${config.url}/storage/v1/object/sign/${STORAGE_BUCKET}/${encodePath(path)}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: config.secretKey,
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ expiresIn })
    }
  );

  if (!response.ok) throw await toRequestError(response);
  const body = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const signedPath = body.signedURL ?? body.signedUrl;
  if (!signedPath) throw new SupabaseRequestError(500, "画像URLを作成できませんでした。");
  return signedPath.startsWith("http") ? signedPath : `${config.url}/storage/v1${signedPath}`;
}

export async function downloadPrivateImage(path: string): Promise<Response> {
  const config = getSupabaseConfig();
  const response = await fetch(`${config.url}/storage/v1/object/${STORAGE_BUCKET}/${encodePath(path)}`, {
    cache: "no-store",
    headers: {
      apikey: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`
    }
  });
  if (!response.ok) throw await toRequestError(response);
  return response;
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function toRequestError(response: Response) {
  let message = `Supabase request failed (${response.status})`;
  try {
    const body = (await response.json()) as { message?: string; error_description?: string; msg?: string };
    message = body.message ?? body.error_description ?? body.msg ?? message;
  } catch {
    // SupabaseがJSON以外を返した場合は一般化したメッセージを使用します。
  }
  return new SupabaseRequestError(response.status, message);
}
