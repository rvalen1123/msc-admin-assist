
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, ShieldCheck, Package, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {currentUser?.name}</h1>
        <div>
          <span className="text-sm text-gray-500">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {currentUser?.role === 'admin' && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            There are 5 pending insurance verifications and 3 new orders that need your review.
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
              <Link to="/onboarding">Start Onboarding <ChevronRight className="h-4 w-4 ml-1" /></Link>
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
              <Link to="/insurance">Verify Insurance <ChevronRight className="h-4 w-4 ml-1" /></Link>
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
              <Link to="/orders">Place Order <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">ABC Medical Group Onboarding</p>
                    <p className="text-sm text-gray-500">Completed onboarding for a new customer</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" /> 2 hours ago
                </div>
              </div>

              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Insurance Verified</p>
                    <p className="text-sm text-gray-500">Coverage confirmed for Patient #12345</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" /> 1 day ago
                </div>
              </div>

              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Submitted</p>
                    <p className="text-sm text-gray-500">Order #ORD-7890 was placed</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" /> 2 days ago
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-4 py-3">
            <Button variant="ghost" size="sm" className="ml-auto">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
