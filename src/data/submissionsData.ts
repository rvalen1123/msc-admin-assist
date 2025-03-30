
import { FormSubmission } from '@/types';

// Mock data for submissions
export const mockSubmissions: FormSubmission[] = [
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
  },
  {
    id: '5',
    templateId: 'insurance-2',
    userId: 'user-5',
    data: {
      patientName: 'Sarah Williams',
      insuranceProvider: 'Aetna',
      policyNumber: 'AE67890',
      productId: 'prod-5',
      manufacturerId: 'manu-2'
    },
    status: 'rejected',
    submittedAt: new Date(2023, 4, 10)
  }
];
