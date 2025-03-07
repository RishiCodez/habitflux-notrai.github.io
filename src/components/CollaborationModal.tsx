
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Copy, AlertTriangle, Globe, Lock } from 'lucide-react';
import { 
  updateListAccessType 
} from '../utils/realtimeDbUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  const [error, setError] = useState<string | null>(null);
  const [accessType, setAccessType] = useState<'private' | 'public'>(
    listData?.accessType || 'private'
  );
  const { toast } = useToast();

  useEffect(() => {
    if (listData?.accessType) {
      setAccessType(listData.accessType);
    }
  }, [listData]);

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

  const handleUpdateAccessType = async (newAccessType: 'private' | 'public') => {
    if (!sharedListId) return;
    
    try {
      await updateListAccessType(sharedListId, newAccessType);
      setAccessType(newAccessType);
      
      toast({
        title: "Access type updated",
        description: `List is now ${newAccessType === 'public' ? 'accessible to anyone with the link' : 'private and invitation-only'}`,
      });
      
      onDataUpdate();
    } catch (error: any) {
      toast({
        title: "Failed to update access type",
        description: error.message || "There was an error updating the access settings",
        variant: "destructive",
      });
    }
  };

  const generateShareableLink = (listId: string) => {
    // Create a shareable link with the full origin to prevent 404 errors
    return `${window.location.origin}/tasks?shared=${listId}`;
  };

  const renderFirebaseRulesHelp = () => {
    if (!error || !error.includes('Firebase Realtime Database security rules')) return null;
    
    return (
      <div className="mt-2 p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
        <h4 className="font-medium">How to fix Firebase security rules:</h4>
        <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
          <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
          <li>Select your project</li>
          <li>Navigate to "Realtime Database" in the left sidebar</li>
          <li>Click on the "Rules" tab</li>
          <li>Update the rules to allow read/write access:</li>
        </ol>
        <pre className="mt-2 bg-gray-800 text-white p-2 rounded overflow-x-auto text-xs">
{`{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}`}
        </pre>
        <p className="text-xs mt-2 italic">Note: These rules allow anyone to read/write your database. For production apps, use stricter rules.</p>
      </div>
    );
  };

  const renderCollaborators = () => {
    if (!listData || !listData.collaborators) return null;
    
    const collaborators = listData.collaborators;
    if (collaborators.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Current collaborators</h3>
        <div className="space-y-2">
          {collaborators.map((email: string) => (
            <div key={email} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="text-sm">{email}</span>
              {email === listData.createdBy && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Owner
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Share "{sharedListName}"
          </DialogTitle>
          <DialogDescription>
            Share this task list using a link. Anyone with the link can view or edit based on your access settings.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm whitespace-pre-line">{error}</p>
              {renderFirebaseRulesHelp()}
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Access control</h3>
            <RadioGroup 
              value={accessType} 
              onValueChange={(value) => handleUpdateAccessType(value as 'private' | 'public')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center cursor-pointer">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <span>Private (link only)</span>
                    <p className="text-xs text-muted-foreground">Only people with the link can access</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center cursor-pointer">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <span>Public</span>
                    <p className="text-xs text-muted-foreground">Anyone with the link can access</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {renderCollaborators()}
          
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
