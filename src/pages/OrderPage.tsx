
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import FormStepIndicator from '@/components/FormStepIndicator';
import FormField from '@/components/FormField';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType, Product } from '@/types';
import { getProductsByManufacturer } from '@/data/mockData';

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
  const [productList, setProductList] = useState<{id: string; name: string; quantity: number; price: number}[]>([]);
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
  
  // Calculate order total
  const calculateTotal = () => {
    return productList.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2);
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
                  <div key={section.id} className="form-section mb-8">
                    <div className="section-header">
                      {section.title}
                    </div>
                    <div className="form-section-content">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map((field) => (
                          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <FormField
                              field={{
                                ...field,
                                // Dynamically set product options based on selected manufacturer
                                options: field.id === 'product' && products.length > 0
                                  ? [
                                      { label: 'Select a product', value: '' },
                                      ...products.map(p => ({ label: p.name, value: p.id }))
                                    ]
                                  : field.options
                              }}
                              value={formData[field.id]}
                              onChange={handleFieldChange}
                            />
                          </div>
                        ))}
                      </div>
                      
                      {isProductsStep && (
                        <div className="mt-4">
                          <Button 
                            type="button"
                            onClick={handleAddProduct}
                            className="flex items-center"
                          >
                            <PlusCircle className="mr-1 h-4 w-4" /> Add Product
                          </Button>
                          
                          <div className="mt-6">
                            {productList.length === 0 ? (
                              <p className="text-gray-500 text-sm italic py-4">
                                No products added yet. Use the form above to add products.
                              </p>
                            ) : (
                              <div className="border rounded-md">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                      </th>
                                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                      </th>
                                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                      </th>
                                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {productList.map((product) => (
                                      <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-3 text-sm">
                                          {product.name}
                                        </td>
                                        <td className="py-3 px-3 text-sm">
                                          {product.quantity}
                                        </td>
                                        <td className="py-3 px-3 text-sm">
                                          ${product.price.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-3 text-sm">
                                          ${(product.price * product.quantity).toFixed(2)}
                                        </td>
                                        <td className="py-3 px-3 text-sm">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                                            onClick={() => handleRemoveProduct(product.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                      <td colSpan={3} className="py-3 px-3 text-sm font-medium text-right">
                                        Subtotal:
                                      </td>
                                      <td colSpan={2} className="py-3 px-3 text-sm font-medium">
                                        ${calculateTotal()}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="form-section mb-8">
                <div className="section-header">
                  Order Summary
                </div>
                <div className="form-section-content">
                  <div className="space-y-8">
                    {activeForm.sections.slice(0, 3).map((section) => (
                      <div key={section.id}>
                        <h3 className="font-medium text-primary mb-3">{section.title}</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                            {section.fields.map((field) => {
                              const value = formData[field.id];
                              if (!value) return null;
                              
                              let displayValue: string;
                              if (field.type === 'select' && field.options) {
                                const option = field.options.find(o => o.value === value);
                                displayValue = option?.label || value;
                              } else if (field.type === 'checkbox' && field.options) {
                                displayValue = value ? 'Yes' : 'No';
                              } else {
                                displayValue = value.toString();
                              }
                              
                              return (
                                <div key={field.id} className="py-1">
                                  <dt className="text-xs font-medium text-gray-500">{field.label}:</dt>
                                  <dd className="text-sm">{displayValue}</dd>
                                </div>
                              );
                            })}
                          </dl>
                        </div>
                      </div>
                    ))}
                    
                    <div>
                      <h3 className="font-medium text-primary mb-3">Order Products</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {productList.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No products selected.</p>
                        ) : (
                          <div className="border rounded-md bg-white">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {productList.map((product) => (
                                  <tr key={product.id}>
                                    <td className="py-3 px-3 text-sm">
                                      {product.name}
                                    </td>
                                    <td className="py-3 px-3 text-sm">
                                      {product.quantity}
                                    </td>
                                    <td className="py-3 px-3 text-sm text-right">
                                      ${product.price.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-3 text-sm text-right">
                                      ${(product.price * product.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td colSpan={3} className="py-3 px-3 text-sm font-medium text-right">
                                    Subtotal:
                                  </td>
                                  <td className="py-3 px-3 text-sm font-medium text-right">
                                    ${calculateTotal()}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
