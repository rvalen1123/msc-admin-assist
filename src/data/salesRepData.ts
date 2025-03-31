
import { SalesRep } from '@/types';

export let salesReps: SalesRep[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@mscwoundcare.com',
    phone: '555-123-4567',
    territory: 'Northeast',
    active: true,
    createdAt: new Date('2022-01-15')
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@mscwoundcare.com',
    phone: '555-234-5678',
    territory: 'Southwest',
    active: true,
    createdAt: new Date('2022-03-22')
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@mscwoundcare.com',
    phone: '555-345-6789',
    territory: 'Midwest',
    active: true,
    createdAt: new Date('2022-06-10')
  }
];

export const addSalesRep = (salesRep: Omit<SalesRep, 'id' | 'createdAt'>) => {
  const newSalesRep = {
    ...salesRep,
    id: `sr-${Date.now()}`,
    createdAt: new Date()
  };
  
  salesReps = [...salesReps, newSalesRep];
  return newSalesRep;
};

export const updateSalesRep = (id: string, data: Partial<SalesRep>) => {
  salesReps = salesReps.map(rep => rep.id === id ? { ...rep, ...data } : rep);
  return salesReps.find(rep => rep.id === id);
};

export const deleteSalesRep = (id: string) => {
  salesReps = salesReps.filter(rep => rep.id !== id);
};

export const getSalesReps = () => {
  return salesReps;
};

export const getSalesRepById = (id: string) => {
  return salesReps.find(rep => rep.id === id);
};
