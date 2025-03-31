import { 
  User, 
  Manufacturer, 
  Product, 
  FormTemplate,
  CustomerData
} from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@mscwoundcare.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@customer.com',
    role: 'customer',
    company: 'ABC Medical Group'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@mscwoundcare.com',
    role: 'sales'
  }
];

export const manufacturers: Manufacturer[] = [
  {
    id: '1',
    name: 'Healing Biologix',
    logo: '/lovable-uploads/5c9b48df-6ccb-4c11-9c37-cea0af5cfed4.png'
  },
  {
    id: '2',
    name: 'MSC Wound Care',
    logo: '/lovable-uploads/7e6ed07e-97db-460b-bc10-43824dd3311c.png'
  },
  {
    id: '3',
    name: 'MedTech Solutions',
    logo: ''
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Advanced Wound Dressing',
    manufacturerId: '1',
    description: 'Advanced dressing for chronic wounds',
    price: 145.99
  },
  {
    id: '2',
    name: 'Skin Substitute Graft',
    manufacturerId: '1',
    description: 'Cellular tissue product for wound healing',
    price: 895.00
  },
  {
    id: '3',
    name: 'Negative Pressure Device',
    manufacturerId: '2',
    description: 'Vacuum-assisted wound closure',
    price: 1250.00
  },
  {
    id: '4',
    name: 'Compression Garment',
    manufacturerId: '2',
    description: 'Medical grade compression for venous ulcers',
    price: 89.99
  },
  {
    id: '5',
    name: 'Wound Debridement Kit',
    manufacturerId: '3',
    description: 'Complete kit for wound debridement',
    price: 249.99
  }
];

export const onboardingFormTemplate: FormTemplate = {
  id: '1',
  type: 'onboarding',
  title: 'Universal Customer Onboarding',
  description: 'Complete this form to onboard a customer with multiple wound product manufacturers.',
  sections: [
    {
      id: 'distributor',
      title: 'Distributor Information',
      fields: [
        {
          id: 'distributorName',
          label: 'Distributor Name',
          type: 'text',
          required: true,
          placeholder: 'Enter distributor name'
        },
        {
          id: 'salesRepName',
          label: 'Sales Representative Name',
          type: 'text',
          required: true,
          placeholder: 'Enter sales rep name'
        },
        {
          id: 'salesRepEmail',
          label: 'Sales Representative Email',
          type: 'email',
          required: true,
          placeholder: 'Enter sales rep email'
        },
        {
          id: 'salesRepPhone',
          label: 'Sales Representative Phone',
          type: 'phone',
          required: true,
          placeholder: 'Enter sales rep phone'
        },
        {
          id: 'npi',
          label: 'NPI of Applicator',
          type: 'text',
          required: false,
          placeholder: 'Enter NPI number'
        },
        {
          id: 'dea',
          label: 'DEA Affiliation',
          type: 'text',
          required: false,
          placeholder: 'Enter DEA affiliation'
        }
      ]
    },
    {
      id: 'provider',
      title: 'Provider Information',
      fields: [
        {
          id: 'providerName',
          label: 'Provider Name',
          type: 'text',
          required: true,
          placeholder: 'Enter provider name'
        },
        {
          id: 'providerCredentials',
          label: 'Provider Credentials (MD, DO, DPM, etc.)',
          type: 'text',
          required: true,
          placeholder: 'Enter credentials'
        },
        {
          id: 'providerNPI',
          label: 'Individual NPI',
          type: 'text',
          required: true,
          placeholder: 'Enter provider NPI'
        },
        {
          id: 'groupNPI',
          label: 'Group NPI',
          type: 'text',
          required: false,
          placeholder: 'Enter group NPI if applicable'
        },
        {
          id: 'state',
          label: 'State (if applicable)',
          type: 'text',
          required: false,
          placeholder: 'Enter state'
        },
        {
          id: 'providerEmail',
          label: 'Provider Email',
          type: 'email',
          required: true,
          placeholder: 'Enter provider email'
        },
        {
          id: 'additionalProviders',
          label: 'Additional Providers',
          type: 'checkbox',
          required: false,
          options: [{ label: 'Add multiple providers', value: 'true' }]
        }
      ]
    },
    {
      id: 'practice',
      title: 'Practice/Facility Information',
      fields: [
        {
          id: 'practiceName',
          label: 'Practice/Facility Name',
          type: 'text',
          required: true,
          placeholder: 'Enter practice name'
        },
        {
          id: 'practiceNPI',
          label: 'Practice NPI',
          type: 'text',
          required: true,
          placeholder: 'Enter practice NPI'
        },
        {
          id: 'practiceFax',
          label: 'Practice Fax',
          type: 'phone',
          required: false,
          placeholder: 'Enter practice fax'
        },
        {
          id: 'practiceEmail',
          label: 'Practice Email',
          type: 'email',
          required: true,
          placeholder: 'Enter practice email'
        },
        {
          id: 'facilityType',
          label: 'Facility Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a facility type', value: '' },
            { label: 'Hospital', value: 'hospital' },
            { label: 'Physician Office', value: 'physician_office' },
            { label: 'Wound Care Center', value: 'wound_care_center' },
            { label: 'Ambulatory Surgery Center', value: 'asc' },
            { label: 'Skilled Nursing Facility', value: 'snf' },
            { label: 'Home Health', value: 'home_health' },
            { label: 'Other', value: 'other' }
          ]
        },
        {
          id: 'specialties',
          label: 'Specialties',
          type: 'checkbox',
          required: false,
          options: [
            { label: 'Podiatry', value: 'podiatry' },
            { label: 'General Surgery', value: 'general_surgery' },
            { label: 'Vascular Surgery', value: 'vascular_surgery' },
            { label: 'Plastic Surgery', value: 'plastic_surgery' },
            { label: 'Orthopedics', value: 'orthopedics' },
            { label: 'Infectious Disease', value: 'infectious_disease' },
            { label: 'Wound Care', value: 'wound_care' },
            { label: 'ENT', value: 'ent' },
            { label: 'Other', value: 'other' }
          ]
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping Information',
      fields: [
        {
          id: 'shippingAddress',
          label: 'Shipping Address (Same as Practice/Facility Address)',
          type: 'textarea',
          required: true,
          placeholder: 'Enter full shipping address'
        },
        {
          id: 'specialInstructions',
          label: 'Special Delivery Instructions',
          type: 'textarea',
          required: false,
          placeholder: 'Enter any special delivery instructions'
        },
        {
          id: 'additionalShipping',
          label: 'Additional Shipping Locations',
          type: 'checkbox',
          required: false,
          options: [{ label: 'Add additional shipping locations', value: 'true' }]
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing Information',
      fields: [
        {
          id: 'billingContactName',
          label: 'Billing Contact Name',
          type: 'text',
          required: true,
          placeholder: 'Enter billing contact name'
        },
        {
          id: 'billingAddress',
          label: 'Billing Address',
          type: 'textarea',
          required: true,
          placeholder: 'Enter billing address'
        },
        {
          id: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'Enter city'
        },
        {
          id: 'state',
          label: 'State',
          type: 'text',
          required: true,
          placeholder: 'Enter state'
        },
        {
          id: 'zip',
          label: 'Zip',
          type: 'text',
          required: true,
          placeholder: 'Enter zip code'
        },
        {
          id: 'billingPhone',
          label: 'Billing Phone',
          type: 'phone',
          required: true,
          placeholder: 'Enter billing phone'
        },
        {
          id: 'billingEmail',
          label: 'Billing Email',
          type: 'email',
          required: true,
          placeholder: 'Enter billing email'
        },
        {
          id: 'invoicingPreference',
          label: 'Invoicing Preference',
          type: 'select',
          required: false,
          options: [
            { label: 'Select preference', value: '' },
            { label: 'Email', value: 'email' },
            { label: 'Mail', value: 'mail' },
            { label: 'Fax', value: 'fax' }
          ]
        },
        {
          id: 'purchaseOrderRequired',
          label: 'Purchase Order Required',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes - PO# must be on all purchase orders', value: 'yes' },
            { label: 'No - PO# can expedite manufacturer\'s POs', value: 'no' }
          ]
        }
      ]
    },
    {
      id: 'additional',
      title: 'Additional Information',
      fields: [
        {
          id: 'shippingTerms',
          label: 'Shipping Terms',
          type: 'radio',
          required: false,
          options: [
            { label: 'Charged to Facility', value: 'facility' },
            { label: 'Charged to Manufacturer\'s Account', value: 'manufacturer' }
          ]
        },
        {
          id: 'inventoryStatus',
          label: 'Inventory Status',
          type: 'radio',
          required: false,
          options: [
            { label: 'Consignment', value: 'consignment' },
            { label: 'Not Applicable', value: 'na' }
          ]
        },
        {
          id: 'claimsProcessingInformation',
          label: 'Claims Processing Information',
          type: 'textarea',
          required: false,
          placeholder: 'Enter any claims processing information'
        },
        {
          id: 'contactName',
          label: 'Contact Name',
          type: 'text',
          required: false,
          placeholder: 'Enter contact name'
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          required: false,
          placeholder: 'Enter email'
        },
        {
          id: 'phone',
          label: 'Phone',
          type: 'phone',
          required: false,
          placeholder: 'Enter phone'
        },
        {
          id: 'providerEmailStatement',
          label: 'Provider Email Attachment',
          type: 'radio',
          required: false,
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 'preferredMethod',
          label: 'Preferred Method for Benefits Communication',
          type: 'radio',
          required: false,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Fax', value: 'fax' }
          ]
        }
      ]
    },
    {
      id: 'agreement',
      title: 'Agreement',
      fields: [
        {
          id: 'agreementCheck',
          label: 'I acknowledge receipt of and agree to the manufacturer\'s terms and conditions. I understand they are informative and the product will activate in accordance to the given account.',
          type: 'checkbox',
          required: true,
          options: [{ label: 'I agree', value: 'agree' }]
        },
        {
          id: 'authorizedSignature',
          label: 'Authorized Signature',
          type: 'text',
          required: true,
          placeholder: 'Enter full name as signature'
        },
        {
          id: 'signatureDate',
          label: 'Date',
          type: 'date',
          required: true
        }
      ]
    }
  ],
  steps: [
    {
      id: 'step1',
      title: 'Distributor Information',
      sections: ['distributor']
    },
    {
      id: 'step2',
      title: 'Provider Information',
      sections: ['provider']
    },
    {
      id: 'step3',
      title: 'Practice/Facility Information',
      sections: ['practice']
    },
    {
      id: 'step4',
      title: 'Shipping & Billing',
      sections: ['shipping', 'billing']
    },
    {
      id: 'step5',
      title: 'Additional Information & Agreement',
      sections: ['additional', 'agreement']
    }
  ]
};

export const insuranceFormTemplate: FormTemplate = {
  id: '2',
  type: 'insurance',
  title: 'Insurance Verification Form',
  description: 'Complete this form to verify insurance coverage for wound care products.',
  sections: [
    {
      id: 'patient',
      title: 'Patient Information',
      fields: [
        {
          id: 'patientName',
          label: 'Patient Name',
          type: 'text',
          required: true,
          placeholder: 'Enter patient name'
        },
        {
          id: 'patientDOB',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          id: 'patientPhone',
          label: 'Patient Phone',
          type: 'phone',
          required: true,
          placeholder: 'Enter patient phone'
        },
        {
          id: 'patientEmail',
          label: 'Patient Email',
          type: 'email',
          required: false,
          placeholder: 'Enter patient email'
        }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance Information',
      fields: [
        {
          id: 'insuranceProvider',
          label: 'Insurance Provider',
          type: 'text',
          required: true,
          placeholder: 'Enter insurance provider'
        },
        {
          id: 'memberId',
          label: 'Member ID/Policy Number',
          type: 'text',
          required: true,
          placeholder: 'Enter member ID'
        },
        {
          id: 'groupNumber',
          label: 'Group Number',
          type: 'text',
          required: false,
          placeholder: 'Enter group number if applicable'
        },
        {
          id: 'insurancePhone',
          label: 'Insurance Phone Number',
          type: 'phone',
          required: true,
          placeholder: 'Enter insurance contact number'
        },
        {
          id: 'isPrimary',
          label: 'Is this the primary insurance?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        }
      ]
    },
    {
      id: 'provider',
      title: 'Provider Information',
      fields: [
        {
          id: 'referringProvider',
          label: 'Referring Provider Name',
          type: 'text',
          required: true,
          placeholder: 'Enter provider name'
        },
        {
          id: 'providerNPI',
          label: 'Provider NPI',
          type: 'text',
          required: true,
          placeholder: 'Enter provider NPI'
        },
        {
          id: 'facilityName',
          label: 'Facility Name',
          type: 'text',
          required: true,
          placeholder: 'Enter facility name'
        }
      ]
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis Information',
      fields: [
        {
          id: 'primaryDiagnosis',
          label: 'Primary Diagnosis',
          type: 'text',
          required: true,
          placeholder: 'Enter ICD-10 code'
        },
        {
          id: 'secondaryDiagnosis',
          label: 'Secondary Diagnosis',
          type: 'text',
          required: false,
          placeholder: 'Enter secondary ICD-10 code if applicable'
        },
        {
          id: 'diagnosisNotes',
          label: 'Diagnosis Notes',
          type: 'textarea',
          required: false,
          placeholder: 'Enter any additional diagnosis information'
        }
      ]
    }
  ],
  steps: [
    {
      id: 'step1',
      title: 'Patient Information',
      sections: ['patient']
    },
    {
      id: 'step2',
      title: 'Insurance Details',
      sections: ['insurance']
    },
    {
      id: 'step3',
      title: 'Provider & Diagnosis',
      sections: ['provider', 'diagnosis']
    }
  ]
};

export const orderFormTemplate: FormTemplate = {
  id: '2',
  type: 'order',
  title: 'Universal Order Form',
  description: 'Please complete all required fields to submit your order',
  sections: [
    {
      id: 'orderInfo',
      title: 'Order Information',
      fields: [
        {
          id: 'orderDate',
          label: 'Order Date',
          type: 'date',
          required: true
        },
        {
          id: 'orderType',
          label: 'Order Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Select order type', value: '' },
            { label: 'New Order', value: 'new' },
            { label: 'Reorder', value: 'reorder' }
          ]
        },
        {
          id: 'poNumber',
          label: 'PO Number (if applicable)',
          type: 'text',
          required: false,
          placeholder: 'Enter PO number'
        },
        {
          id: 'manufacturer',
          label: 'Manufacturer',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a manufacturer', value: '' },
            ...manufacturers.map(m => ({ label: m.name, value: m.id }))
          ]
        }
      ]
    },
    {
      id: 'facilityInfo',
      title: 'Facility Information',
      fields: [
        {
          id: 'facilityName',
          label: 'Facility Name',
          type: 'text',
          required: true,
          placeholder: 'Name of the healthcare facility'
        },
        {
          id: 'contactName',
          label: 'Contact Name',
          type: 'text',
          required: true,
          placeholder: 'Primary contact at the facility'
        },
        {
          id: 'contactTitle',
          label: 'Contact Title',
          type: 'text',
          required: false,
          placeholder: 'Job title of the contact person'
        },
        {
          id: 'contactPhone',
          label: 'Contact Phone',
          type: 'phone',
          required: true,
          placeholder: 'Phone number for the contact person'
        },
        {
          id: 'contactEmail',
          label: 'Contact Email',
          type: 'email',
          required: false,
          placeholder: 'Email address for the contact person'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping Information',
      fields: [
        {
          id: 'addressLine1',
          label: 'Address Line 1',
          type: 'text',
          required: true,
          placeholder: 'Street address for shipping'
        },
        {
          id: 'addressLine2',
          label: 'Address Line 2',
          type: 'text',
          required: false,
          placeholder: 'Suite, unit, etc.'
        },
        {
          id: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'City'
        },
        {
          id: 'state',
          label: 'State',
          type: 'text',
          required: true,
          placeholder: 'State'
        },
        {
          id: 'zipCode',
          label: 'ZIP Code',
          type: 'text',
          required: true,
          placeholder: 'ZIP code'
        },
        {
          id: 'shippingMethod',
          label: 'Shipping Method',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a shipping method', value: '' },
            { label: 'FedEx Standard', value: 'fedex_standard' },
            { label: 'FedEx Express', value: 'fedex_express' },
            { label: 'UPS Ground', value: 'ups_ground' }
          ]
        },
        {
          id: 'billingAddress',
          label: 'Same as Shipping Address',
          type: 'checkbox',
          required: false,
          options: [{ label: 'Same as Shipping Address', value: 'same' }]
        }
      ]
    },
    {
      id: 'products',
      title: 'Product Information',
      fields: [
        {
          id: 'productManufacturer',
          label: 'Manufacturer',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a manufacturer', value: '' },
            ...manufacturers.map(m => ({ label: m.name, value: m.id }))
          ]
        },
        {
          id: 'product',
          label: 'Product',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a product', value: '' }
          ]
        },
        {
          id: 'quantity',
          label: 'Quantity',
          type: 'text',
          required: true,
          placeholder: '1'
        }
      ]
    }
  ],
  steps: [
    {
      id: 'step1',
      title: 'Order Info',
      sections: ['orderInfo']
    },
    {
      id: 'step2',
      title: 'Facility Info',
      sections: ['facilityInfo']
    },
    {
      id: 'step3',
      title: 'Shipping',
      sections: ['shipping']
    },
    {
      id: 'step4',
      title: 'Products',
      sections: ['products']
    },
    {
      id: 'step5',
      title: 'Review & Submit',
      sections: []
    }
  ]
};

export const insuranceVerificationTemplate: FormTemplate = {
  id: '3',
  type: 'insurance',
  title: 'Insurance Verification Request',
  description: 'Complete this form to verify insurance coverage',
  sections: [
    {
      id: 'providerInfo',
      title: 'Provider Information',
      fields: [
        {
          id: 'manufacturer',
          label: 'Manufacturer',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a manufacturer', value: '' },
            ...manufacturers.map(m => ({ label: m.name, value: m.id }))
          ]
        },
        {
          id: 'product',
          label: 'Product',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a product', value: '' }
          ]
        },
        {
          id: 'salesRep',
          label: 'Sales Representative',
          type: 'select',
          required: true,
          options: [
            { label: 'Select a sales representative', value: '' },
            ...users.filter(u => u.role === 'sales').map(u => ({ label: u.name, value: u.id }))
          ]
        },
        {
          id: 'additionalEmail',
          label: 'Additional Notification Email',
          type: 'email',
          required: false,
          placeholder: 'email@example.com'
        }
      ]
    },
    {
      id: 'patientInfo',
      title: 'Patient Information',
      fields: [
        {
          id: 'patientName',
          label: 'Patient Name',
          type: 'text',
          required: true,
          placeholder: 'Full patient name'
        },
        {
          id: 'patientDOB',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          id: 'patientPhone',
          label: 'Patient Phone',
          type: 'phone',
          required: true,
          placeholder: 'Patient contact number'
        },
        {
          id: 'patientAddress',
          label: 'Patient Address',
          type: 'textarea',
          required: true,
          placeholder: 'Full patient address'
        }
      ]
    },
    {
      id: 'insuranceInfo',
      title: 'Insurance Information',
      fields: [
        {
          id: 'primaryInsurance',
          label: 'Primary Insurance',
          type: 'text',
          required: true,
          placeholder: 'Insurance provider name'
        },
        {
          id: 'policyNumber',
          label: 'Policy Number',
          type: 'text',
          required: true,
          placeholder: 'Insurance policy number'
        },
        {
          id: 'groupNumber',
          label: 'Group Number',
          type: 'text',
          required: false,
          placeholder: 'Insurance group number'
        },
        {
          id: 'insurancePhone',
          label: 'Insurance Phone',
          type: 'phone',
          required: true,
          placeholder: 'Insurance contact number'
        },
        {
          id: 'secondaryInsurance',
          label: 'Secondary Insurance',
          type: 'text',
          required: false,
          placeholder: 'Secondary insurance if applicable'
        },
        {
          id: 'secondaryPolicyNumber',
          label: 'Secondary Policy Number',
          type: 'text',
          required: false,
          placeholder: 'Secondary policy number'
        }
      ]
    },
    {
      id: 'diagnosisInfo',
      title: 'Diagnosis Information',
      fields: [
        {
          id: 'primaryDiagnosis',
          label: 'Primary Diagnosis',
          type: 'text',
          required: true,
          placeholder: 'Primary diagnosis'
        },
        {
          id: 'diagnosisCode',
          label: 'ICD-10 Code',
          type: 'text',
          required: true,
          placeholder: 'ICD-10 code'
        },
        {
          id: 'secondaryDiagnosis',
          label: 'Secondary Diagnosis',
          type: 'text',
          required: false,
          placeholder: 'Secondary diagnosis if applicable'
        },
        {
          id: 'secondaryCode',
          label: 'Secondary ICD-10 Code',
          type: 'text',
          required: false,
          placeholder: 'Secondary ICD-10 code'
        },
        {
          id: 'clinicalNotes',
          label: 'Additional Clinical Notes',
          type: 'textarea',
          required: false,
          placeholder: 'Any relevant clinical information'
        }
      ]
    }
  ],
  steps: [
    {
      id: 'step1',
      title: 'Provider Info',
      sections: ['providerInfo']
    },
    {
      id: 'step2',
      title: 'Patient Info',
      sections: ['patientInfo']
    },
    {
      id: 'step3',
      title: 'Insurance',
      sections: ['insuranceInfo']
    },
    {
      id: 'step4',
      title: 'Diagnosis',
      sections: ['diagnosisInfo']
    },
    {
      id: 'step5',
      title: 'Review',
      sections: []
    }
  ]
};

export const customerData: CustomerData[] = [
  {
    id: '1',
    name: 'ABC Medical Group',
    email: 'info@abcmedical.com',
    phone: '555-123-4567',
    company: 'ABC Medical Group',
    address: {
      line1: '123 Healthcare Ave',
      line2: 'Suite 200',
      city: 'Medical City',
      state: 'MC',
      zipCode: '12345',
      country: 'USA'
    },
    contacts: [
      {
        name: 'John Smith',
        title: 'Procurement Manager',
        email: 'john@abcmedical.com',
        phone: '555-123-4567',
        isPrimary: true
      },
      {
        name: 'Jane Doe',
        title: 'Medical Director',
        email: 'jane@abcmedical.com',
        phone: '555-123-4568',
        isPrimary: false
      }
    ]
  },
  {
    id: '2',
    name: 'Metro Health Partners',
    email: 'contact@metrohealth.org',
    phone: '555-987-6543',
    company: 'Metro Health Partners',
    address: {
      line1: '456 Wellness Blvd',
      city: 'Healthville',
      state: 'HV',
      zipCode: '67890',
      country: 'USA'
    },
    contacts: [
      {
        name: 'Robert Johnson',
        title: 'Administrator',
        email: 'robert@metrohealth.org',
        phone: '555-987-6543',
        isPrimary: true
      }
    ]
  },
  {
    id: '3',
    name: 'Valley Wound Specialists',
    email: 'admin@valleywound.com',
    phone: '555-456-7890',
    company: 'Valley Wound Specialists',
    address: {
      line1: '789 Treatment Drive',
      line2: 'Floor 3',
      city: 'Valleytown',
      state: 'VT',
      zipCode: '34567',
      country: 'USA'
    },
    contacts: [
      {
        name: 'Sarah Williams',
        title: 'Office Manager',
        email: 'sarah@valleywound.com',
        phone: '555-456-7890',
        isPrimary: true
      }
    ]
  }
];

export const forms = {
  onboarding: onboardingFormTemplate,
  order: orderFormTemplate,
  insurance: insuranceVerificationTemplate
};

export const getProductsByManufacturer = (manufacturerId: string) => {
  return products.filter(product => product.manufacturerId === manufacturerId);
};
