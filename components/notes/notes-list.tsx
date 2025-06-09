"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Edit, Calendar } from "lucide-react"
import type { Note } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"

interface NotesListProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => Promise<void>
}

export function NotesList({ notes, onSelectNote, onToggleFavorite }: NotesListProps) {
  const [updatingFavorites, setUpdatingFavorites] = useState<Set<string>>(new Set())

  const handleToggleFavorite = async (note: Note) => {
    setUpdatingFavorites((prev) => new Set(prev).add(note.id))
    try {
      await onToggleFavorite(note.id, !note.is_favorite)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    } finally {
      setUpdatingFavorites((prev) => {
        const newSet = new Set(prev)
        newSet.delete(note.id)
        return newSet
      })
    }
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No notes found. Create your first note to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2" onClick={() => onSelectNote(note)}>
                {note.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleFavorite(note)
                }}
                disabled={updatingFavorites.has(note.id)}
                className={note.is_favorite ? "text-red-500" : "text-gray-400"}
              >
                <Heart className={`h-4 w-4 ${note.is_favorite ? "fill-current" : ""}`} />
              </Button>
            </div>
            {note.is_favorite && (
              <Badge variant="secondary" className="w-fit">
                Favorite
              </Badge>
            )}
          </CardHeader>

          <CardContent onClick={() => onSelectNote(note)}>
            {note.content && <p className="text-sm text-gray-600 line-clamp-3 mb-3">{note.content}</p>}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </div>
              <Button variant="ghost" size="sm" onClick={() => onSelectNote(note)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
