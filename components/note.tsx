"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  ChecklistItem as ChecklistItemComponent,
  ChecklistItem,
} from "@/components/checklist-item";
import { DraggableRoot, DraggableContainer, DraggableItem } from "@/components/ui/draggable";
import { cn } from "@/lib/utils";
import { Trash2, Archive, ArchiveRestore } from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// Core domain types
export interface User {
  id: string;
  name: string | null;
  image?: string | null;
  email: string;
  isAdmin?: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string | null;
}

export interface Note {
  id: string;
  color: string;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  checklistItems?: ChecklistItem[];
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  board?: {
    id: string;
    name: string;
  };
  boardId: string;
  // Optional positioning properties for board layout
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface NoteProps {
  note: Note;
  syncDB?: boolean;
  currentUser?: User;
  onUpdate?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
  onUnarchive?: (noteId: string) => void;
  readonly?: boolean;
  showBoardName?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Note({
  note,
  currentUser,
  onUpdate,
  onDelete,
  onArchive,
  onUnarchive,
  readonly = false,
  showBoardName = false,
  className,
  syncDB = true,
  style,
}: NoteProps) {
  const { resolvedTheme } = useTheme();

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingItemContent, setEditingItemContent] = useState("");
  const [newItemContent, setNewItemContent] = useState("");

  const canEdit = !readonly && (currentUser?.id === note.user.id || currentUser?.isAdmin);

  const handleToggleChecklistItem = async (itemId: string) => {
    try {
      if (!note.checklistItems) return;

      const updatedItems = note.checklistItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );

      const updatedNote = { ...note, checklistItems: updatedItems };
      onUpdate?.(updatedNote);

      if (syncDB) {
        await fetch(`/api/checklist-items/${itemId}/toggle`, {
          method: "PATCH",
        });
      }
    } catch (error) {
      console.error("Error toggling checklist item:", error);
    }
  };

  const handleEditChecklistItem = async (itemId: string, content: string) => {
    try {
      if (!note.checklistItems) return;

      const updatedItems = note.checklistItems.map((item) =>
        item.id === itemId ? { ...item, content } : item
      );

      const updatedNote = { ...note, checklistItems: updatedItems };
      onUpdate?.(updatedNote);

      if (syncDB) {
        await fetch(`/api/checklist-items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      }
    } catch (error) {
      console.error("Error editing checklist item:", error);
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    try {
      if (!note.checklistItems) return;

      const updatedItems = note.checklistItems.filter((item) => item.id !== itemId);
      const updatedNote = { ...note, checklistItems: updatedItems };
      onUpdate?.(updatedNote);

      if (syncDB) {
        await fetch(`/api/checklist-items/${itemId}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("Error deleting checklist item:", error);
    }
  };

  const handleCreateChecklistItem = async (content: string) => {
    try {
      if (syncDB) {
        const response = await fetch(`/api/checklist-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteId: note.id,
            content,
          }),
        });

        if (response.ok) {
          const newItem = await response.json();
          const updatedItems = [...(note.checklistItems || []), newItem];
          const updatedNote = { ...note, checklistItems: updatedItems };
          onUpdate?.(updatedNote);
        }
      } else {
        const newItem: ChecklistItem = {
          id: `temp-${Date.now()}`,
          content,
          checked: false,
          order: (note.checklistItems?.length || 0) + 1,
        };
        const updatedItems = [...(note.checklistItems || []), newItem];
        const updatedNote = { ...note, checklistItems: updatedItems };
        onUpdate?.(updatedNote);
      }
    } catch (error) {
      console.error("Error creating checklist item:", error);
    }
  };

  const handleArchive = async () => {
    try {
      const updatedNote = { ...note, archivedAt: new Date().toISOString() };
      onUpdate?.(updatedNote);
      onArchive?.(note.id);

      if (syncDB) {
        await fetch(`/api/notes/${note.id}/archive`, {
          method: "PATCH",
        });
      }
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  };

  const handleUnarchive = async () => {
    try {
      const updatedNote = { ...note, archivedAt: null };
      onUpdate?.(updatedNote);
      onUnarchive?.(note.id);

      if (syncDB) {
        await fetch(`/api/notes/${note.id}/unarchive`, {
          method: "PATCH",
        });
      }
    } catch (error) {
      console.error("Error unarchiving note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      onDelete?.(note.id);

      if (syncDB) {
        await fetch(`/api/notes/${note.id}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const isArchived = !!note.archivedAt;

  return (
    <div
      className={cn(
        "group relative rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md",
        isArchived && "opacity-60",
        className
      )}
      style={{
        backgroundColor: note.color,
        ...style,
      }}
    >
      {/* Note Header */}
      <div className="flex items-center justify-between p-3 border-b border-black/10">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={note.user.image || ""} alt={note.user.name || ""} />
            <AvatarFallback className="text-xs">
              {note.user.name?.charAt(0).toUpperCase() || note.user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-black/70">
            {note.user.name || note.user.email}
          </span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isArchived ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-black/70 hover:text-black"
                    onClick={handleUnarchive}
                  >
                    <ArchiveRestore className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restore note</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-black/70 hover:text-black"
                    onClick={handleArchive}
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive note</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-black/70 hover:text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete note</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="p-3">
        {showBoardName && note.board && (
          <div className="mb-2">
            <Link
              href={`/boards/${note.board.id}`}
              className="text-xs text-black/50 hover:text-black/70 underline"
            >
              {note.board.name}
            </Link>
          </div>
        )}

        {/* Checklist Items */}
        {note.checklistItems && note.checklistItems.length > 0 && (
          <div className="space-y-1">
            <DraggableRoot
              items={note.checklistItems}
              onItemsChange={(items) => {
                const updatedNote = { ...note, checklistItems: items };
                onUpdate?.(updatedNote);
              }}
            >
              <DraggableContainer className="space-y-1">
                {note.checklistItems.map((item) => (
                  <DraggableItem key={item.id} id={item.id} disabled={readonly}>
                    <ChecklistItemComponent
                      item={item}
                      onToggle={handleToggleChecklistItem}
                      onEdit={handleEditChecklistItem}
                      onDelete={handleDeleteChecklistItem}
                      isEditing={editingItem === item.id}
                      editContent={editingItem === item.id ? editingItemContent : undefined}
                      onEditContentChange={setEditingItemContent}
                      onStartEdit={(itemId) => {
                        setEditingItem(itemId);
                        setEditingItemContent(item.content);
                      }}
                      onStopEdit={() => {
                        setEditingItem(null);
                        setEditingItemContent("");
                      }}
                      readonly={readonly}
                    />
                  </DraggableItem>
                ))}
              </DraggableContainer>
            </DraggableRoot>
          </div>
        )}

        {/* Add New Checklist Item */}
        {canEdit && !isArchived && (
          <div className="mt-2">
            <ChecklistItemComponent
              item={{
                id: "new-item",
                content: "",
                checked: false,
                order: 0,
              }}
              isNewItem={true}
              editContent={newItemContent}
              onEditContentChange={setNewItemContent}
              onCreateItem={(content) => {
                handleCreateChecklistItem(content);
                setNewItemContent("");
              }}
              readonly={false}
              showDeleteButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
