"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock, CheckSquare, StickyNote, Plus, X, Trash2, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  // Note context for task activities
  noteId?: string;
  noteTitle?: string;
}

interface ActivityPanelProps {
  boardId: string;
  open: boolean;
  onClose: () => void;
}

const actionLabels: Record<string, { label: string; icon: typeof StickyNote }> = {
  note_created: { label: "created a note", icon: StickyNote },
  note_updated: { label: "updated a note", icon: StickyNote },
  note_deleted: { label: "deleted a note", icon: Trash2 },
  note_reassigned: { label: "reassigned a note", icon: UserCheck },
  task_completed: { label: "completed a task", icon: CheckSquare },
  task_uncompleted: { label: "uncompleted a task", icon: CheckSquare },
  task_added: { label: "added a task", icon: Plus },
  task_deleted: { label: "deleted a task", icon: Trash2 },
  task_updated: { label: "updated a task", icon: CheckSquare },
};

function formatEntityTitle(title: string | null): string {
  if (!title) return "";

  // Truncate long titles
  if (title.length > 30) {
    return title.substring(0, 30) + "...";
  }
  return title;
}

export function ActivityPanel({ boardId, open, onClose }: ActivityPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadActivities = useCallback(async (reset = false) => {
    if (!open) return;

    setLoading(true);
    const currentOffset = reset ? 0 : offset;
    const newOffset = currentOffset + 20;

    try {
      const params = new URLSearchParams({
        boardId,
        limit: "20",
        offset: currentOffset.toString(),
      });

      const response = await fetch(`/api/activity?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (reset || currentOffset === 0) {
          setActivities(data.activities);
        } else {
          setActivities((prev) => [...prev, ...data.activities]);
        }
        setHasMore(data.activities.length === 20);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoading(false);
    }
  }, [boardId, open, offset]);

  useEffect(() => {
    if (open) {
      loadActivities(true);
    }
  }, [open, boardId, loadActivities]);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 h-[calc(100vh-0px)] bg-white dark:bg-zinc-900 shadow-xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-50 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-zinc-500" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Activity</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 h-full">{activities.length === 0 && !loading && (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs mt-1">Activities will appear here</p>
            </div>
          )}

          {activities.map((activity) => {
            const actionInfo = actionLabels[activity.action] || {
              label: activity.action.replace(/_/g, " "),
              icon: StickyNote,
            };
            const Icon = actionInfo.icon;
            const userName = activity.user.name || activity.user.email.split("@")[0];

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm animate-in fade-in slide-in-from-bottom-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 dark:text-zinc-100">
                    <span className="font-medium">{userName}</span>{" "}
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {actionInfo.label}
                    </span>
                  </p>
                  {activity.entityTitle && (
                    <p className="text-zinc-600 dark:text-zinc-400 truncate text-xs mt-0.5">
                      &ldquo;{formatEntityTitle(activity.entityTitle)}&rdquo;
                    </p>
                  )}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Icon className="w-4 h-4 text-zinc-400 mt-1 flex-shrink-0" />
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          )}

          {hasMore && !loading && activities.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-zinc-500 dark:text-zinc-400"
              onClick={() => loadActivities()}
            >
              Load more
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
