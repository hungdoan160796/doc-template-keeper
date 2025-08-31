type CopyNoteMDButtonProps = {
  label: string;
  category: string;
  fields: string[]; // templateContent
  lines: string[];  // same length/order as fields
};

const mdEsc = (s: string) =>
  String(s).replace(/([\\`*_{}\[\]()#+\-!.|>~])/g, "\\$1");

function buildMarkdown({ label, category, fields, lines }: CopyNoteMDButtonProps) {
  const parts: string[] = [];
  parts.push(`# ${mdEsc(label)}`);
  if (category) parts.push(`_${mdEsc(category)}_`);

  fields.forEach((field, i) => {
    parts.push(`## ${i + 1}. ${mdEsc(field)}`);
    parts.push(mdEsc(lines[i] ?? ""));
  });

  return parts.join("\n\n");
}

async function copyMarkdown(md: string) {
  try {
    if ("ClipboardItem" in window) {
      const item = new ClipboardItem({
        "text/markdown": new Blob([md], { type: "text/markdown" }),
        "text/plain": new Blob([md], { type: "text/plain" }),
      });
      await (navigator.clipboard as any).write([item]);
    } else {
      await navigator.clipboard.writeText(md);
    }
  } catch {
    const ta = document.createElement("textarea");
    ta.value = md;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export function CopyNoteButton(props: CopyNoteMDButtonProps) {
  const onClick = async () => {
    const md = buildMarkdown(props);
    await copyMarkdown(md);
  };

  return (
    <button
      onClick={onClick}
      className="border rounded px-3 py-2 hover:cursor-pointer"
      title="Copy as Markdown"
    >
      Copy (MD)
    </button>
  );
}
