"use client";

export type UsagePhotoKind = "before" | "after";

type UsagePhotoRecord = {
  id: string;
  usageId: string;
  kind: UsagePhotoKind;
  image: Blob;
  createdAt: string;
};

const databaseName = "care-hair-private-records";
const storeName = "usage-photos";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("写真記録を開けませんでした。"));
  });
}

function recordId(usageId: string, kind: UsagePhotoKind) {
  return `${usageId}:${kind}`;
}

export async function loadUsagePhoto(usageId: string, kind: UsagePhotoKind): Promise<UsagePhotoRecord | null> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(recordId(usageId, kind));
    request.onsuccess = () => resolve((request.result as UsagePhotoRecord | undefined) ?? null);
    request.onerror = () => reject(new Error("写真記録を読み込めませんでした。"));
    transaction.oncomplete = () => database.close();
  });
}

export async function saveUsagePhoto(usageId: string, kind: UsagePhotoKind, image: Blob) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put({
      id: recordId(usageId, kind),
      usageId,
      kind,
      image,
      createdAt: new Date().toISOString()
    } satisfies UsagePhotoRecord);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(new Error("写真記録を保存できませんでした。"));
    };
  });
}

export async function deleteUsagePhoto(usageId: string, kind: UsagePhotoKind) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(recordId(usageId, kind));
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(new Error("写真記録を削除できませんでした。"));
    };
  });
}
