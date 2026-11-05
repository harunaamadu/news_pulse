import type { OfflineArticle } from "@/types";

// Keep in sync with public/offline.html
export const OFFLINE_DB_NAME = "newspulse-offline";
const DB_VERSION = 1;
const ARTICLE_STORE = "articles";
export const OFFLINE_IMAGE_CACHE = "np-offline-images";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ARTICLE_STORE)) {
        db.createObjectStore(ARTICLE_STORE, { keyPath: "slug" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();

  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(ARTICLE_STORE, mode);
      const request = run(transaction.objectStore(ARTICLE_STORE));

      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

export function getOptimizedImageUrl(src: string): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
}

export function saveOfflineArticle(article: OfflineArticle) {
  return withStore("readwrite", (store) => store.put(article));
}

export function getOfflineArticle(slug: string) {
  return withStore<OfflineArticle | undefined>("readonly", (store) =>
    store.get(slug),
  );
}

export function removeOfflineArticle(slug: string) {
  return withStore("readwrite", (store) => store.delete(slug));
}

// Best effort: the story still reads fine without its cover image
export async function cacheCoverImage(src: string): Promise<void> {
  try {
    const cache = await caches.open(OFFLINE_IMAGE_CACHE);
    await cache.add(getOptimizedImageUrl(src));
  } catch {
    /* ignore */
  }
}

export async function removeCachedCoverImage(src: string): Promise<void> {
  try {
    const cache = await caches.open(OFFLINE_IMAGE_CACHE);
    await cache.delete(getOptimizedImageUrl(src), { ignoreVary: true });
  } catch {
    /* ignore */
  }
}

// Called on sign-out so saved reading never lingers on a shared device
export async function clearOfflineData(): Promise<void> {
  try {
    if (typeof indexedDB !== "undefined") {
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      });
    }
    if (typeof caches !== "undefined") {
      await caches.delete(OFFLINE_IMAGE_CACHE);
    }
  } catch {
    /* best effort */
  }
}