
import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface DocuSealRedirectProps {
  manufacturerId?: string;
}

const DocuSealRedirect: React.FC<DocuSealRedirectProps> = ({ manufacturerId }) => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    // Simulate redirect to DocuSeal for manufacturer-specific forms
    const redirectTimer = setTimeout(() => {
      toast({
        title: "Redirecting",
        description: "Opening DocuSeal for manufacturer forms...",
      });
      
      setTimeout(() => {
        window.open('https://docuseal.co', '_blank');
      }, 1500);
    }, 1000);
    
    return () => clearTimeout(redirectTimer);
  }, [toast]);

  return (
    <div className="text-center py-4">
      <p className="text-gray-500">
        Redirecting to document signing service...
      </p>
    </div>
  );
};

export default DocuSealRedirect;
