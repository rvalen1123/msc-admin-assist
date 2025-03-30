
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  MoreHorizontal, 
  XCircle,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { FormSubmission } from '@/types';

// Mock data for submissions
const mockSubmissions: FormSubmission[] = [
  {
    id: '1',
    templateId: 'onboarding-1',
    userId: 'user-1',
    data: {
      customerName: 'ABC Healthcare',
      contactName: 'John Doe',
      email: 'john@abchealthcare.com',
      phone: '555-123-4567',
      productId: 'prod-1',
      manufacturerId: 'manu-1'
    },
    status: 'submitted',
    submittedAt: new Date(2023, 4, 15)
  },
  {
    id: '2',
    templateId: 'insurance-1',
    userId: 'user-2',
    data: {
      patientName: 'Jane Smith',
      insuranceProvider: 'Blue Cross',
      policyNumber: 'BC12345',
      productId: 'prod-2',
      manufacturerId: 'manu-2'
    },
    status: 'processing',
    submittedAt: new Date(2023, 4, 18)
  },
  {
    id: '3',
    templateId: 'order-1',
    userId: 'user-3',
    data: {
      customerName: 'XYZ Medical',
      items: ['Product A', 'Product B'],
      quantity: 5,
      productId: 'prod-3',
      manufacturerId: 'manu-1'
    },
    status: 'draft',
    submittedAt: new Date(2023, 4, 20)
  },
  {
    id: '4',
    templateId: 'dme-1',
    userId: 'user-4',
    data: {
      patientName: 'Robert Johnson',
      equipment: 'Wheelchair',
      productId: 'prod-4',
      manufacturerId: 'manu-3'
    },
    status: 'completed',
    submittedAt: new Date(2023, 4, 12),
    completedAt: new Date(2023, 4, 14),
    pdfUrl: 'https://example.com/document.pdf'
  }
];

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

const SubmissionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FormSubmission[]>(mockSubmissions);

  // Check if the user is an admin, if not redirect
  React.useEffect(() => {
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
  };

  const handleView = (submission: FormSubmission) => {
    // In a real app, this would navigate to a detailed view of the submission
    toast({
      title: "Viewing Submission",
      description: `Opening ${getFormTypeLabel(submission.templateId)} submission details.`,
    });
  };

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
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submissions Review</h1>
        <p className="text-gray-600">Review and process form submissions</p>
      </header>

      <Table>
        <TableCaption>List of all form submissions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Form Type</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.id}</TableCell>
              <TableCell>{getFormTypeLabel(submission.templateId)}</TableCell>
              <TableCell>{submission.data.customerName || submission.data.patientName || 'Unknown'}</TableCell>
              <TableCell>{formatDate(submission.submittedAt)}</TableCell>
              <TableCell>{getStatusBadge(submission.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(submission)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {submission.status === 'submitted' && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(submission.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(submission.id)}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsPage;
