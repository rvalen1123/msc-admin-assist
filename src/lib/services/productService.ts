/**
 * Service for interacting with the product API endpoints
 */
import { apiService } from '../api';
import { Product, Manufacturer, PriceHistory } from '../../types';

export const productService = {
  /**
   * Get a list of all products
   * @returns Promise with array of products
   */
  async getProducts(): Promise<Product[]> {
    return await apiService.get<Product[]>('/products');
  },

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Promise with product data
   */
  async getProduct(id: string): Promise<Product> {
    return await apiService.get<Product>(`/products/${id}`);
  },

  /**
   * Create a new product
   * @param productData - Product data
   * @returns Promise with created product
   */
  async createProduct(productData: Partial<Product>): Promise<Product> {
    return await apiService.post<Product>('/products', productData);
  },

  /**
   * Update an existing product
   * @param id - Product ID
   * @param productData - Updated product data
   * @returns Promise with updated product
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return await apiService.patch<Product>(`/products/${id}`, productData);
  },

  /**
   * Delete a product
   * @param id - Product ID
   * @returns Promise with deletion status
   */
  async deleteProduct(id: string): Promise<void> {
    return await apiService.delete<void>(`/products/${id}`);
  },

  /**
   * Get products by manufacturer
   * @param manufacturerId - Manufacturer ID
   * @returns Promise with array of products
   */
  async getProductsByManufacturer(manufacturerId: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/manufacturers/${manufacturerId}/products`);
  },

  /**
   * Get all manufacturers
   * @returns Promise with array of manufacturers
   */
  async getManufacturers(): Promise<Manufacturer[]> {
    return await apiService.get<Manufacturer[]>('/manufacturers');
  },

  /**
   * Get a single manufacturer by ID
   * @param id - Manufacturer ID
   * @returns Promise with manufacturer data
   */
  async getManufacturer(id: string): Promise<Manufacturer> {
    return await apiService.get<Manufacturer>(`/manufacturers/${id}`);
  },

  /**
   * Get price history for a product
   * @param productId - Product ID
   * @returns Promise with array of price history entries
   */
  async getPriceHistory(productId: string): Promise<PriceHistory[]> {
    return await apiService.get<PriceHistory[]>(`/products/${productId}/price-history`);
  },

  /**
   * Add price history entry for a product
   * @param productId - Product ID
   * @param priceData - Price history data
   * @returns Promise with created price history entry
   */
  async addPriceHistoryEntry(
    productId: string, 
    priceData: Partial<PriceHistory>
  ): Promise<PriceHistory> {
    return await apiService.post<PriceHistory>(
      `/products/${productId}/price-history`, 
      priceData
    );
  }
}; 