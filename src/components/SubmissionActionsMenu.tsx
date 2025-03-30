
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Eye, 
  FileText, 
  MoreHorizontal, 
  XCircle 
} from 'lucide-react';
import { FormSubmission } from '@/types';

interface SubmissionActionsMenuProps {
  submission: FormSubmission;
  onView: (submission: FormSubmission) => void;
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
}

const SubmissionActionsMenu: React.FC<SubmissionActionsMenuProps> = ({
  submission,
  onView,
  onApprove,
  onReject
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(submission)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {submission.status === 'submitted' && (
          <>
            <DropdownMenuItem onClick={() => onApprove(submission.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReject(submission.id)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}
        {submission.status === 'completed' && submission.pdfUrl && (
          <DropdownMenuItem asChild>
            <a href={submission.pdfUrl} target="_blank" rel="noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              View PDF
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubmissionActionsMenu;
