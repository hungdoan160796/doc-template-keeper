// deletingTemplates.tsx
import { getTemplateDir } from "./directory";

/**
 * Delete a single template JSON whose internal payload has { id: templateId }.
 * Returns true if something was deleted, false otherwise.
 */
export async function deleteTemplate(templateId: number): Promise<boolean> {
  const root = await getTemplateDir();
  if (!root) {
    alert("Deleting templates isn’t available (permission not granted or unsupported).");
    return false;
  }

  for await (const { parent, entry } of walkWithParent(root)) {
    if (entry.kind !== "file" || !entry.name.endsWith(".json")) continue;
    try {
      const fh = entry as FileSystemFileHandle;
      const file = await fh.getFile();
      const json = JSON.parse(await file.text());

      // Compare against the id your loader/save files use
      if (json?.id === templateId) {
        await parent.removeEntry(entry.name);
        alert(`Deleted template "${json.label || templateId}".`);
        return true;
      }
    } catch (e) {
      console.error("Failed to inspect/delete", entry.name, e);
    }
  }
  return false;
}

/**
 * Delete ALL template JSON files under the templates directory (recursively).
 * Returns the number of files deleted.
 */
export async function deleteAllTemplates(): Promise<number> {
  const root = await getTemplateDir();
  if (!root) {
    alert("Deleting templates isn’t available (permission not granted or unsupported).");
    return 0;
  }

  let deleted = 0;
  // Collect targets first to avoid mutating while iterating
  const targets: Array<{ parent: FileSystemDirectoryHandle; name: string }> = [];
  for await (const { parent, entry } of walkWithParent(root)) {
    if (entry.kind === "file" && entry.name.endsWith(".json")) {
      targets.push({ parent, name: entry.name });
    }
  }

  for (const t of targets) {
    try {
      await t.parent.removeEntry(t.name);
      deleted++;
    } catch (e) {
      console.error("Failed to delete", t.name, e);
    }
  }
  return deleted;
}

/* -------------------- helpers -------------------- */

async function* walkWithParent(
  dir: FileSystemDirectoryHandle
): AsyncGenerator<{ parent: FileSystemDirectoryHandle; entry: FileSystemHandle }> {
  for await (const entry of dir.values()) {
    if (entry.kind === "directory") {
      // Yield children of this subdir (their parent is `entry`)
      yield* walkWithParent(entry as FileSystemDirectoryHandle);
    } else {
      yield { parent: dir, entry };
    }
  }
}
