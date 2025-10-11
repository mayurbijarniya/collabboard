"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/ui/loader";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Crown, 
  Trash2, 
  Copy,
  CheckCircle,
  Clock
} from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isAdmin: boolean;
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  invitedBy: {
    name: string | null;
    email: string;
  };
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [membersResponse, invitationsResponse] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/invitations"),
      ]);

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData);
      }

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      if (response.ok) {
        toast.success("Invitation sent successfully");
        setInviteEmail("");
        fetchTeamData(); // Refresh invitations
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/members?memberId=${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Member removed successfully");
        fetchTeamData(); // Refresh members
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      // In a real app, you'd generate a proper invite link
      const inviteLink = `${window.location.origin}/invite/self-serve`;
      await navigator.clipboard.writeText(inviteLink);
      setCopiedInviteLink(true);
      toast.success("Invite link copied to clipboard");
      setTimeout(() => setCopiedInviteLink(false), 2000);
    } catch (error) {
      toast.error("Failed to copy invite link");
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to manage team members.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team members and send invitations.
            </p>
          </div>

          {/* Invite New Member */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite New Member
              </CardTitle>
              <CardDescription>
                Send an email invitation to add someone to your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleInviteMember}
                  disabled={inviting || !inviteEmail.trim()}
                >
                  {inviting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Or share this link:</p>
                <div className="flex gap-2">
                  <Input
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invite/self-serve`}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCopyInviteLink}
                    disabled={copiedInviteLink}
                  >
                    {copiedInviteLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  Invitations that haven't been accepted yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited by {invitation.invitedBy.name || invitation.invitedBy.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {invitation.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({members.length})
              </CardTitle>
              <CardDescription>
                All members of your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.image || ""} alt={member.name || ""} />
                        <AvatarFallback>
                          {member.name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name || member.email}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.isAdmin && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                      {member.id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id, member.name || member.email)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
