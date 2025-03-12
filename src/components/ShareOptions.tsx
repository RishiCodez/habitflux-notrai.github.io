
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Share2, X } from 'lucide-react';

interface ShareOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  taskList: any[];
  isSharedList?: boolean;
  sharedListLink?: string;
  listName: string;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({
  isOpen,
  onClose,
  taskList,
  isSharedList = false,
  sharedListLink,
  listName
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const getShareableLink = () => {
    if (isSharedList && sharedListLink) {
      // Extract list ID from the URL
      const listId = sharedListLink?.split('/').pop() || '';
      return `https://notrai.cloud/${listId}`;
    }
    return '';
  };

  const getTaskListText = () => {
    if (isSharedList) {
      // For shared lists, just return the link
      const shareableLink = getShareableLink();
      return `Join my shared todo list: "${listName}"\n${shareableLink}\nCreated with Notrai Habitflux`;
    } else {
      let text = `Hi! My todo list: "${listName}"\n`;
      taskList.forEach((task, index) => {
        text += `${index + 1}. ${task.title}\n`;
      });
      text += "\nI created this using Notrai Habitflux";
      return text;
    }
  };

  const handleCopyToClipboard = () => {
    if (isSharedList) {
      // For shared lists, copy only the link
      const shareableLink = getShareableLink();
      navigator.clipboard.writeText(shareableLink);
    } else {
      // For regular lists, copy the task list text
      const text = getTaskListText();
      navigator.clipboard.writeText(text);
    }
    
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: isSharedList ? "Shareable link copied to clipboard" : "The task list has been copied to your clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareViaTwitter = () => {
    const text = getTaskListText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  const handleShareViaEmail = () => {
    const text = getTaskListText();
    const subject = isSharedList ? `Join my shared todo list: "${listName}"` : `My todo list: "${listName}"`;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(text);
    window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
  };

  const handleShareViaWhatsApp = () => {
    const text = getTaskListText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="share-description">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share {isSharedList ? "Collaborative" : ""} Task List
          </DialogTitle>
          <div id="share-description" className="text-sm text-muted-foreground">
            Share your task list with others through various methods.
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="flex justify-start" 
              onClick={handleCopyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              {isCopied ? "Copied!" : isSharedList ? "Copy shareable link" : "Copy to clipboard"}
            </Button>
            
            {!isSharedList && (
              <>
                <Button 
                  variant="outline" 
                  className="flex justify-start bg-blue-50 hover:bg-blue-100 text-blue-600" 
                  onClick={handleShareViaTwitter}
                >
                  <X className="mr-2 h-4 w-4" />
                  Share on X (Twitter)
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex justify-start bg-red-50 hover:bg-red-100 text-red-600" 
                  onClick={handleShareViaEmail}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex justify-start bg-green-50 hover:bg-green-100 text-green-600" 
                  onClick={handleShareViaWhatsApp}
                >
                  <svg 
                    className="mr-2 h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share via WhatsApp
                </Button>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareOptions;
