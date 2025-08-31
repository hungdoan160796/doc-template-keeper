import { getTemplateDir } from "./directory";
import React from "react";

export type DataType = { id: number; label: string; fields: string[]; category: string; };

export default async function loadTemplates(): Promise<DataType[]> {
  const dir = await getTemplateDir(); // make sure this was primed via a click first
  if (!dir) {
    alert("Saving template is not supported in this browser.");
    return [];
  }
  const results: DataType[] = [];
  await reader(crawl(dir), results);
  return results;
}

// --- helpers ---
function stripExt(filename: string) {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(0, i) : filename;
}

async function* crawl(
  dir: FileSystemDirectoryHandle,
  base = ""
): AsyncGenerator<{ handle: any; path: string }> {
  for await (const entry of dir.values()) {            // current non-recursive code is here
    const path = base ? `${base}/${entry.name}` : entry.name;
    if (entry.kind === "directory") {
      yield* crawl(entry, path);                        // recurse into subfolders
    } else {
      yield { handle: entry, path };
    }
  }
}

async function reader( crawled : AsyncGenerator<{ handle: any; path: string }>, results : DataType[] ) {
  for await (const { handle } of crawled) {
    if (handle.kind !== "file" || !handle.name.endsWith(".json")) continue;
    try {
      const file = await handle.getFile();
      const data = JSON.parse(await file.text());

      const fields: string[] = Array.isArray(data?.fields)
        ? data.fields.filter((f: unknown) => typeof f === "string")
        : [];

      // If you want to include empty templates, remove this guard.
      if (fields.length === 0) continue;

      const label = (data.label ?? data.name ?? stripExt(handle.name)).toString();
      const id = data.id;

      results.push({ id, label, fields, category: data.category ?? "none" });
    } catch (e) {
      console.error(`Failed to load template from ${handle.name}:`, e);
    }
  }
}