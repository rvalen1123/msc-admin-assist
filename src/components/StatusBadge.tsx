
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import { FormSubmission } from '@/types';

export type StatusVariant = 'default' | 'outline' | 'secondary';
export type StatusSize = 'default' | 'sm' | 'lg';

interface StatusBadgeProps {
  status: FormSubmission['status'] | string;
  variant?: StatusVariant;
  size?: StatusSize;
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'outline', 
  size = 'default', 
  showIcon = true,
  className = '',
  customLabel
}) => {
  // Define styling based on status
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'draft':
        return {
          icon: <Clock className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Draft',
          className: 'bg-gray-100 text-gray-800'
        };
      case 'submitted':
        return {
          icon: <FileText className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Submitted',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'processing':
        return {
          icon: <Clock className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Processing',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Completed',
          className: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          icon: <XCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Rejected',
          className: 'bg-red-100 text-red-800'
        };
      case 'error':
        return {
          icon: <AlertCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || 'Error',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <AlertCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />,
          label: customLabel || status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { icon, label, className: statusClassName } = getStatusConfig();
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0 px-2',
    default: 'text-xs py-0.5 px-2.5',
    lg: 'text-sm py-1 px-3'
  };

  return (
    <Badge 
      variant={variant as any} 
      className={`${statusClassName} ${sizeClasses[size]} flex items-center gap-1 ${className}`}
    >
      {showIcon && icon}
      {label}
    </Badge>
  );
};

export default StatusBadge;
