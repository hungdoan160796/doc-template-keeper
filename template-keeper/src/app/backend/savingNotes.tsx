// savingNotes.tsx
import { getNotesDir } from "./directoryNotes";

export async function saveNote(obj: { id: number; fields: Array<string>; lines: Array<string>; category: string; label?: string }) {
  const dir = await getNotesDir();
  if (!dir) {
    alert("Saving notes isn’t available (permission not granted or unsupported).");
    return;
  }

  const category = (obj?.category ?? "Uncategorized").toString();
  const baseName = (obj?.label ?? "Untitled").toString().trim() || "Untitled";
  const safeName = baseName.replace(/[\\/:*?"<>|]/g, "_");
  const handle = await dir.getFileHandle(`${safeName}.json`, { create: true });
  const fields = obj.fields || [] as Array<string>;
  const lines = obj.lines ||  [] as Array<string>;

  const payload = {
    id:
      (typeof obj.id === "string" && obj.id) ||
      globalThis.crypto?.randomUUID?.() ||
      `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: baseName,
    label: baseName,
    category,
    fields: fields,
    lines: lines,
  };

  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(payload, null, 2) + "\n");
  await writable.close();
}
