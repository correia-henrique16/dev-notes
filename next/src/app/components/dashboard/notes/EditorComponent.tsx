'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

interface EditorComponentProps {
  initialContent?: string | null
  canEdit: boolean
}

export default function EditorComponent({ initialContent, canEdit }: EditorComponentProps) {
  const [contentHtml, setContentHtml] = useState(initialContent || '')

  const editor = useEditor({
    editable: canEdit,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 my-2 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 my-2 space-y-1',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-1 leading-relaxed',
          },
        },
      }),
    ],
    content: initialContent || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'w-full flex-1 focus:outline-none min-h-[220px] text-lighter text-sm md:text-base leading-relaxed',
      },
      handleKeyDown: (view, event) => {
        if (event.key == 'Tab') {
          event.preventDefault()
          const {state, dispatch} = view
          const {selection} = state
          const {from} = selection

          if (event.shiftKey) {
            const textBefore = state.doc.textBetween(Math.max(0, from - 2), from)
            
            // Vê quantos espaços existem logo antes do cursor (máximo 4)
            const spacesMatch = textBefore.match(/ +$/)
            if (spacesMatch) {
              const deleteCount = spacesMatch[0].length
              dispatch(state.tr.delete(from - deleteCount, from))
              return true
            }
            return true
          }

          dispatch(view.state.tr.insertText('  '))
          return true
        }
      }
    },
    onUpdate: ({ editor }) => {
        if (editor.isEmpty) {
            setContentHtml('')
        } else {
            setContentHtml(editor.getHTML())
        }
    },
  })

  if (!editor) return null

  return (
    <div className="flex flex-col flex-1 w-full gap-2 min-h-0">
      {/* Barra de Ferramentas */}
      {canEdit && (
        <div className="flex items-center gap-1 border-b border-border-light pb-2 text-xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              editor.isActive('bold')
                ? 'bg-white/20 text-lighter font-black'
                : 'text-lighter/60 hover:text-lighter hover:bg-white/10 font-bold'
            }`}
            title="Negrito (Ctrl+B)"
          >
            B
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2.5 py-1 rounded italic transition-colors cursor-pointer ${
              editor.isActive('italic')
                ? 'bg-white/20 text-lighter font-bold'
                : 'text-lighter/60 hover:text-lighter hover:bg-white/10'
            }`}
            title="Itálico (Ctrl+I)"
          >
            I
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2.5 py-1 rounded underline transition-colors cursor-pointer ${
              editor.isActive('underline')
                ? 'bg-white/20 text-lighter font-bold'
                : 'text-lighter/60 hover:text-lighter hover:bg-white/10'
            }`}
            title="Sublinhado (Ctrl+U)"
          >
            U
          </button>

          <div className="w-px h-4 bg-border-light mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              editor.isActive('bulletList')
                ? 'bg-white/20 text-lighter font-bold'
                : 'text-lighter/60 hover:text-lighter hover:bg-white/10'
            }`}
            title="Lista de Pontos"
          >
            • Lista
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
              editor.isActive('codeBlock')
                ? 'bg-white/20 text-lighter font-bold'
                : 'text-lighter/60 hover:text-lighter hover:bg-white/10'
            }`}
            title="Bloco de Código"
          >
            &lt;/&gt;
          </button>
        </div>
      )}
      

      {/* Área onde se escreve */}
      <div className="flex-1 min-w-0 overflow-y-auto py-2">
        <EditorContent editor={editor}
          className='w-full max-w-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:w-full [&_.ProseMirror]:wrap-anywhere'
        />
      </div>

      {/* Input oculto que o formulário envia no submit */}
      <input type="hidden" name="content" value={contentHtml} />
    </div>
  )
}