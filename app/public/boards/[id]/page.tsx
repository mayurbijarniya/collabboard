"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { FullPageLoader } from "@/components/ui/loader";
import { FilterPopover } from "@/components/ui/filter-popover";
import type { Note, Board } from "@/components/note";
import { Note as NoteCard } from "@/components/note";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useUser } from "@/app/contexts/UserContext";
import { getUniqueAuthors, filterAndSortNotes, getBoardColumns } from "@/lib/utils";
import { useBoardColumnMeta } from "@/lib/hooks";
import { useTheme } from "next-themes";

export default function PublicBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const columnMeta = useBoardColumnMeta();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setBoardId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      const [boardResponse, notesResponse] = await Promise.all([
        fetch(`/api/boards/${boardId}`),
        fetch(`/api/boards/${boardId}/notes`),
      ]);

      if (boardResponse.status === 404 || boardResponse.status === 403) {
        setBoard(null);
        setLoading(false);
        return;
      }
      if (boardResponse.status === 401) {
        router.push("/auth/signin");
        return;
      }
      if (boardResponse.ok) {
        const { board } = await boardResponse.json();
        if (board.isPublic) {
          setBoard(board);
        }
      }

      if (notesResponse.ok) {
        const { notes } = await notesResponse.json();
        setNotes(notes);
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
      // Set board to null to trigger the not-found UI
      setBoard(null);
    } finally {
      setLoading(false);
    }
  };

  const uniqueAuthors = useMemo(() => getUniqueAuthors(notes), [notes]);

  const filteredNotes = useMemo(
    () => filterAndSortNotes(notes, searchTerm, dateRange, selectedAuthor, null),
    [notes, searchTerm, dateRange, selectedAuthor]
  );

  const columnsData = useMemo(() => {
    return getBoardColumns(columnMeta.count, filteredNotes);
  }, [columnMeta, filteredNotes]);

  if (loading) {
    return <FullPageLoader message="Loading board..." />;
  }

  if (!board) {
    return (
      <div className="min-h-screen dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Board not found</h1>
          <p className="text-muted-foreground mb-4">
            This board doesn&apos;t exist or is not publicly accessible.
          </p>

          <Button asChild variant="outline">
            <Link href="/">Go to CollabBoard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen bg-zinc-100 dark:bg-zinc-800 bg-dots">
      <div>
        <div className="mx-0.5 md:mx-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center h-auto md:h-16 p-2 md:p-0">
          {/* Left: Logo + Board Name */}
          <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 rounded-lg dark:border-zinc-800 mt-2 py-2 px-3 md:w-fit grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] md:grid-cols-[auto_auto_1fr_auto_auto] gap-2 items-center auto-rows-auto grid-flow-dense">
            <Link href="/" className="flex-shrink-0 pl-1 w-fit">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                CollabBoard
              </h1>
            </Link>
            <div className="h-6 w-px m-1.5 bg-zinc-100 dark:bg-zinc-700 hidden md:block" />

            <div className="text-sm font-semibold text-foreground dark:text-zinc-100 truncate">
              {board.name}
            </div>

            <div className="h-6 w-px m-1.5 bg-zinc-100 dark:bg-zinc-700 hidden sm:block" />

            <div className="hidden md:block">
              <FilterPopover
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateRangeChange={(startDate, endDate) => {
                  setDateRange({ startDate, endDate });
                }}
                selectedAuthor={selectedAuthor}
                authors={uniqueAuthors}
                onAuthorChange={(authorId) => {
                  setSelectedAuthor(authorId);
                }}
                className="h-9"
              />
            </div>
          </div>

          {/* Right: Search + Sign in */}
          <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 rounded-lg dark:border-zinc-800 mt-2 py-2 px-3 grid grid-cols-[1fr_auto] gap-2 items-center auto-rows-auto grid-flow-dense">
            {notes.length > 0 && (
              <div className="relative h-9 col-span-3 md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground dark:text-zinc-400" />
                </div>
                <input
                  aria-label="Search notes"
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-zinc-100 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600 focus:border-transparent text-sm bg-background dark:bg-zinc-900 text-foreground dark:text-zinc-100 placeholder:text-muted-foreground dark:placeholder:text-zinc-400"
                />
              </div>
            )}

            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Board Area */}
      <div
        ref={boardRef}
        className="relative w-full min-h-[calc(100vh-236px)] sm:min-h-[calc(100vh-64px)] p-3 md:p-5"
      >
        <div className={`flex ${columnMeta.gap === 0 ? 'gap-0' : columnMeta.gap === 2 ? 'gap-2' : columnMeta.gap === 4 ? 'gap-4' : 'gap-6'}`}>
          {columnsData.map((column, index) => (
            <div key={index} className="flex-1 flex flex-col gap-4">
              {column.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note as Note}
                  readonly={true}
                  className="shadow-md shadow-black/10 p-4"
                  style={{
                    backgroundColor: resolvedTheme === "dark" ? "#18181B" : note.color,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No notes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedAuthor || dateRange.startDate || dateRange.endDate
                  ? "Try adjusting your filters to see more notes."
                  : "This board doesn't have any notes yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
