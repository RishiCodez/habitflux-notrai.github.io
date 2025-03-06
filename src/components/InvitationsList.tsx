
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bell, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getInvitationsForUser, acceptInvitation, rejectInvitation } from '../utils/realtimeDbUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface InvitationsListProps {
  userEmail: string;
  onAccept?: (listId: string) => void;
}

interface Invitation {
  listId: string;
  listName: string;
  createdBy: string;
  invitedAt: string;
}

const InvitationsList: React.FC<InvitationsListProps> = ({ 
  userEmail, 
  onAccept 
}) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchInvitations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const invitationsList = await getInvitationsForUser(userEmail);
      setInvitations(invitationsList as Invitation[]);
    } catch (error: any) {
      setError(error.message || "Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvitations();
  }, [userEmail]);
  
  const handleAccept = async (listId: string) => {
    try {
      await acceptInvitation(listId, userEmail);
      
      toast({
        title: "Invitation accepted",
        description: "You are now a collaborator on this list",
      });
      
      // Remove from invitations list
      setInvitations(invitations.filter(inv => inv.listId !== listId));
      
      // Notify parent component
      if (onAccept) {
        onAccept(listId);
      }
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message || "Failed to accept the invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async (listId: string) => {
    try {
      await rejectInvitation(listId, userEmail);
      
      toast({
        title: "Invitation rejected",
        description: "You have declined to collaborate on this list",
      });
      
      // Remove from invitations list
      setInvitations(invitations.filter(inv => inv.listId !== listId));
    } catch (error: any) {
      toast({
        title: "Error rejecting invitation",
        description: error.message || "Failed to reject the invitation",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span className="ml-2">Loading invitations...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading invitations</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (invitations.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Bell className="mr-2 h-5 w-5" />
        Pending Invitations
      </h2>
      
      {invitations.map(invitation => (
        <Alert key={invitation.listId} className="bg-blue-50 border-blue-200">
          <AlertTitle>You're invited to "{invitation.listName}"</AlertTitle>
          <AlertDescription>
            <p className="text-sm">
              <span className="font-medium">{invitation.createdBy}</span> has invited you to collaborate 
              on their task list "{invitation.listName}".
            </p>
            
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleAccept(invitation.listId)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 border-red-200" onClick={() => handleReject(invitation.listId)}>
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default InvitationsList;
