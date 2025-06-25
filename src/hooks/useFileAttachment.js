import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useFileAttachment = () => {
  const [attachedFile, setAttachedFile] = useState(null);
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFile({
          file: file,
          preview: reader.result,
          type: 'image'
        });
      };
      reader.readAsDataURL(file);
    } else if (['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({
        title: "Fonctionnalité en développement",
        description: "L'envoi de documents pour la base de connaissances sera bientôt disponible.",
      });
      e.target.value = null;
    } else {
      toast({
        title: "Fichier non supporté",
        description: "Veuillez sélectionner un fichier image, PDF, DOCX ou TXT.",
        variant: "destructive"
      });
      e.target.value = null;
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  return {
    attachedFile,
    handleFileSelect,
    removeAttachedFile,
  };
};