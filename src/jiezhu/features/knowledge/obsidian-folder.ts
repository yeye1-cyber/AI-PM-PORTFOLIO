"use client";

export type KnowledgeTreeNode =
  | { type: "folder"; name: string; children: KnowledgeTreeNode[] }
  | { type: "note"; name: string };

export type KnowledgeVault = {
  id: string;
  name: string;
  tree: KnowledgeTreeNode[];
  noteCount: number;
  scannedAt: string;
};

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
};

type PermissionDirectoryHandle = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor: { mode: "read" }) => Promise<PermissionState>;
  requestPermission?: (descriptor: { mode: "read" }) => Promise<PermissionState>;
};

type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  entries: () => AsyncIterableIterator<[string, FileSystemHandle]>;
};

const DATABASE_NAME = "jiezhu-knowledge";
const STORE_NAME = "directory-handles";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function handleTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return openDatabase().then((database) => new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = run(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  }));
}

export async function chooseKnowledgeFolder() {
  const picker = (window as DirectoryPickerWindow).showDirectoryPicker;
  if (!picker) {
    throw new Error("当前浏览器不支持选择本地文件夹，请使用最新版 Chrome 或 Edge。");
  }
  return picker();
}

export async function saveDirectoryHandle(id: string, handle: FileSystemDirectoryHandle) {
  await handleTransaction("readwrite", (store) => store.put(handle, id));
}

export async function getDirectoryHandle(id: string) {
  return handleTransaction<FileSystemDirectoryHandle | undefined>(
    "readonly",
    (store) => store.get(id),
  );
}

export async function removeDirectoryHandle(id: string) {
  await handleTransaction("readwrite", (store) => store.delete(id));
}

export async function ensureReadPermission(handle: FileSystemDirectoryHandle) {
  const permissionHandle = handle as PermissionDirectoryHandle;
  if (!permissionHandle.queryPermission) return;
  if (await permissionHandle.queryPermission({ mode: "read" }) === "granted") return;
  if (
    !permissionHandle.requestPermission
    || await permissionHandle.requestPermission({ mode: "read" }) !== "granted"
  ) {
    throw new Error("没有获得该文件夹的读取权限。");
  }
}

async function scanDirectory(handle: FileSystemDirectoryHandle): Promise<KnowledgeTreeNode[]> {
  const nodes: KnowledgeTreeNode[] = [];
  for await (const [name, entry] of (handle as IterableDirectoryHandle).entries()) {
    if (name.startsWith(".")) continue;
    if (entry.kind === "directory") {
      const children = await scanDirectory(entry as FileSystemDirectoryHandle);
      if (children.length > 0) nodes.push({ type: "folder", name, children });
      continue;
    }
    if (entry.kind === "file" && name.toLowerCase().endsWith(".md")) {
      nodes.push({ type: "note", name: name.slice(0, -3) });
    }
  }
  return nodes.sort((left, right) => {
    if (left.type !== right.type) return left.type === "folder" ? -1 : 1;
    return left.name.localeCompare(right.name, "zh-CN");
  });
}

function countNotes(nodes: KnowledgeTreeNode[]): number {
  return nodes.reduce(
    (total, node) => total + (node.type === "note" ? 1 : countNotes(node.children)),
    0,
  );
}

export async function scanKnowledgeFolder(
  id: string,
  handle: FileSystemDirectoryHandle,
): Promise<KnowledgeVault> {
  await ensureReadPermission(handle);
  const tree = await scanDirectory(handle);
  return {
    id,
    name: handle.name,
    tree,
    noteCount: countNotes(tree),
    scannedAt: new Date().toISOString(),
  };
}
