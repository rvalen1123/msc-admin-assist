
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText } from 'lucide-react';
import { FormSubmission } from '@/types';

interface StatusBadgeProps {
  status: FormSubmission['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

export default StatusBadge;
