
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Copy } from 'lucide-react';

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
  const { toast } = useToast();

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

  const generateShareableLink = (listId: string) => {
    // Create a shareable link with the full origin to prevent 404 errors
    return `${window.location.origin}/tasks?shared=${listId}`;
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
        
        <div className="flex flex-col gap-4 py-4">
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
