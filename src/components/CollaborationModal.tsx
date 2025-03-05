
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Copy, Link, Mail, Share2 } from 'lucide-react';
import { addCollaborator, generateShareableLink } from '../utils/realtimeDbUtils';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedListId: string | null;
  sharedListName: string;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  sharedListId,
  sharedListName
}) => {
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleAddCollaborator = async () => {
    if (!email.trim() || !sharedListId) return;
    
    try {
      // In a real app, you'd send an invitation email here
      // For now, we'll just add the email to the collaborators list
      await addCollaborator(sharedListId, email);
      
      toast({
        title: "Collaborator added",
        description: `${email} has been added to "${sharedListName}"`,
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Failed to add collaborator",
        description: "There was an error adding the collaborator",
        variant: "destructive",
      });
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Collaborate on "{sharedListName}"
          </DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this task list in real-time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Add collaborators</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCollaborator}>
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
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
          </div>
          
          <div className="flex justify-center gap-4 mt-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
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
