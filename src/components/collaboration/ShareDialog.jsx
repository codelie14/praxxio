import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardCopy, Check } from 'lucide-react';

const ShareDialog = ({ open, onOpenChange, chatTitle }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/shared/${btoa(chatTitle)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast({
      title: "Lien copié !",
      description: "Le lien de partage a été copié dans le presse-papiers."
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager la conversation</DialogTitle>
          <DialogDescription>
            Copiez ce lien pour partager cette conversation. Pour le moment, cette fonctionnalité est une démonstration. Une collaboration en temps réel nécessitera une intégration backend.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Lien
            </Label>
            <Input id="link" defaultValue={shareUrl} readOnly />
          </div>
          <Button type="submit" size="icon" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copier</span>
            {isCopied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <p className="text-xs text-muted-foreground">
            Le partage en temps réel sera activé après la configuration d'un service comme Supabase.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;