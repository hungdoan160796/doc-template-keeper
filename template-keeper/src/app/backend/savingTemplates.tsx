// savingTemplates.ts
import { getTemplateDir } from "./directory";

export async function saveTemplate(obj: { id: number, text: string; category: string; label: string }) {
  const dir = await getTemplateDir();
  if (!dir) {
    alert("Saving template isn’t available (permission not granted or unsupported).");
    return;
  }

  // Build fields from multiline text
  const lines = (obj?.text ?? "")
    .toString()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const category = obj?.category?.trim() || "Uncategorized";
  const baseName = (obj?.label ?? "Untitled").toString().trim() || "Untitled";
  const safeName = baseName.replace(/[\\/:*?"<>|]/g, "_"); // windows-illegal chars
  const handle = await dir.getFileHandle(`${safeName}.json`, { create: true });

  const payload = {
    id: obj.id,
    name: baseName,
    label: baseName, // keep label aligned with what loader expects
    category,
    fields: lines,
  };

  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(payload, null, 2) + "\n");
  await writable.close();
}
