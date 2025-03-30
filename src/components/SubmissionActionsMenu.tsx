
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Download,
  Eye, 
  FileText, 
  MoreHorizontal, 
  Pencil, 
  Trash,
  XCircle
} from 'lucide-react';
import { FormSubmission } from '@/types';

export interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  condition?: boolean;
  variant?: 'default' | 'destructive';
}

interface SubmissionActionsMenuProps {
  submission: FormSubmission;
  onView?: (submission: FormSubmission) => void;
  onApprove?: (submissionId: string) => void;
  onReject?: (submissionId: string) => void;
  onEdit?: (submission: FormSubmission) => void;
  onDelete?: (submissionId: string) => void;
  onDownload?: (submissionId: string) => void;
  triggerButton?: React.ReactNode;
  title?: string;
  align?: 'start' | 'end' | 'center';
  additionalActions?: Action[];
  disabled?: boolean;
  disabledMessage?: string;
}

const SubmissionActionsMenu: React.FC<SubmissionActionsMenuProps> = ({
  submission,
  onView,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onDownload,
  triggerButton,
  title,
  align = 'end',
  additionalActions = [],
  disabled = false,
  disabledMessage
}) => {
  // Default actions based on provided handlers
  const defaultActions: Action[] = [
    ...(onView ? [{
      label: 'View Details',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: () => onView(submission),
      condition: true
    }] : []),
    ...(onEdit ? [{
      label: 'Edit',
      icon: <Pencil className="mr-2 h-4 w-4" />,
      onClick: () => onEdit(submission),
      condition: submission.status === 'draft'
    }] : []),
    ...(onApprove ? [{
      label: 'Approve',
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
      onClick: () => onApprove(submission.id),
      condition: submission.status === 'submitted'
    }] : []),
    ...(onReject ? [{
      label: 'Reject',
      icon: <XCircle className="mr-2 h-4 w-4" />,
      onClick: () => onReject(submission.id),
      condition: submission.status === 'submitted',
      variant: 'destructive'
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: <Trash className="mr-2 h-4 w-4" />,
      onClick: () => onDelete(submission.id),
      condition: ['draft', 'rejected'].includes(submission.status),
      variant: 'destructive'
    }] : []),
    ...(onDownload ? [{
      label: 'Download',
      icon: <Download className="mr-2 h-4 w-4" />,
      onClick: () => onDownload(submission.id),
      condition: true
    }] : [])
  ];

  // Combine default and additional actions
  const allActions = [...defaultActions, ...additionalActions];
  const visibleActions = allActions.filter(action => action.condition !== false);

  // Special case for PDF link
  const hasPdfUrl = submission.status === 'completed' && submission.pdfUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {triggerButton || (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[180px]">
        {title && (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        
        {disabled && disabledMessage ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">{disabledMessage}</div>
        ) : (
          <>
            {visibleActions.map((action, index) => (
              <DropdownMenuItem 
                key={index} 
                onClick={action.onClick}
                className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
            
            {hasPdfUrl && (
              <DropdownMenuItem asChild>
                <a href={submission.pdfUrl} target="_blank" rel="noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  View PDF
                </a>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubmissionActionsMenu;
