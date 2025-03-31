import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType, Product } from '@/types';
import { getProductsByManufacturer } from '@/data/mockData';
import ProductList from '@/components/orders/ProductList';
import AddProductForm from '@/components/orders/AddProductForm';
import OrderSummary from '@/components/orders/OrderSummary';
import OrderFormSection from '@/components/orders/OrderFormSection';
import OrderFormHeader from '@/components/orders/OrderFormHeader';
import OrderFormNavigation from '@/components/orders/OrderFormNavigation';
import DocuSealRedirect from '@/components/orders/DocuSealRedirect';
import FormStepIndicator from '@/components/FormStepIndicator';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const OrderPage: React.FC = () => {
  const { 
    activeForm, 
    formData, 
    formProgress, 
    setActiveForm, 
    goToNextStep, 
    goToPreviousStep, 
    submitForm,
    setFieldValue,
    updateFormData
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [showDocuSeal, setShowDocuSeal] = useState(false);
  const { toast } = useToast();
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!isInitialized.current && (!activeForm || activeForm.id !== 'order')) {
      setActiveForm('order');
      isInitialized.current = true;
    }
  }, [setActiveForm, activeForm]);
  
  useEffect(() => {
    if (formData.productManufacturer) {
      const productsForManufacturer = getProductsByManufacturer(formData.productManufacturer);
      setProducts(productsForManufacturer);
    } else {
      setProducts([]);
    }
  }, [formData.productManufacturer]);
  
  const handleFieldChange = (id: string, value: any) => {
    setFieldValue(id, value);
  };
  
  const handleAddProduct = () => {
    if (!formData.product || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please select a product and specify a quantity.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedProduct = products.find(p => p.id === formData.product);
    if (!selectedProduct) return;
    
    const newProduct = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      quantity: parseInt(formData.quantity, 10) || 1,
      price: selectedProduct.price || 0
    };
    
    setProductList(prev => [...prev, newProduct]);
    
    setFieldValue('product', '');
    setFieldValue('quantity', '1');
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} added to your order.`
    });
  };
  
  const handleRemoveProduct = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formProgress.currentStep === 4 && productList.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to your order.",
        variant: "destructive"
      });
      return;
    }
    
    if (formProgress.currentStep < formProgress.totalSteps) {
      const success = goToNextStep();
      if (!success) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
      }
    } else {
      try {
        setLoading(true);
        updateFormData({ products: productList });
        await submitForm();
        toast({
          title: "Success",
          description: "Order submitted successfully.",
        });
        
        setShowDocuSeal(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "There was an error submitting your order. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (!activeForm) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Loading form...</p>
      </div>
    );
  }
  
  const currentStepSections = activeForm.steps[formProgress.currentStep - 1]?.sections || [];
  const sections = currentStepSections.map(sectionId => 
    activeForm.sections.find(s => s.id === sectionId)
  ).filter(Boolean) as FormSectionType[];

  const isProductsStep = formProgress.currentStep === 4;
  const isReviewStep = formProgress.currentStep === 5;

  return (
    <div>
      <OrderFormHeader form={activeForm} />
      
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-6">
          {showDocuSeal ? (
            <DocuSealRedirect manufacturerId={formData.productManufacturer} />
          ) : (
            <form onSubmit={handleSubmit}>
              <FormStepIndicator
                currentStep={formProgress.currentStep}
                steps={activeForm.steps}
              />
              
              {!isReviewStep ? (
                <>
                  {sections.map((section) => (
                    <OrderFormSection 
                      key={section.id}
                      section={section}
                      formData={formData}
                      onFieldChange={handleFieldChange}
                    />
                  ))}
                  
                  {isProductsStep && (
                    <div className="mt-4">
                      <AddProductForm
                        products={products}
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        onAddProduct={handleAddProduct}
                      />
                      
                      <div className="mt-6">
                        <ProductList 
                          products={productList} 
                          onRemove={handleRemoveProduct}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <OrderSummary 
                  sections={activeForm.sections} 
                  formData={formData}
                  productList={productList}
                />
              )}
              
              <Separator className="my-6" />
              
              <OrderFormNavigation
                currentStep={formProgress.currentStep}
                totalSteps={formProgress.totalSteps}
                percentComplete={formProgress.percentComplete}
                onPrevious={goToPreviousStep}
                loading={loading}
                isProductsStepEmpty={isProductsStep && productList.length === 0}
              />
            </form>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact support at (555) 123-4567
      </div>
    </div>
  );
};

export default OrderPage;
