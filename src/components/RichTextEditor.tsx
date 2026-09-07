import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva aqui...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-acl-gold-deep underline hover:text-acl-gold",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
        style: `min-height: ${minHeight}; padding: 12px;`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sincroniza quando o valor externo muda (ex: carregamento de dados na edição)
  useEffect(() => {
    if (!editor) return
    const conteudoAtual = editor.getHTML()
    if (value !== conteudoAtual) {
      editor.commands.setContent(value || "", false)
    }
  }, [value, editor])

  if (!editor) return null

  function handleLink() {
    const url = window.prompt("URL do link:")
    if (!url) return
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run()
  }

  const btnClass = (active: boolean) =>
    `p-1.5 rounded-sm border transition-colors text-sm ${
      active
        ? "bg-acl-gold text-acl-ink border-acl-gold"
        : "border-acl-line text-acl-ink-soft hover:border-acl-gold-deep hover:text-acl-gold-deep"
    }`

  return (
    <div className="border border-acl-line rounded-sm overflow-hidden">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-acl-line bg-acl-cream">
        {/* Desfazer / Refazer */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btnClass(false)}
          title="Desfazer"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btnClass(false)}
          title="Refazer"
        >
          <Redo size={15} />
        </button>

        <span className="w-px bg-acl-line mx-1 self-stretch" />

        {/* Títulos */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="Título"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive("heading", { level: 3 }))}
          title="Subtítulo"
        >
          <Heading3 size={15} />
        </button>

        <span className="w-px bg-acl-line mx-1 self-stretch" />

        {/* Formatação inline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Negrito"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Itálico"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className={btnClass(editor.isActive("link"))}
          title="Inserir link"
        >
          <LinkIcon size={15} />
        </button>

        <span className="w-px bg-acl-line mx-1 self-stretch" />

        {/* Listas */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="Lista com marcadores"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="Lista numerada"
        >
          <ListOrdered size={15} />
        </button>

        <span className="w-px bg-acl-line mx-1 self-stretch" />

        {/* Linha horizontal */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
          title="Linha divisória"
        >
          <Minus size={15} />
        </button>
      </div>

      {/* Área de edição */}
      <div
        className="bg-white cursor-text"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />

        {/* Placeholder manual (TipTap não tem suporte nativo via prop) */}
        {editor.isEmpty && (
          <p
            className="absolute pointer-events-none text-acl-muted text-sm px-3 py-3"
            style={{ top: "48px" }}
          >
            {placeholder}
          </p>
        )}
      </div>

      {/* Estilos do conteúdo gerado pelo TipTap */}
      <style>{`
        .ProseMirror h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: #2A211A;
          margin: 1rem 0 0.5rem;
        }
        .ProseMirror h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #2A211A;
          margin: 0.75rem 0 0.4rem;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
          line-height: 1.7;
          color: #5C5142;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror li {
          color: #5C5142;
          margin: 0.2rem 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #D8CFB8;
          margin: 1rem 0;
        }
        .ProseMirror strong {
          color: #2A211A;
          font-weight: 600;
        }
        .ProseMirror em {
          font-style: italic;
          color: #5C5142;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
}
