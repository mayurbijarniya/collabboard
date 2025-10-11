"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageLoader } from "@/components/ui/loader";
import { CheckCircle, XCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const { id } = await params;
        
        // For now, we'll show a simple acceptance flow
        // In a real app, you'd fetch invitation details from the API
        setInvitation({
          id,
          organization: { name: "CollabBoard Team" },
          email: "user@example.com",
        });
      } catch (error) {
        console.error("Error fetching invitation:", error);
        toast.error("Invalid invitation link");
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [params, router]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    setAccepting(true);
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/accept`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Invitation accepted! Welcome to the team.");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push("/auth/signin")} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{invitation.organization.name}</strong> on CollabBoard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>By accepting this invitation, you'll be able to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Collaborate on shared boards</li>
              <li>Create and manage notes together</li>
              <li>Stay synchronized with your team</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={accepting}
              className="flex-1"
            >
              {accepting ? "Accepting..." : "Accept Invitation"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/auth/signin")}
              className="flex-1"
            >
              Sign In First
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            You'll be redirected to the dashboard after accepting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
