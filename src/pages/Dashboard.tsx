import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, ShieldCheck, Package, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { mockSubmissions } from '@/data/submissionsData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [showAllActivity, setShowAllActivity] = useState(false);
  
  // Count pending submissions (those with status 'submitted')
  const pendingSubmissionsCount = mockSubmissions.filter(
    submission => submission.status === 'submitted'
  ).length;
  
  // Count different types of pending submissions
  const pendingInsuranceCount = mockSubmissions.filter(
    submission => submission.status === 'submitted' && submission.templateId.startsWith('insurance')
  ).length;
  
  const pendingOrdersCount = mockSubmissions.filter(
    submission => submission.status === 'submitted' && submission.templateId.startsWith('order')
  ).length;

  // Get recent activity from submissions, sorted by date
  const recentActivity = [...mockSubmissions]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 3); // Get only 3 most recent for the dashboard

  // Helper function to get activity icon based on template type
  const getActivityIcon = (templateId: string) => {
    if (templateId.startsWith('onboarding')) {
      return <FileText className="h-5 w-5 text-primary" />;
    } else if (templateId.startsWith('insurance')) {
      return <ShieldCheck className="h-5 w-5 text-green-600" />;
    } else if (templateId.startsWith('order')) {
      return <Package className="h-5 w-5 text-purple-600" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get activity title based on template type and status
  const getActivityTitle = (submission: typeof mockSubmissions[0]) => {
    const type = submission.templateId.startsWith('onboarding')
      ? 'Onboarding'
      : submission.templateId.startsWith('insurance')
      ? 'Insurance Verification'
      : submission.templateId.startsWith('order')
      ? 'Order'
      : 'Form';

    const status = submission.status === 'completed'
      ? 'Completed'
      : submission.status === 'submitted'
      ? 'Submitted'
      : submission.status === 'processing'
      ? 'Processing'
      : submission.status === 'rejected'
      ? 'Rejected'
      : 'Updated';

    return `${type} ${status}`;
  };

  // Helper function to get activity description
  const getActivityDescription = (submission: typeof mockSubmissions[0]) => {
    const customerName = submission.data.customerName || submission.data.patientName || 'Unknown';
    
    if (submission.templateId.startsWith('onboarding')) {
      return `Completed onboarding for ${customerName}`;
    } else if (submission.templateId.startsWith('insurance')) {
      return `Insurance verification for ${customerName}`;
    } else if (submission.templateId.startsWith('order')) {
      return `Order processed for ${customerName}`;
    } else {
      return `Form processed for ${customerName}`;
    }
  };

  // Helper function to get the background color for the icon container
  const getIconBgColor = (templateId: string) => {
    if (templateId.startsWith('onboarding')) {
      return 'bg-blue-100';
    } else if (templateId.startsWith('insurance')) {
      return 'bg-green-100';
    } else if (templateId.startsWith('order')) {
      return 'bg-purple-100';
    } else {
      return 'bg-gray-100';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {currentUser?.name}</h1>
        <div>
          <span className="text-sm text-gray-500">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {currentUser?.role === 'admin' && pendingSubmissionsCount > 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            There {pendingSubmissionsCount === 1 ? 'is' : 'are'} {pendingSubmissionsCount} pending {pendingSubmissionsCount === 1 ? 'submission' : 'submissions'} that {pendingSubmissionsCount === 1 ? 'needs' : 'need'} your review
            {pendingInsuranceCount > 0 ? ` (${pendingInsuranceCount} insurance ${pendingInsuranceCount === 1 ? 'verification' : 'verifications'})` : ''}
            {pendingOrdersCount > 0 ? ` (${pendingOrdersCount} ${pendingOrdersCount === 1 ? 'order' : 'orders'})` : ''}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" /> Customer Onboarding
            </CardTitle>
            <CardDescription>
              Complete the onboarding process for new customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Fill out the universal customer onboarding form to register a customer with our system.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/onboarding" aria-label="Start Customer Onboarding Process">
                Start Onboarding <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Insurance Verification
            </CardTitle>
            <CardDescription>
              Verify insurance coverage for products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Submit patient and insurance information to check coverage eligibility.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/insurance" aria-label="Start Insurance Verification Process">
                Verify Insurance <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" /> Order Products
            </CardTitle>
            <CardDescription>
              Place new orders for medical supplies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Select products, specify quantities, and submit orders to manufacturers.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/orders" aria-label="Start Order Products Process">
                Place Order <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity.map((submission) => (
                <div key={submission.id} className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${getIconBgColor(submission.templateId)} flex items-center justify-center mr-4`}>
                      {getActivityIcon(submission.templateId)}
                    </div>
                    <div>
                      <p className="font-medium">{getActivityTitle(submission)}</p>
                      <p className="text-sm text-gray-500">{getActivityDescription(submission)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" /> {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-4 py-3">
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowAllActivity(true)}>
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Dialog for viewing all activity */}
      <Dialog open={showAllActivity} onOpenChange={setShowAllActivity}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Activity</DialogTitle>
          </DialogHeader>
          <div className="divide-y">
            {mockSubmissions
              .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
              .map((submission) => (
                <div key={submission.id} className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${getIconBgColor(submission.templateId)} flex items-center justify-center mr-4`}>
                      {getActivityIcon(submission.templateId)}
                    </div>
                    <div>
                      <p className="font-medium">{getActivityTitle(submission)}</p>
                      <p className="text-sm text-gray-500">{getActivityDescription(submission)}</p>
                      <p className="text-xs text-gray-400">ID: {submission.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {submission.submittedAt.toLocaleDateString()}
                    </p>
                    {submission.status === 'completed' && (
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link to={`/submissions?id=${submission.id}`}>
                          View Details
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
