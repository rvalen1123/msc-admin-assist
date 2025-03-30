
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FormStepIndicator from '@/components/FormStepIndicator';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType, Product } from '@/types';
import { getProductsByManufacturer } from '@/data/mockData';
import ProductList from '@/components/orders/ProductList';
import AddProductForm from '@/components/orders/AddProductForm';
import OrderSummary from '@/components/orders/OrderSummary';
import OrderFormSection from '@/components/orders/OrderFormSection';

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
  const { toast } = useToast();
  
  // Set active form type to order on component mount
  useEffect(() => {
    setActiveForm('order');
  }, [setActiveForm]);
  
  // Update available products when manufacturer changes
  useEffect(() => {
    if (formData.productManufacturer) {
      const productsForManufacturer = getProductsByManufacturer(formData.productManufacturer);
      setProducts(productsForManufacturer);
    } else {
      setProducts([]);
    }
  }, [formData.productManufacturer]);
  
  // Handle form field changes
  const handleFieldChange = (id: string, value: any) => {
    setFieldValue(id, value);
  };
  
  // Handle adding product to cart
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
    
    // Clear form fields
    setFieldValue('product', '');
    setFieldValue('quantity', '1');
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} added to your order.`
    });
  };
  
  // Handle removing product from cart
  const handleRemoveProduct = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If on products step, make sure there's at least one product added
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
        // Add product list to form data
        updateFormData({ products: productList });
        await submitForm();
        toast({
          title: "Success",
          description: "Order submitted successfully.",
        });
        
        // Simulate redirect to DocuSeal for manufacturer-specific forms
        setTimeout(() => {
          toast({
            title: "Redirecting",
            description: "Opening DocuSeal for manufacturer forms...",
          });
          
          setTimeout(() => {
            window.open('https://docuseal.co', '_blank');
          }, 1500);
        }, 1000);
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
  
  // Get sections for current step
  const currentStepSections = activeForm.steps[formProgress.currentStep - 1]?.sections || [];
  const sections = currentStepSections.map(sectionId => 
    activeForm.sections.find(s => s.id === sectionId)
  ).filter(Boolean) as FormSectionType[];

  // If we're on the products step, show the product management interface
  const isProductsStep = formProgress.currentStep === 4;
  // If we're on the review step, show order summary
  const isReviewStep = formProgress.currentStep === 5;

  return (
    <div>
      <div className="bg-blue-600 text-white py-4 px-6 rounded-t-md">
        <h1 className="text-xl font-semibold">{activeForm.title}</h1>
        <p className="text-sm text-blue-100">{activeForm.description}</p>
      </div>
      
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-6">
          <FormStepIndicator
            currentStep={formProgress.currentStep}
            steps={activeForm.steps}
          />
          
          <form onSubmit={handleSubmit}>
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
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={formProgress.currentStep === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              
              <div className="text-sm text-gray-500">
                Step {formProgress.currentStep} of {formProgress.totalSteps} • {formProgress.percentComplete}% Complete
              </div>
              
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  'Processing...'
                ) : formProgress.currentStep === formProgress.totalSteps ? (
                  'Place Order'
                ) : (
                  <>Continue <ChevronRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact support at (555) 123-4567
      </div>
    </div>
  );
};

export default OrderPage;
