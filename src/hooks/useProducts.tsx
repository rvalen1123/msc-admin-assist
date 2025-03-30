
import { useState, useEffect } from 'react';
import { Product, Manufacturer } from '@/types';
import { products as initialProducts, manufacturers } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface PriceHistoryEntry {
  productId: string;
  quarter: string;
  price?: number;
  nationalAsp?: number;
  updatedAt: Date;
}

// Add new fields to Product type
interface EnhancedProduct extends Product {
  qCode?: string;
  nationalAsp?: number;
  mue?: string;
  priceHistory?: PriceHistoryEntry[];
}

export function useProducts() {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize with mock data and add additional fields
    const enhancedProducts = initialProducts.map(product => ({
      ...product,
      qCode: `Q-${Math.floor(Math.random() * 9000) + 1000}`,
      nationalAsp: product.price ? product.price * 1.2 : undefined,
      mue: Math.floor(Math.random() * 5) + 1 + '',
    }));
    
    // Initialize price history
    const initialHistory: PriceHistoryEntry[] = [];
    const quarters = ['Q1-2023', 'Q2-2023', 'Q3-2023', 'Q4-2023', 'Q1-2024'];
    
    enhancedProducts.forEach(product => {
      // Generate random price history entries for each product
      quarters.forEach(quarter => {
        const basePrice = product.price || 100;
        const randomAdjustment = (Math.random() * 0.2) - 0.1; // -10% to +10%
        
        initialHistory.push({
          productId: product.id,
          quarter,
          price: basePrice * (1 + randomAdjustment),
          nationalAsp: basePrice * 1.2 * (1 + randomAdjustment),
          updatedAt: new Date(Date.now() - Math.random() * 10000000000)
        });
      });
    });
    
    setProducts(enhancedProducts);
    setPriceHistory(initialHistory);
    setIsLoading(false);
  }, []);
  
  const addProduct = (productData: Partial<Product>, quarter: string) => {
    const newProduct: EnhancedProduct = {
      id: `product-${Date.now()}`,
      name: productData.name || '',
      manufacturerId: productData.manufacturerId || '',
      description: productData.description || '',
      price: productData.price,
      qCode: productData.qCode,
      nationalAsp: productData.nationalAsp,
      mue: productData.mue,
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    // Add initial price history entry
    const historyEntry: PriceHistoryEntry = {
      productId: newProduct.id,
      quarter,
      price: newProduct.price,
      nationalAsp: newProduct.nationalAsp,
      updatedAt: new Date()
    };
    
    setPriceHistory(prev => [...prev, historyEntry]);
    
    return newProduct;
  };
  
  const updateProduct = (id: string, productData: Partial<Product>, quarter: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      )
    );
    
    // Check if price or nationalAsp changed
    const product = products.find(p => p.id === id);
    if (product && 
        (product.price !== productData.price || 
         product.nationalAsp !== productData.nationalAsp)) {
      
      // Add to price history
      const historyEntry: PriceHistoryEntry = {
        productId: id,
        quarter,
        price: productData.price,
        nationalAsp: productData.nationalAsp,
        updatedAt: new Date()
      };
      
      setPriceHistory(prev => [...prev, historyEntry]);
    }
  };
  
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };
  
  const getPriceHistory = (productId: string) => {
    return priceHistory
      .filter(entry => entry.productId === productId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  };
  
  return {
    products,
    manufacturers,
    isLoading,
    addProduct,
    updateProduct,
    getProductById,
    getPriceHistory
  };
}
