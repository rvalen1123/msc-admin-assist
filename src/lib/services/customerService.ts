/**
 * Service for interacting with the customer API endpoints
 */
import { apiService } from '../api';
import { Customer, CustomerData, Contact } from '../../types';

export const customerService = {
  /**
   * Get a list of all customers
   * @returns Promise with array of customers
   */
  async getCustomers(): Promise<Customer[]> {
    return await apiService.get<Customer[]>('/customers');
  },

  /**
   * Get a single customer by ID
   * @param id - Customer ID
   * @returns Promise with customer data
   */
  async getCustomer(id: string): Promise<CustomerData> {
    return await apiService.get<CustomerData>(`/customers/${id}`);
  },

  /**
   * Create a new customer
   * @param customerData - Customer data
   * @returns Promise with created customer
   */
  async createCustomer(customerData: Partial<CustomerData>): Promise<CustomerData> {
    return await apiService.post<CustomerData>('/customers', customerData);
  },

  /**
   * Update an existing customer
   * @param id - Customer ID
   * @param customerData - Updated customer data
   * @returns Promise with updated customer
   */
  async updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<CustomerData> {
    return await apiService.patch<CustomerData>(`/customers/${id}`, customerData);
  },

  /**
   * Delete a customer
   * @param id - Customer ID
   * @returns Promise with deletion status
   */
  async deleteCustomer(id: string): Promise<void> {
    return await apiService.delete<void>(`/customers/${id}`);
  },

  /**
   * Add a contact to a customer
   * @param customerId - Customer ID
   * @param contactData - Contact data
   * @returns Promise with updated customer
   */
  async addContact(customerId: string, contactData: Partial<Contact>): Promise<CustomerData> {
    return await apiService.post<CustomerData>(`/customers/${customerId}/contacts`, contactData);
  },

  /**
   * Update a customer contact
   * @param customerId - Customer ID
   * @param contactId - Contact ID
   * @param contactData - Updated contact data
   * @returns Promise with updated customer
   */
  async updateContact(
    customerId: string, 
    contactId: string, 
    contactData: Partial<Contact>
  ): Promise<CustomerData> {
    return await apiService.patch<CustomerData>(
      `/customers/${customerId}/contacts/${contactId}`, 
      contactData
    );
  },

  /**
   * Delete a customer contact
   * @param customerId - Customer ID
   * @param contactId - Contact ID
   * @returns Promise with updated customer
   */
  async deleteContact(customerId: string, contactId: string): Promise<CustomerData> {
    return await apiService.delete<CustomerData>(`/customers/${customerId}/contacts/${contactId}`);
  }
}; 