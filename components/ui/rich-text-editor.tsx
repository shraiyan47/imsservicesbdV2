'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Link2, 
  Quote,
  Code,
  Undo2,
  Redo2,
  X
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your content...',
  minHeight = 300,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value)
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)

  const updateContent = useCallback(
    (newContent: string) => {
      setContent(newContent)
      onChange(newContent)

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [onChange, history, historyIndex]
  )

  const applyFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)

    updateContent(newContent)

    // Reset selection after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setContent(history[newIndex])
      onChange(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setContent(history[newIndex])
      onChange(history[newIndex])
    }
  }

  const clearFormatting = () => {
    updateContent('')
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('**', '**')}
          title="Bold"
          className="w-9 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('*', '*')}
          title="Italic"
          className="w-9 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('`', '`')}
          title="Code"
          className="w-9 p-0"
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('## ')}
          title="Heading"
          className="w-9 p-0"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('- ')}
          title="Bullet List"
          className="w-9 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('1. ')}
          title="Numbered List"
          className="w-9 p-0"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => applyFormatting('> ')}
          title="Quote"
          className="w-9 p-0"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo"
          className="w-9 p-0"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
          className="w-9 p-0"
        >
          <Redo2 className="w-4 h-4" />
        </Button>

        <div className="flex-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={clearFormatting}
          className="gap-2 text-red-600 hover:text-red-700"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Editor */}
      <textarea
        id="rich-editor"
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          onChange(e.target.value)
          
          // Add to history
          const newHistory = history.slice(0, historyIndex + 1)
          newHistory.push(e.target.value)
          setHistory(newHistory)
          setHistoryIndex(newHistory.length - 1)
        }}
        placeholder={placeholder}
        style={{ minHeight: `${minHeight}px` }}
        className="w-full p-4 border-0 focus:outline-none resize-vertical font-mono text-sm"
      />

      {/* Preview Info */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
        Supports Markdown formatting: **bold**, *italic*, `code`, ## headings, - lists,  quotes
      </div>
    </div>
  )
}
