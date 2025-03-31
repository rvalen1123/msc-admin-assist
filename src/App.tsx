import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FormProvider } from "./context/FormContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import InsurancePage from "./pages/InsurancePage";
import OrderPage from "./pages/OrderPage";
import CustomersPage from "./pages/CustomersPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SalesRepPage from "./pages/SalesRepPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <FormProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="onboarding" element={<OnboardingPage />} />
                  <Route path="insurance" element={<InsurancePage />} />
                  <Route path="orders" element={<OrderPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="submissions" element={<SubmissionsPage />} />
                  
                  {/* Admin-only routes */}
                  <Route path="sales-reps" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SalesRepPage />
                    </ProtectedRoute>
                  } />
                  <Route path="products" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FormProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
