"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  isAdmin?: boolean;
}

interface UserSelectorProps {
  selectedUserId?: string;
  onUserSelect: (userId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function UserSelector({ 
  selectedUserId, 
  onUserSelect, 
  disabled = false,
  placeholder = "Select user..."
}: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/organization/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
        setCurrentUser(data.currentUser);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMember = members.find(member => member.id === selectedUserId);

  // Don't show the selector if user is not admin
  if (!currentUser?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-9 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedMember ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={selectedMember.image || ""} />
                <AvatarFallback className="text-xs">
                  {selectedMember.name?.charAt(0) || selectedMember.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {selectedMember.name || selectedMember.email}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              {placeholder}
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                selectedUserId === member.id && "bg-gray-100 dark:bg-gray-800"
              )}
              onClick={() => {
                onUserSelect(member.id);
                setOpen(false);
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.image || ""} />
                <AvatarFallback className="text-xs">
                  {member.name?.charAt(0) || member.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {member.name || member.email}
                </div>
                {member.name && (
                  <div className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </div>
                )}
              </div>
              {member.isAdmin && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  Admin
                </span>
              )}
              {selectedUserId === member.id && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}