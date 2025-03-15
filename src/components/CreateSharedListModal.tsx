
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, List, Copy, CheckCircle } from 'lucide-react';
import { createSharedTaskList, generateShareableLink } from '../utils/realtimeDbUtils';
import { toast } from 'sonner';

interface CreateSharedListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListCreated: (listId: string, listName: string) => void;
  currentUserEmail: string;
}

const CreateSharedListModal: React.FC<CreateSharedListModalProps> = ({
  isOpen,
  onClose,
  onListCreated,
  currentUserEmail
}) => {
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1); // 1 = initial form, 2 = creating, 3 = success
  const [createdListId, setCreatedListId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateList = async () => {
    if (!listName.trim()) {
      toast.error('Please enter a name for your shared list');
      return;
    }
    
    setIsCreating(true);
    setStep(2);
    
    try {
      const newSharedListId = await createSharedTaskList(
        listName, 
        currentUserEmail, 
        listDescription
      );
      
      // Store the created list ID
      setCreatedListId(newSharedListId);
      
      toast.success(`"${listName}" collaborative list has been created.`);
      
      // Move to success step
      setStep(3);
      
      // Callback to parent component
      onListCreated(newSharedListId, listName);
    } catch (error: any) {
      console.error('Error creating shared list:', error);
      toast.error(error.message || 'Failed to create shared list');
      setStep(1);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setListName('');
    setListDescription('');
    setStep(1);
    setCreatedListId(null);
    setIsCopied(false);
    onClose();
  };
  
  const handleCopyLink = () => {
    if (!createdListId) return;
    
    const shareableLink = generateShareableLink(createdListId);
    
    // Use navigator.clipboard API to copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setIsCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        toast.error('Failed to copy link to clipboard');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            {step === 3 ? 'Collaborative List Created!' : 'Create Collaborative Task List'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Create a shared task list that you can collaborate on with others in real-time.'}
            {step === 2 && 'Creating your collaborative list...'}
            {step === 3 && 'Your collaborative list has been created successfully!'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="shared-list-name" className="text-sm font-medium">
                List Name*
              </label>
              <Input
                id="shared-list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter a name for your shared list"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="shared-list-description" className="text-sm font-medium">
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="shared-list-description"
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Enter a description for this collaborative list"
                rows={3}
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="mt-4 text-center">Creating your collaborative list...</p>
          </div>
        )}
        
        {step === 3 && (
          <div className="py-4 space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <List className="mr-2 h-4 w-4" />
                <span className="font-medium">{listName}</span>
              </div>
              {listDescription && (
                <p className="text-sm text-muted-foreground">{listDescription}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">
                Your collaborative list has been created successfully! You can now:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Add tasks to the list</li>
                <li>Invite collaborators to work with you</li>
                <li>Share the list with a link</li>
              </ul>
            </div>
            
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Shareable Link</label>
              <div className="flex items-center gap-2">
                <Input 
                  value={createdListId ? generateShareableLink(createdListId) : ''} 
                  readOnly 
                  className="text-xs sm:text-sm" 
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyLink}
                  className="shrink-0 flex items-center"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link to invite others to your collaborative list
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateList}
                disabled={isCreating || !listName.trim()}
              >
                Create Shared List
              </Button>
            </>
          )}
          
          {step === 3 && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSharedListModal;
