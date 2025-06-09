"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotesList } from "@/components/notes/notes-list"
import { NoteEditor } from "@/components/notes/note-editor"
import { Plus, Search, Heart } from "lucide-react"
import type { Note } from "@/lib/db"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin")
    }
  }, [status])

  useEffect(() => {
    if (session) {
      fetchNotes()
    }
  }, [session])

  useEffect(() => {
    filterNotes()
  }, [notes, searchQuery, showFavorites])

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (showFavorites) params.append("favorite", "true")

      const response = await fetch(`/api/notes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = notes

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (showFavorites) {
      filtered = filtered.filter((note) => note.is_favorite)
    }

    setFilteredNotes(filtered)
  }

  const handleSaveNote = async (noteData: Partial<Note>) => {
    try {
      const url = noteData.id ? `/api/notes/${noteData.id}` : "/api/notes"
      const method = noteData.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      })

      if (response.ok) {
        fetchNotes()
        setSelectedNote(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Failed to save note:", error)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchNotes()
        setSelectedNote(null)
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: isFavorite }),
      })

      if (response.ok) {
        fetchNotes()
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (selectedNote || isCreating) {
    return (
      <div className="container mx-auto py-8 px-4">
        <NoteEditor
          note={selectedNote || undefined}
          onSave={handleSaveNote}
          onDelete={selectedNote ? handleDeleteNote : undefined}
          onClose={() => {
            setSelectedNote(null)
            setIsCreating(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-gray-600">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
              {showFavorites && " (favorites)"}
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant={showFavorites ? "default" : "outline"} onClick={() => setShowFavorites(!showFavorites)}>
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <NotesList notes={filteredNotes} onSelectNote={setSelectedNote} onToggleFavorite={handleToggleFavorite} />
      </div>
    </div>
  )
}
