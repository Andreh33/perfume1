"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Image as ImageIcon, Quote, Minus, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

type JsonValue = Record<string, unknown>;

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  dir = "ltr",
}: {
  value: JsonValue | null | undefined;
  onChange: (value: JsonValue) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: placeholder ?? "Empieza a escribir…" }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: "noreferrer" } }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-md" } }),
    ],
    content: (value as object) ?? undefined,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[200px] focus:outline-none px-4 py-3",
        dir,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as JsonValue),
  });

  if (!editor) {
    return <div className="card-velvet h-[260px] grid place-items-center text-[var(--color-ink-subtle)]">Cargando editor…</div>;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = () => {
    const url = window.prompt("URL de la imagen");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="card-velvet overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-[oklch(0.55_0.10_70_/_0.2)] p-2 bg-[oklch(0.18_0.020_55)]">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Negrita">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Cursiva">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Lista">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Lista numerada">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Cita">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Separador">
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} label="Enlace">
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertImage} label="Imagen">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Deshacer">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Rehacer">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "p-2 rounded-md transition-colors",
        active ? "text-[var(--color-gold)] bg-[oklch(0.78_0.13_82_/_0.1)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]",
        "disabled:opacity-30 disabled:cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-[var(--color-gold-deep)] opacity-40" />;
}
