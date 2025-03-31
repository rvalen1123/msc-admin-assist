
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OrderProgressStatus from './OrderProgressStatus';

interface OrderFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
  onPrevious: () => void;
  loading: boolean;
  isProductsStepEmpty?: boolean;
}

const OrderFormNavigation: React.FC<OrderFormNavigationProps> = ({
  currentStep,
  totalSteps,
  percentComplete,
  onPrevious,
  loading,
  isProductsStepEmpty
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || loading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      
      <OrderProgressStatus
        currentStep={currentStep}
        totalSteps={totalSteps}
        percentComplete={percentComplete}
      />
      
      <Button
        type="submit"
        disabled={loading || (currentStep === 4 && isProductsStepEmpty)}
      >
        {loading ? (
          'Processing...'
        ) : currentStep === totalSteps ? (
          'Place Order'
        ) : (
          <>Continue <ChevronRight className="h-4 w-4 ml-1" /></>
        )}
      </Button>
    </div>
  );
};

export default OrderFormNavigation;
