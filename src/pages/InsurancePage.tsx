import React, { useEffect, useRef } from 'react';
import { useForm } from '@/context/FormContext';
import InsuranceForm from '@/components/insurance/InsuranceForm';

const InsurancePage: React.FC = () => {
  const { activeForm, setActiveForm } = useForm();
  const isInitialized = useRef(false);
  
  // Set active form type to insurance on component mount, but only if it's not already set
  useEffect(() => {
    if (!isInitialized.current && (!activeForm || activeForm.id !== 'insurance')) {
      setActiveForm('insurance');
      isInitialized.current = true;
    }
  }, [setActiveForm, activeForm]);

  return <InsuranceForm />;
};

export default InsurancePage;
