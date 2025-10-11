"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageLoader } from "@/components/ui/loader";
import { CheckCircle, XCircle, Users, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export default function SelfServeInvitePage() {
  const [inviteData, setInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const fetchInviteData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // In a real app, you'd fetch invite data from the API
        // For now, we'll simulate the data
        setInviteData({
          organization: { name: "CollabBoard Team" },
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxUses: 10,
          uses: 3,
        });
      } catch (error) {
        console.error("Error fetching invite data:", error);
        toast.error("Invalid invite link");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteData();
  }, [token]);

  const handleJoinOrganization = async () => {
    if (!token) return;

    setJoining(true);
    try {
      // In a real app, you'd call the API to join the organization
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Successfully joined the organization!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error joining organization:", error);
      toast.error("Failed to join organization");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invite Link</CardTitle>
            <CardDescription>
              This invite link is missing required information.
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

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invite Not Found</CardTitle>
            <CardDescription>
              This invite link is invalid or has expired.
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

  const isExpired = inviteData.expiresAt < new Date();
  const isMaxUsesReached = inviteData.uses >= inviteData.maxUses;

  if (isExpired || isMaxUsesReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>
              {isExpired ? "Invite Expired" : "Invite Limit Reached"}
            </CardTitle>
            <CardDescription>
              {isExpired 
                ? "This invite link has expired." 
                : "This invite link has reached its usage limit."
              }
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
          <LinkIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Join Organization</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{inviteData.organization.name}</strong> on CollabBoard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>By joining this organization, you'll be able to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access shared boards and projects</li>
              <li>Collaborate with team members</li>
              <li>Create and manage notes together</li>
            </ul>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uses remaining:</span>
              <span className="font-medium">
                {inviteData.maxUses - inviteData.uses} of {inviteData.maxUses}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">
                {inviteData.expiresAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleJoinOrganization}
            disabled={joining}
            className="w-full"
          >
            {joining ? "Joining..." : "Join Organization"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            You'll be redirected to the dashboard after joining.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
