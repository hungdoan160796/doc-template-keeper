// directoryNotes.tsx
// Same logic as getTemplateDir, but for a sibling "notes" folder.
export async function getNotesDir(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const root = await navigator.storage.getDirectory();
    const appDir = await root.getDirectoryHandle("notes", { create: true });
    const perm = await appDir.queryPermission?.({ mode: "readwrite" });
    if (perm === "granted") return appDir;
    if (perm === "prompt") {
      const res = await appDir.requestPermission?.({ mode: "readwrite" });
      if (res === "granted") return appDir;
      return null;
    }
    return null;
  } catch (e) {
    console.error("getNotesDir failed:", e);
    return null;
  }
}
