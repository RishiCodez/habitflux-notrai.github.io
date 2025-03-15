
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Users, Copy, Link, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getSharedListDetails, generateShareableLink, addCollaborator } from '../utils/realtimeDbUtils';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedListId: string | null;
  sharedListName: string;
  listData: any;
  onDataUpdate: () => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  sharedListId,
  sharedListName,
  listData,
  onDataUpdate
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [listDetails, setListDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListDetails = async () => {
      if (sharedListId && isOpen) {
        setIsLoading(true);
        try {
          const details = await getSharedListDetails(sharedListId);
          setListDetails(details);
        } catch (error) {
          console.error("Error fetching list details:", error);
          toast({
            title: "Error loading list details",
            description: "Could not load the shared list information",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchListDetails();
  }, [sharedListId, isOpen, toast]);

  const handleCopyLink = () => {
    if (!sharedListId) return;
    
    const shareableLink = generateShareableLink(sharedListId);
    navigator.clipboard.writeText(shareableLink);
    
    setIsCopied(true);
    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddCollaborator = async () => {
    if (!sharedListId || !collaboratorEmail) return;
    
    setIsAddingCollaborator(true);
    try {
      await addCollaborator(sharedListId, collaboratorEmail);
      toast({
        title: "Collaborator invited",
        description: `An invitation has been sent to ${collaboratorEmail}`,
      });
      setCollaboratorEmail('');
      onDataUpdate();
    } catch (error) {
      console.error("Error adding collaborator:", error);
      toast({
        title: "Failed to add collaborator",
        description: "There was an error sending the invitation",
        variant: "destructive",
      });
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Share "{sharedListName}"
          </DialogTitle>
          <DialogDescription id="modal-description">
            Share this task list using a link. Anyone with the link can view or edit the list.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse">Loading list details...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {listDetails && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-1">List Information</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Created by: {listDetails.createdBy}
                </p>
                {listDetails.description && (
                  <p className="text-sm mb-1">{listDetails.description}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(listDetails.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-sm font-medium">Share link</h3>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={sharedListId ? generateShareableLink(sharedListId) : ''}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleCopyLink}>
                  {isCopied ? "Copied!" : "Copy"}
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This link will be in the format: habitflux.notrai.cloud/{sharedListId}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="text-sm font-medium">Invite collaborators</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter email address"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  className="flex-1"
                  type="email"
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddCollaborator}
                  disabled={isAddingCollaborator || !collaboratorEmail}
                >
                  {isAddingCollaborator ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </div>
            
            {listDetails?.collaborators?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Collaborators</h3>
                <div className="max-h-24 overflow-y-auto">
                  {listDetails.collaborators.map((email: string) => (
                    <div key={email} className="flex items-center gap-2 py-1 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {listDetails?.pendingInvitations && Object.keys(listDetails.pendingInvitations).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Pending Invitations</h3>
                <div className="max-h-24 overflow-y-auto">
                  {Object.entries(listDetails.pendingInvitations).map(([email, data]: [string, any]) => (
                    <div key={email} className="flex items-center gap-2 py-1 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      {email} - Invited {new Date(data.invitedAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationModal;
