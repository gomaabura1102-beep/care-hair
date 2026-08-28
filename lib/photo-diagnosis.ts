import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

const blockedTypes = new Set(["image/svg+xml"]);
const commonPhotoExtension = /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
const maxSourceBytes = 25 * 1024 * 1024;
const maxStoredBytes = 4 * 1024 * 1024;
const maxDimension = 1600;
const minDimension = 400;

type LoadedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

/**
 * ブラウザ上で画像を描き直し、位置情報を含むEXIF等を取り除きます。
 * ここでは髪質を解析せず、保存に適した画像を作るだけです。
 */
export async function prepareHairPhoto(source: File): Promise<PreparedHairPhoto> {
  const sourceType = source.type.toLowerCase();
  const looksLikePhoto = sourceType.startsWith("image/") || (!sourceType && commonPhotoExtension.test(source.name));
  if (!looksLikePhoto || blockedTypes.has(sourceType)) {
    throw new Error("写真ファイルを選んでください。");
  }
  if (source.size === 0) {
    throw new Error("空の写真ファイルは使用できません。");
  }
  if (source.size > maxSourceBytes) {
    throw new Error("写真のサイズは25MB以下にしてください。");
  }

  const image = await loadImage(source);
  if (Math.min(image.width, image.height) < minDimension) {
    image.close();
    throw new Error("髪全体が分かる、400px以上の写真を選んでください。");
  }

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    image.close();
    throw new Error("この端末では写真を処理できませんでした。");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image.source, 0, 0, width, height);
  image.close();

  let blob = await canvasToJpeg(canvas, 0.88);
  if (blob.size > maxStoredBytes) blob = await canvasToJpeg(canvas, 0.72);
  if (blob.size > maxStoredBytes) {
    throw new Error("写真を小さくできませんでした。別の写真を選んでください。");
  }

  const file = new File([blob], "hair-photo.jpg", {
    type: "image/jpeg",
    lastModified: Date.now()
  });

  return { file, previewUrl: URL.createObjectURL(file), width, height };
}

async function loadImage(source: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close()
      };
    } catch {
      // SafariなどではHTMLImageElementで開ける写真形式があるため、下の方法も試します。
    }
  }

  const objectUrl = URL.createObjectURL(source);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.decoding = "async";
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("この端末では写真を開けませんでした。別の写真を選んでください。"));
      element.src = objectUrl;
    });
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl)
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/jpeg") {
          reject(new Error("この端末では写真を安全に変換できませんでした。"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}
