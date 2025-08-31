// loadingNotes.tsx
import { getNotesDir } from "./directoryNotes";

export type NoteType = { id: number; label: string; fields: {}; category: string };

export default async function loadNotes(): Promise<NoteType[]> {
  const dir = await getNotesDir();
  if (!dir) {
    alert("Loading notes isn’t available (permission not granted or unsupported).");
    return [];
  }

  const results: NoteType[] = [];
  for await (const { handle } of walk(dir)) {
    if (handle.kind !== "file" || !handle.name.endsWith(".json")) continue;
    try {
      const file = await handle.getFile();
      const data = JSON.parse(await file.text());

      const fields: string[] = Array.isArray(data?.fields)
        ? data.fields.filter((f: any) => typeof f === "string")
        : [];

      // Keep the same behavior as templates: skip empty files unless you want to include them.
      if (fields.length === 0) continue;

      const label = (data.label ?? data.name ?? stripExt(handle.name)).toString();
      const id = data.id;

      results.push({
        id,
        label,
        fields,
        category: data.category ?? "none",
      });
    } catch (e) {
      console.error(`Failed to load note from ${handle.name}:`, e);
    }
  }

  return results;
}

// --- helpers (same pattern you use in templates loader) ---
function stripExt(filename: string) {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(0, i) : filename;
}

async function* walk(
  dir: FileSystemDirectoryHandle,
  base = ""
): AsyncGenerator<{ handle: any; path: string }> {
  for await (const entry of dir.values()) {
    const path = base ? `${base}/${entry.name}` : entry.name;
    if (entry.kind === "directory") {
      yield* walk(entry as FileSystemDirectoryHandle, path);
    } else {
      yield { handle: entry, path };
    }
  }
}
