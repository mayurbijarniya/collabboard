"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NOTE_COLORS, type NoteColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor?: NoteColor;
  onColorSelect: (color: NoteColor) => void;
  disabled?: boolean;
}

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0 border-2"
          style={{ backgroundColor: selectedColor }}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3" align="start">
        <div className="grid grid-cols-5 gap-2">
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                selectedColor === color
                  ? "border-gray-900 dark:border-gray-100"
                  : "border-gray-300 dark:border-gray-600"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(color);
                setOpen(false);
              }}
              title={`Select ${color}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}