/**
 * Service for interacting with the orders API endpoints
 */
import { apiService } from '../api';
import { Order, OrderItem } from '../../types';

export const orderService = {
  /**
   * Get all orders
   * @returns Promise with array of orders
   */
  async getOrders(): Promise<Order[]> {
    return await apiService.get<Order[]>('/orders');
  },

  /**
   * Get a single order by ID
   * @param id - Order ID
   * @returns Promise with order data
   */
  async getOrder(id: string): Promise<Order> {
    return await apiService.get<Order>(`/orders/${id}`);
  },

  /**
   * Create a new order
   * @param orderData - Order data
   * @returns Promise with created order
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return await apiService.post<Order>('/orders', orderData);
  },

  /**
   * Update an existing order
   * @param id - Order ID
   * @param orderData - Updated order data
   * @returns Promise with updated order
   */
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    return await apiService.patch<Order>(`/orders/${id}`, orderData);
  },

  /**
   * Delete an order
   * @param id - Order ID
   * @returns Promise with deletion status
   */
  async deleteOrder(id: string): Promise<void> {
    return await apiService.delete<void>(`/orders/${id}`);
  },

  /**
   * Update order status
   * @param id - Order ID
   * @param status - Order status
   * @returns Promise with updated order
   */
  async updateOrderStatus(
    id: string, 
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<Order> {
    return await apiService.patch<Order>(`/orders/${id}/status`, { status });
  },

  /**
   * Add item to order
   * @param orderId - Order ID
   * @param itemData - Order item data
   * @returns Promise with updated order
   */
  async addOrderItem(orderId: string, itemData: Partial<OrderItem>): Promise<Order> {
    return await apiService.post<Order>(`/orders/${orderId}/items`, itemData);
  },

  /**
   * Update order item
   * @param orderId - Order ID
   * @param itemId - Item ID
   * @param itemData - Updated item data
   * @returns Promise with updated order
   */
  async updateOrderItem(
    orderId: string, 
    itemId: string, 
    itemData: Partial<OrderItem>
  ): Promise<Order> {
    return await apiService.patch<Order>(
      `/orders/${orderId}/items/${itemId}`, 
      itemData
    );
  },

  /**
   * Remove item from order
   * @param orderId - Order ID
   * @param itemId - Item ID
   * @returns Promise with updated order
   */
  async removeOrderItem(orderId: string, itemId: string): Promise<Order> {
    return await apiService.delete<Order>(`/orders/${orderId}/items/${itemId}`);
  },

  /**
   * Get orders by customer
   * @param customerId - Customer ID
   * @returns Promise with array of orders
   */
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return await apiService.get<Order[]>(`/customers/${customerId}/orders`);
  },

  /**
   * Get orders by sales rep
   * @param salesRepId - Sales rep ID
   * @returns Promise with array of orders
   */
  async getSalesRepOrders(salesRepId: string): Promise<Order[]> {
    return await apiService.get<Order[]>(`/users/${salesRepId}/orders`);
  },

  /**
   * Generate invoice for order
   * @param orderId - Order ID
   * @returns Promise with invoice URL
   */
  async generateInvoice(orderId: string): Promise<{ invoiceUrl: string }> {
    return await apiService.post<{ invoiceUrl: string }>(`/orders/${orderId}/invoice`);
  }
}; 