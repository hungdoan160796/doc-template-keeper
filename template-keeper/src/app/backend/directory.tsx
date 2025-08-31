// directory.ts
export async function getTemplateDir(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const root = await navigator.storage.getDirectory();
    const appDir = await root.getDirectoryHandle("templates", { create: true });
    // Ask for read+write permission
    const perm = await appDir.queryPermission?.({ mode: "readwrite" });
    if (perm === "granted") return appDir;
    if (perm === "prompt") {
      const res = await appDir.requestPermission?.({ mode: "readwrite" });
      if (res === "granted") return appDir;
      return null; // user declined
    }
    // perm === "denied"
    return null;
  } catch (e) {
    console.error("getTemplateDir failed:", e);
    return null;
  }
}
