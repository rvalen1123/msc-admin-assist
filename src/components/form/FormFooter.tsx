
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: (e: React.FormEvent) => void;
  isLastStep: boolean;
  isLoading: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLastStep,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      
      <div className="text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>
      
      <Button
        type="submit"
        onClick={(e) => onNext(e)}
        disabled={isLoading}
      >
        {isLoading ? (
          'Processing...'
        ) : isLastStep ? (
          'Submit Form'
        ) : (
          <>Continue <ChevronRight className="h-4 w-4 ml-1" /></>
        )}
      </Button>
    </div>
  );
};

export default FormFooter;
