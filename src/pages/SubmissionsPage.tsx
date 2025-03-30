
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { FormSubmission } from '@/types';
import SubmissionsTable from '@/components/SubmissionsTable';
import SubmissionDetailsDialog from '@/components/SubmissionDetailsDialog';
import { mockSubmissions } from '@/data/submissionsData';

const SubmissionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FormSubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Check if the user is an admin, if not redirect
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page.",
        variant: "destructive"
      });
    }
  }, [currentUser, navigate, toast]);

  const handleApprove = (submissionId: string) => {
    // In a real app, this would call an API to update the submission
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'completed' as const, completedAt: new Date() }
        : sub
    ));
    
    toast({
      title: "Submission Approved",
      description: "The submission has been approved and sent for DocuSeal processing.",
    });
    
    // Close dialog if it was opened
    setDetailsDialogOpen(false);
  };

  const handleReject = (submissionId: string) => {
    // In a real app, this would call an API to update the submission
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'draft' as const }
        : sub
    ));
    
    toast({
      title: "Submission Rejected",
      description: "The submission has been returned to draft status.",
      variant: "destructive"
    });
    
    // Close dialog if it was opened
    setDetailsDialogOpen(false);
  };

  const handleView = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submissions Review</h1>
        <p className="text-gray-600">Review and process form submissions</p>
      </header>

      <SubmissionsTable
        submissions={submissions}
        onViewSubmission={handleView}
        onApproveSubmission={handleApprove}
        onRejectSubmission={handleReject}
      />

      <SubmissionDetailsDialog
        submission={selectedSubmission}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default SubmissionsPage;
