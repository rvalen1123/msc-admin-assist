
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SalesRep } from '@/types';
import { useSalesRepForm } from '@/hooks/useSalesRepForm';
import SalesRepFormFields from './SalesRepFormFields';

interface SalesRepFormProps {
  onSubmit: (data: Omit<SalesRep, 'id' | 'createdAt'>) => void;
  initialData?: Partial<SalesRep>;
  isEdit?: boolean;
}

const SalesRepForm: React.FC<SalesRepFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEdit = false 
}) => {
  const { form, handleSubmit } = useSalesRepForm({
    initialData,
    onSubmit,
    isEdit
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Sales Representative' : 'Add New Sales Representative'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <SalesRepFormFields form={form} />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update' : 'Add'} Sales Rep
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SalesRepForm;
