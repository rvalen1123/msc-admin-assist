
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
import NotFound from "./pages/NotFound";

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
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="onboarding" element={<OnboardingPage />} />
                  <Route path="insurance" element={<InsurancePage />} />
                  <Route path="orders" element={<OrderPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="submissions" element={<SubmissionsPage />} />
                  <Route path="sales-reps" element={<SalesRepPage />} />
                  <Route path="products" element={<ProductsPage />} />
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
