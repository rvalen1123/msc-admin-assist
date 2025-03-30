
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FormSubmission } from '@/types';
import StatusBadge from './StatusBadge';
import SubmissionActionsMenu from './SubmissionActionsMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubmissionsTableProps {
  submissions: FormSubmission[];
  onViewSubmission: (submission: FormSubmission) => void;
  onApproveSubmission: (submissionId: string) => void;
  onRejectSubmission: (submissionId: string) => void;
}

// Helper function to get the form type label
const getFormTypeLabel = (templateId: string) => {
  if (templateId.startsWith('onboarding')) return 'Onboarding';
  if (templateId.startsWith('insurance')) return 'Insurance';
  if (templateId.startsWith('order')) return 'Order';
  if (templateId.startsWith('dme')) return 'DME';
  return 'Unknown';
};

// Helper to format date
const formatDate = (date?: Date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  onViewSubmission,
  onApproveSubmission,
  onRejectSubmission
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>List of all form submissions</TableCaption>
        <TableHeader>
          <TableRow>
            {!isMobile && <TableHead className="w-[70px]">ID</TableHead>}
            <TableHead className="w-[100px]">Form Type</TableHead>
            <TableHead>Submitted By</TableHead>
            {!isMobile && <TableHead className="w-[180px]">Date Submitted</TableHead>}
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[60px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 6} className="h-24 text-center">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <TableRow 
                key={submission.id} 
                className="hover:bg-muted/30 cursor-pointer"
                onClick={() => onViewSubmission(submission)}
              >
                {!isMobile && <TableCell className="font-medium">{submission.id}</TableCell>}
                <TableCell>{getFormTypeLabel(submission.templateId)}</TableCell>
                <TableCell className="truncate max-w-[120px]">
                  {submission.data.customerName || submission.data.patientName || 'Unknown'}
                </TableCell>
                {!isMobile && <TableCell>{formatDate(submission.submittedAt)}</TableCell>}
                <TableCell>
                  <StatusBadge 
                    status={submission.status} 
                    size="sm" 
                    showIcon={true}
                  />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <SubmissionActionsMenu
                    submission={submission}
                    onView={onViewSubmission}
                    onApprove={onApproveSubmission}
                    onReject={onRejectSubmission}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsTable;
