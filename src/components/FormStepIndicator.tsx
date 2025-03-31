import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface FormStepIndicatorProps {
  currentStep: number;
  steps: { id: string; title: string }[];
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick,
  allowNavigation = false,
}) => {
  return (
    <div className="mb-8">
      <div className="hidden sm:flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          
          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-col items-center",
                "flex-1"
              )}
            >
              <button
                className={cn(
                  "form-step z-10 transition-all duration-200 shadow-sm",
                  isActive ? "form-step-active" : "",
                  isCompleted ? "form-step-completed" : "",
                  !isActive && !isCompleted ? "form-step-pending" : "",
                )}
                onClick={() => allowNavigation && onStepClick && onStepClick(index + 1)}
                disabled={!allowNavigation}
                aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? ' (Completed)' : ''}${isActive ? ' (Current)' : ''}`}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </button>
              
              <span className="text-xs mt-2 font-medium text-center">
                {step.title}
              </span>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 w-full h-[2px] left-1/2",
                    isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="sm:hidden flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-medium">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
      
      <div className="sm:hidden w-full px-2">
        <Progress 
          value={(currentStep / steps.length) * 100} 
          className="h-2 rounded-full w-full"
        />
      </div>
    </div>
  );
};

export default FormStepIndicator;
