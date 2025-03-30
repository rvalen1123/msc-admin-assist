
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import { FormSubmission } from '@/types';

interface SubmissionDetailsDialogProps {
  submission: FormSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const SubmissionDetailsDialog: React.FC<SubmissionDetailsDialogProps> = ({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  if (!submission) return null;

  // Helper function to format date
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

  // Helper function to get the form type label
  const getFormTypeLabel = (templateId: string) => {
    if (templateId.startsWith('onboarding')) return 'Onboarding';
    if (templateId.startsWith('insurance')) return 'Insurance';
    if (templateId.startsWith('order')) return 'Order';
    if (templateId.startsWith('dme')) return 'DME';
    return 'Unknown';
  };

  // Helper function to get status badge
  const getStatusBadge = (status: FormSubmission['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1"><Clock className="h-3 w-3" /> Draft</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1"><FileText className="h-3 w-3" /> Submitted</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" /> Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Submission Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">{getFormTypeLabel(submission.templateId)} Form</h2>
              <p className="text-sm text-gray-500">ID: {submission.id}</p>
            </div>
            <div>{getStatusBadge(submission.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">Submitted At</div>
              <div className="text-sm">{formatDate(submission.submittedAt)}</div>
            </div>
            
            {submission.status === 'completed' && submission.completedAt && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Completed At</div>
                <div className="text-sm">{formatDate(submission.completedAt)}</div>
              </div>
            )}
          </div>

          <div className="border rounded-md p-4 mb-6">
            <h3 className="font-medium mb-3">Form Data</h3>
            <div className="space-y-2">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 text-sm">
                  <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div>
                    {Array.isArray(value) 
                      ? value.join(', ') 
                      : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {submission.status === 'submitted' && (
            <div className="flex justify-end gap-3 mt-4">
              {onReject && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => onReject(submission.id)}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              )}
              {onApprove && (
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => onApprove(submission.id)}
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
              )}
            </div>
          )}
          
          {submission.status === 'completed' && submission.pdfUrl && (
            <div className="flex justify-end mt-4">
              <Button asChild>
                <a href={submission.pdfUrl} target="_blank" rel="noreferrer">
                  <FileText className="mr-2 h-4 w-4" /> View Document
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsDialog;
