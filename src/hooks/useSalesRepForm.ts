
import { useForm } from 'react-hook-form';
import { SalesRep } from '@/types';
import { toast } from '@/hooks/use-toast';

interface UseSalesRepFormProps {
  initialData?: Partial<SalesRep>;
  onSubmit: (data: Omit<SalesRep, 'id' | 'createdAt'>) => void;
  isEdit?: boolean;
}

export function useSalesRepForm({ 
  initialData = {}, 
  onSubmit, 
  isEdit = false 
}: UseSalesRepFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      territory: initialData.territory || '',
      active: initialData.active !== undefined ? initialData.active : true,
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    form.reset();
    toast({
      title: isEdit ? "Sales Rep Updated" : "Sales Rep Added",
      description: isEdit 
        ? `${data.name} has been updated successfully.`
        : `${data.name} has been added to the team.`,
    });
  };

  return {
    form,
    handleSubmit
  };
}
