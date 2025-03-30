
import React, { useEffect } from 'react';
import { useForm } from '@/context/FormContext';
import InsuranceForm from '@/components/insurance/InsuranceForm';

const InsurancePage: React.FC = () => {
  const { activeForm, setActiveForm } = useForm();
  
  // Set active form type to insurance on component mount, but only if it's not already set
  useEffect(() => {
    if (!activeForm || activeForm.id !== 'insurance') {
      setActiveForm('insurance');
    }
  }, [setActiveForm, activeForm]);

  return <InsuranceForm />;
};

export default InsurancePage;
