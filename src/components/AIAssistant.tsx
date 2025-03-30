
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Bot, Loader2, Send, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AIAssistantResponse } from '@/types';
import { useForm } from '@/context/FormContext';
import { customerData } from '@/data/mockData';

interface AIAssistantProps {
  onSuggestion?: (field: string, value: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIAssistantResponse[] | null>(null);
  const { toast } = useToast();
  const { activeForm, updateFormData } = useForm();

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI response based on query
      let mockResponse: AIAssistantResponse[] = [];
      
      // Parse the query for keywords
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('abc') || queryLower.includes('abc medical')) {
        // Found a customer by name
        const customer = customerData.find(c => c.name.toLowerCase().includes('abc'));
        if (customer) {
          mockResponse = [
            { field: 'distributorName', value: customer.company || '', confidence: 0.95 },
            { field: 'providerName', value: customer.contacts?.[0]?.name || '', confidence: 0.9 },
            { field: 'providerEmail', value: customer.contacts?.[0]?.email || '', confidence: 0.95 },
            { field: 'practiceEmail', value: customer.email, confidence: 0.95 },
            { field: 'billingAddress', value: `${customer.address?.line1 || ''}\n${customer.address?.line2 || ''}`, confidence: 0.9 }
          ];
        }
      } else if (queryLower.includes('metro') || queryLower.includes('health partner')) {
        // Found another customer
        const customer = customerData.find(c => c.name.toLowerCase().includes('metro'));
        if (customer) {
          mockResponse = [
            { field: 'distributorName', value: customer.company || '', confidence: 0.95 },
            { field: 'providerName', value: customer.contacts?.[0]?.name || '', confidence: 0.9 },
            { field: 'providerEmail', value: customer.contacts?.[0]?.email || '', confidence: 0.95 },
            { field: 'practiceEmail', value: customer.email, confidence: 0.95 },
            { field: 'billingAddress', value: `${customer.address?.line1 || ''}\n${customer.address?.line2 || ''}`, confidence: 0.9 }
          ];
        }
      } else if (queryLower.includes('address') || queryLower.includes('shipping')) {
        // Query about address or shipping
        mockResponse = [
          { field: 'addressLine1', value: '123 Medical Center Blvd', confidence: 0.8 },
          { field: 'city', value: 'Healthcare City', confidence: 0.8 },
          { field: 'state', value: 'CA', confidence: 0.8 },
          { field: 'zipCode', value: '92101', confidence: 0.8 }
        ];
      } else if (queryLower.includes('insurance')) {
        // Query about insurance
        mockResponse = [
          { field: 'primaryInsurance', value: 'Blue Cross Blue Shield', confidence: 0.85 },
          { field: 'policyNumber', value: 'BCBS12345678', confidence: 0.7 },
          { field: 'insurancePhone', value: '800-123-4567', confidence: 0.7 }
        ];
      } else if (queryLower.includes('fill') || queryLower.includes('complete')) {
        // General request to fill the form
        mockResponse = [
          { field: 'distributorName', value: 'ABC Medical Group', confidence: 0.7 },
          { field: 'salesRepName', value: 'Jane Smith', confidence: 0.7 },
          { field: 'salesRepEmail', value: 'jane@mscwoundcare.com', confidence: 0.7 },
          { field: 'salesRepPhone', value: '555-123-4567', confidence: 0.7 },
          { field: 'providerName', value: 'Dr. Robert Johnson', confidence: 0.7 },
          { field: 'providerCredentials', value: 'MD, FACS', confidence: 0.7 },
          { field: 'practiceEmail', value: 'info@healthclinic.com', confidence: 0.7 }
        ];
      } else {
        // Default response if no specific match
        mockResponse = [
          { field: 'distributorName', value: 'Healthcare Provider Inc.', confidence: 0.6 },
          { field: 'salesRepName', value: 'John Smith', confidence: 0.6 },
          { field: 'salesRepEmail', value: 'john@healthcareprovider.com', confidence: 0.6 }
        ];
      }
      
      setResponse(mockResponse);
      toast({
        title: "AI Assistant",
        description: "I found some information that might help you fill out the form.",
      });
    } catch (error) {
      console.error('Error processing AI query:', error);
      toast({
        title: "AI Assistant Error",
        description: "Sorry, I couldn't process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyAllSuggestions = () => {
    if (!response || !activeForm) return;
    
    const updatedData: Record<string, any> = {};
    response.forEach(item => {
      updatedData[item.field] = item.value;
    });
    
    updateFormData(updatedData);
    toast({
      title: "Fields Updated",
      description: `${response.length} fields have been automatically filled.`
    });
    setIsOpen(false);
    setResponse(null);
    setQuery('');
  };

  const applySingleSuggestion = (field: string, value: string) => {
    if (onSuggestion) {
      onSuggestion(field, value);
    } else {
      updateFormData({ [field]: value });
      toast({
        title: "Field Updated",
        description: `The field has been filled with the suggested value.`
      });
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 fixed bottom-6 right-6 shadow-lg"
          >
            <Bot size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] md:w-[450px]" align="end" alignOffset={-20}>
          <Card className="border-none shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot size={18} className="text-primary" /> AI Form Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
              <CardDescription>
                Ask me for help filling out the form. I can look up customer information, suggest values, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response && response.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Here's what I found:</p>
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                    {response.map((item, index) => (
                      <div
                        key={`${item.field}-${index}`}
                        className="bg-secondary/50 p-2 rounded-md flex items-center justify-between"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium truncate">{item.field}</p>
                          <p className="text-sm truncate">{item.value}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => applySingleSuggestion(item.field, item.value)}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Textarea
                    placeholder="Ask me to help fill out this form. For example: 'Fill form for ABC Medical Group' or 'Look up shipping address for Metro Health'"
                    className="min-h-[120px]"
                    value={query}
                    onChange={handleQueryChange}
                    disabled={isLoading}
                  />
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 pt-0">
              {response && response.length > 0 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResponse(null);
                      setQuery('');
                    }}
                  >
                    Ask Again
                  </Button>
                  <Button size="sm" onClick={applyAllSuggestions}>
                    Apply All
                  </Button>
                </>
              ) : (
                <Button 
                  type="submit" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleSubmit}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Ask Assistant
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AIAssistant;
