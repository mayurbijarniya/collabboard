"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Plus, Grid3x3, Archive, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/ui/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/app/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProfileDropdown } from "@/components/profile-dropdown";

// Dashboard-specific extended types
export type DashboardBoard = {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  _count: { notes: number };
};

const formSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().optional(),
});

export default function Dashboard() {
  const [boards, setBoards] = useState<DashboardBoard[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddBoardDialogOpen, setIsAddBoardDialogOpen] = useState(false);

  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({ open: false, title: "", description: "" });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchUserAndBoards = useCallback(async () => {
    try {
      const userResponse = await fetch("/api/user");
      if (userResponse.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        if (!userData.name) {
          router.push("/setup/profile");
          return;
        }
        if (!userData.organization) {
          router.push("/setup/organization");
          return;
        }
      }

      const boardsResponse = await fetch("/api/boards");
      if (boardsResponse.ok) {
        const { boards } = await boardsResponse.json();
        setBoards(boards);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorDialog({
        open: true,
        title: "Failed to load dashboard",
        description:
          "Unable to fetch your boards and user data. Please refresh the page or try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserAndBoards();
  }, [fetchUserAndBoards]);

  const handleAddBoard = async (values: z.infer<typeof formSchema>) => {
    const { name, description } = values;
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (response.ok) {
        const { board } = await response.json();
        setBoards([board, ...boards]);
        form.reset();
        setIsAddBoardDialogOpen(false);
      } else {
        const errorData = await response.json();
        setErrorDialog({
          open: true,
          title: "Failed to create board",
          description: errorData.error || "Failed to create board",
        });
      }
    } catch (error) {
      console.error("Error adding board:", error);
      setErrorDialog({
        open: true,
        title: "Failed to create board",
        description: "Failed to create board",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsAddBoardDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  if (loading) {
    return <FullPageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                CollabBoard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user?.isAdmin && (
              <Link href="/settings/team">
                <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Team</span>
                </Button>
              </Link>
            )}
            
            <Button
              onClick={() => {
                form.reset({ name: "", description: "" });
                setIsAddBoardDialogOpen(true);
              }}
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Board</span>
            </Button>

            <ProfileDropdown user={user} />
          </div>
        </div>
      </nav>
      <div className="p-4 sm:p-6 lg:p-8">
        <Dialog open={isAddBoardDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold mb-4">
                Create New Board
              </DialogTitle>
              <DialogDescription>
                Fill out the details to create a new board.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(handleAddBoard)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter board name"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter board description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    Create board
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {boards.length > 0 && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Your Boards
              </h3>
              <p className="text-muted-foreground">
                Manage your tasks and notes across different boards
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              <Link href="/boards/all-notes">
                <Card className="group h-full min-h-34 hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Grid3x3 className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg text-primary">
                        All Notes
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary/80 truncate">
                      View notes from all boards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/boards/archive">
                <Card className="group h-full min-h-34 hover:shadow-lg transition-shadow cursor-pointer bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Archive className="w-5 h-5 text-muted-foreground" />
                      <CardTitle className="text-lg text-foreground">
                        Archive
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground truncate">View archived notes</p>
                  </CardContent>
                </Card>
              </Link>

              {boards.map((board) => (
                <Link href={`/boards/${board.id}`} key={board.id}>
                  <Card
                    data-board-id={board.id}
                    className="group h-full min-h-34 hover:shadow-lg transition-shadow cursor-pointer whitespace-nowrap"
                  >
                    <CardHeader>
                      <div className="grid grid-cols-[1fr_auto] items-start justify-between gap-2">
                        <CardTitle className="text-lg" title={board.name}>
                          {board.name}
                        </CardTitle>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-primary/10 text-primary">
                          {board._count.notes} {board._count.notes === 1 ? "note" : "notes"}
                        </span>
                      </div>
                    </CardHeader>
                    {board.description && (
                      <CardContent>
                        <p className="text-muted-foreground truncate">
                          {board.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
        {boards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No boards yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first board
            </p>
            <Button
              onClick={() => {
                setIsAddBoardDialogOpen(true);
                form.reset({ name: "", description: "" });
              }}
            >
              Create your first board
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog({ open, title: "", description: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {errorDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setErrorDialog({ open: false, title: "", description: "" })}
              className="bg-destructive hover:bg-destructive/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
