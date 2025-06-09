"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Save, Trash2 } from "lucide-react"
import type { Note } from "@/lib/db"

interface NoteEditorProps {
  note?: Note
  onSave: (note: Partial<Note>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose: () => void
}

export function NoteEditor({ note, onSave, onDelete, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      await onSave({
        id: note?.id,
        title: title.trim(),
        content: content.trim(),
        is_favorite: isFavorite,
      })
      onClose()
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!note?.id || !onDelete) return

    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await onDelete(note.id)
        onClose()
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          {isFavorite && <Badge variant="secondary">Favorite</Badge>}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {note?.id && onDelete && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
        />

        <Textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] border-none px-0 resize-none focus-visible:ring-0"
        />
      </CardContent>
    </Card>
  )
}
