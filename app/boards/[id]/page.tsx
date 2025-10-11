"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FullPageLoader } from "@/components/ui/loader";
import { Note as NoteCard, type Note, type Board, type User } from "@/components/note";
import { NoteEditor } from "@/components/note-editor";
import { SearchFilter } from "@/components/search-filter";
import { useUser } from "@/app/contexts/UserContext";
import { toast } from "sonner";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const { id } = await params;
        
        // Fetch board details
        const boardResponse = await fetch(`/api/boards/${id}`);
        if (!boardResponse.ok) {
          throw new Error("Board not found");
        }
        const boardData = await boardResponse.json();
        setBoard(boardData);

        // Fetch notes
        const notesResponse = await fetch(`/api/notes?boardId=${id}`);
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          setNotes(notesData);
          setFilteredNotes(notesData);
        }
      } catch (error) {
        console.error("Error fetching board:", error);
        toast.error("Failed to load board");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBoard();
    }
  }, [user, params, router]);

  const handleCreateNote = async () => {
    if (!board) return;

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: board.id,
          color: "#fef3c7", // Default yellow color
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes((prev) => [newNote, ...prev]);
        setFilteredNotes((prev) => [newNote, ...prev]);
        toast.success("Note created");
      } else {
        throw new Error("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    setFilteredNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    setFilteredNotes((prev) => prev.filter((note) => note.id !== noteId));
    toast.success("Note deleted");
  };

  const handleArchiveNote = (noteId: string) => {
    setNotes((prev) => prev.map((note) => 
      note.id === noteId ? { ...note, archivedAt: new Date().toISOString() } : note
    ));
    setFilteredNotes((prev) => prev.map((note) => 
      note.id === noteId ? { ...note, archivedAt: new Date().toISOString() } : note
    ));
    toast.success("Note archived");
  };

  const handleUnarchiveNote = (noteId: string) => {
    setNotes((prev) => prev.map((note) => 
      note.id === noteId ? { ...note, archivedAt: null } : note
    ));
    setFilteredNotes((prev) => prev.map((note) => 
      note.id === noteId ? { ...note, archivedAt: null } : note
    ));
    toast.success("Note restored");
  };

  const handleEditNote = async (updatedNote: Note) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dueDate: updatedNote.dueDate,
          priority: updatedNote.priority,
          color: updatedNote.color,
        }),
      });

      if (response.ok) {
        setNotes((prev) => prev.map((note) => 
          note.id === updatedNote.id ? updatedNote : note
        ));
        setFilteredNotes((prev) => prev.map((note) => 
          note.id === updatedNote.id ? updatedNote : note
        ));
        toast.success("Note updated");
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  if (userLoading || loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return null;
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Board not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{board.name}</h1>
                {board.description && (
                  <p className="text-muted-foreground">{board.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilter 
            notes={notes} 
            onFilteredNotes={setFilteredNotes}
          />
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first note to get started with this board.
              </p>
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                currentUser={user}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                onArchive={handleArchiveNote}
                onUnarchive={handleUnarchiveNote}
                onEdit={setEditingNote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Note Editor */}
      {editingNote && (
        <NoteEditor
          note={editingNote}
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
          onSave={handleEditNote}
        />
      )}
    </div>
  );
}
