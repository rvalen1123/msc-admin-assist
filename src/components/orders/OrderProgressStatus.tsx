
import React from 'react';

interface OrderProgressStatusProps {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
}

const OrderProgressStatus: React.FC<OrderProgressStatusProps> = ({ 
  currentStep, 
  totalSteps, 
  percentComplete 
}) => {
  return (
    <div className="text-sm text-gray-500">
      Step {currentStep} of {totalSteps} • {percentComplete}% Complete
    </div>
  );
};

export default OrderProgressStatus;
