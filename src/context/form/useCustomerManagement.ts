import { useState, useEffect, useRef } from 'react';
import { CustomerData } from '../../types';
// Comment out the API import temporarily
// import { customerService } from '../../lib/services/customerService';

// Mock data for testing
const MOCK_CUSTOMERS: CustomerData[] = [
  {
    id: 'customer-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    company: 'Acme Inc.'
  },
  {
    id: 'customer-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    company: 'TechCorp'
  }
];

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const addCustomer = (customer: CustomerData): string => {
    // Generate ID if not provided
    const customerId = customer.id || `customer-${Date.now()}`;
    const newCustomer = { ...customer, id: customerId };
    
    // Check if customer already exists
    const existingIndex = customers.findIndex(c => c.id === customerId);
    
    if (existingIndex >= 0) {
      // Update existing customer
      const updatedCustomers = [...customers];
      updatedCustomers[existingIndex] = newCustomer;
      setCustomers(updatedCustomers);
    } else {
      // Add new customer
      setCustomers(prev => [...prev, newCustomer]);
    }
    
    return customerId;
  };
  
  const updateCustomer = (id: string, data: Partial<CustomerData>): boolean => {
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return false;
    }
    
    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = {
      ...updatedCustomers[customerIndex],
      ...data
    };
    
    setCustomers(updatedCustomers);
    return true;
  };
  
  const getCustomers = (): CustomerData[] => {
    return customers;
  };
  
  const getCustomerById = (id: string): CustomerData | undefined => {
    return customers.find(c => c.id === id);
  };

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById
  };
};
