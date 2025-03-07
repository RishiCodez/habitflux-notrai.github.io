
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, X } from 'lucide-react';

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

  const getTaskListText = () => {
    if (isSharedList) {
      return `Join my shared todo list: "${listName}"\n${sharedListLink}\nCreated by Selflo.app`;
    } else {
      let text = `Hi! My todo list: "${listName}"\n`;
      taskList.forEach((task, index) => {
        text += `${index + 1}. ${task.title}\n`;
      });
      text += "\nI created this using Selflo.app";
      return text;
    }
  };

  const handleCopyToClipboard = () => {
    const text = getTaskListText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The task list has been copied to your clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Copy className="mr-2 h-5 w-5" />
            Share Task List
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="flex justify-start" 
              onClick={handleCopyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              {isCopied ? "Copied!" : "Copy to clipboard"}
            </Button>
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
