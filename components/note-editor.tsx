"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Flag, X } from "lucide-react";
import { Note } from "./note";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: Note) => void;
}

export function NoteEditor({ note, open, onOpenChange, onSave }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note>(note);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    note.dueDate ? new Date(note.dueDate) : undefined
  );

  const handleSave = () => {
    const updatedNote = {
      ...editedNote,
      dueDate: dueDate?.toISOString() || null,
    };
    onSave(updatedNote);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditedNote(note);
    setDueDate(note.dueDate ? new Date(note.dueDate) : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Update the note details, due date, and priority.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Due Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                placeholder="No due date"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <div className="col-span-3">
              <Select
                value={editedNote.priority || ""}
                onValueChange={(value) =>
                  setEditedNote({ ...editedNote, priority: value as "LOW" | "MEDIUM" | "HIGH" | null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <div className="col-span-3">
              <div className="flex gap-2">
                {["#fef3c7", "#fecaca", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fed7aa"].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full border-2",
                      editedNote.color === color ? "border-gray-800" : "border-gray-300"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditedNote({ ...editedNote, color })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
