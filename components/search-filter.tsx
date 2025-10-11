"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, X, Calendar, User, Flag } from "lucide-react";
import { Note } from "./note";

interface SearchFilterProps {
  notes: Note[];
  onFilteredNotes: (notes: Note[]) => void;
}

export function SearchFilter({ notes, onFilteredNotes }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Get unique authors
  const authors = Array.from(
    new Set(notes.map(note => note.user.name || note.user.email))
  );

  // Filter notes based on search criteria
  const filteredNotes = notes.filter(note => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      note.checklistItems?.some(item => 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      note.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Author filter
    const matchesAuthor = !selectedAuthor || 
      note.user.name === selectedAuthor || 
      note.user.email === selectedAuthor;

    // Priority filter
    const matchesPriority = !selectedPriority || note.priority === selectedPriority;

    // Date filter
    const matchesDate = (() => {
      if (!dateFilter || !note.dueDate) return true;
      
      const noteDate = new Date(note.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case "overdue":
          return noteDate < today;
        case "today":
          return noteDate.toDateString() === today.toDateString();
        case "upcoming":
          return noteDate > today;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesAuthor && matchesPriority && matchesDate;
  });

  // Update filtered notes when filters change
  React.useEffect(() => {
    onFilteredNotes(filteredNotes);
  }, [searchTerm, selectedAuthor, selectedPriority, dateFilter, notes]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAuthor("");
    setSelectedPriority("");
    setDateFilter("");
  };

  const hasActiveFilters = searchTerm || selectedAuthor || selectedPriority || dateFilter;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes, checklist items, or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {[searchTerm, selectedAuthor, selectedPriority, dateFilter].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Notes</h4>
              
              {/* Author Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author
                </label>
                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All authors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All authors</SelectItem>
                    {authors.map(author => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Priority
                </label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All priorities</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All dates</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="today">Due today</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedAuthor && (
              <Badge variant="secondary" className="text-xs">
                Author: {selectedAuthor}
                <button
                  onClick={() => setSelectedAuthor("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedPriority && (
              <Badge variant="secondary" className="text-xs">
                Priority: {selectedPriority}
                <button
                  onClick={() => setSelectedPriority("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {dateFilter && (
              <Badge variant="secondary" className="text-xs">
                Date: {dateFilter}
                <button
                  onClick={() => setDateFilter("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
