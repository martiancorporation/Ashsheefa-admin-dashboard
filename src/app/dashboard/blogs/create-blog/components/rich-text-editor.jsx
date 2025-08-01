"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
    Bold,
    Italic,
    UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Code,
    Pilcrow,
    MinusSquare,
    LinkIcon,
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
} from "lucide-react"
import { LinkModal } from "./link-modal"

export function RichTextEditor({ name, initialContent = '', onChange }) {
    const [linkModalOpen, setLinkModalOpen] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline',
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing something amazing...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right", "justify"],
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[200px] p-4",
            },
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    const addLink = (url, text) => {
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
            if (text) {
                editor.chain().focus().insertContent(text).run()
            }
        }
    }

    return (
        <div className="w-full rounded-lg border border-input bg-background">
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="flex flex-wrap items-center gap-1 p-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("paragraph")}
                        onPressedChange={() => editor.chain().focus().setParagraph().run()}
                        aria-label="Toggle paragraph"
                    >
                        <Pilcrow className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        aria-label="Toggle h1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        aria-label="Toggle h2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        aria-label="Toggle bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        aria-label="Toggle italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("underline")}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        aria-label="Toggle underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("code")}
                        onPressedChange={() => editor.chain().focus().toggleCode().run()}
                        aria-label="Toggle code"
                    >
                        <Code className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("link")}
                        onPressedChange={() => setLinkModalOpen(true)}
                        aria-label="Add link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Toggle>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "left" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                        aria-label="Align left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "center" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                        aria-label="Align center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "right" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                        aria-label="Align right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "justify" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                        aria-label="Justify"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </Toggle>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        aria-label="Toggle bullet list"
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        aria-label="Toggle ordered list"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("blockquote")}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        aria-label="Toggle blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
                        aria-label="Insert horizontal rule"
                    >
                        <MinusSquare className="h-4 w-4" />
                    </Toggle>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Toggle
                        size="sm"
                        onPressedChange={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        aria-label="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        onPressedChange={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        aria-label="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </Toggle>
                </div>
            </div>
            <div className="min-h-[300px] p-3 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
            <LinkModal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)} onSubmit={addLink} />
        </div>
    )
}

