
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
                index === steps.length - 1 ? "w-auto" : "w-full"
              )}
            >
              <button
                className={cn(
                  "form-step z-10",
                  isActive ? "form-step-active" : "",
                  isCompleted ? "form-step-completed" : "",
                  !isActive && !isCompleted ? "form-step-pending" : "",
                )}
                onClick={() => allowNavigation && onStepClick && onStepClick(index + 1)}
                disabled={!allowNavigation}
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
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 sm:hidden">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default FormStepIndicator;
