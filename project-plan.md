This is a web application for MSC Wound Care that enables administrators, customers, and sales representatives to fill out various forms for onboarding, insurance verification, orders, and DME kit sign-ups. Let me break down the key components:

Project Overview
The application is a React-based web portal built with:

Vite as the build tool
TypeScript for type safety
React Router for navigation
Tailwind CSS for styling
Shadcn UI for component library
Tanstack React Query for data fetching
User Roles
The system supports three user roles:

Admin - Can access all features and manage users, products, submissions
Customer - Can fill out forms and view their submissions
Sales Representative - Can assist customers and manage their accounts
Main Features
Form Management System

Onboarding forms
Insurance verification requests
Order forms
DME kit sign-up forms
AI Assistant

Helps quickly fill out forms using customer information
Document Integration

Uses DocuSeal API for autofilling PDFs for signatures
Customer Management

Stores customer information for quick form filling
Project Structure
Core Framework
React with TypeScript
Vite for development and building
React Router for navigation
State Management
Context API (AuthContext, FormContext)
Tanstack React Query for server state
UI Components
Shadcn UI components in /src/components/ui/
Custom components in /src/components/
Page Structure
Authentication Pages

Login page with role-based access
Dashboard

Main landing page with overview of activities
Form Pages

Onboarding
Insurance verification
Order forms
Each form has multiple steps with validation
Management Pages

Customers
Products
Sales Representatives
Submissions
Settings

Account settings
Notifications
Security
General settings
Key Files and Directories
/src
  /components
    /ui            - Shadcn UI components
    /form          - Form-related components
    /settings      - Settings components
    /insurance     - Insurance form components
    /orders        - Order form components
    /products      - Product management components 
    /sales         - Sales rep components
    Layout.tsx     - Main layout with sidebar and navigation
    Navbar.tsx     - Top navigation bar
    Sidebar.tsx    - Side navigation
    AIAssistant.tsx - AI assistant component
  
  /context
    AuthContext.tsx - Authentication context
    /form          - Form context and management
  
  /hooks           - Custom React hooks
  
  /pages           - Main page components
    Dashboard.tsx
    OnboardingPage.tsx
    InsurancePage.tsx
    OrderPage.tsx
    CustomersPage.tsx
    SubmissionsPage.tsx
    SalesRepPage.tsx
    ProductsPage.tsx
    SettingsPage.tsx
    
  /types           - TypeScript type definitions
  
  /lib             - Utility functions
  
  /data            - Mock data for development


Key Features Implementation
Authentication System
Role-based authentication via AuthContext
Demo mode with role switching capability
Form System
Multi-step form processing
Form validation
Progress tracking
Form data management
Navigation
Sidebar navigation with responsive design
Role-based menu items
Top navbar with notifications and user menu
Responsive Design
Mobile-friendly layouts
Responsive tables and forms
Adaptive UI for different screen sizes
Settings Management
User profile settings
Notification preferences
Security settings
General application settings

The project is currently using mock data for development but is structured to easily integrate with a backend API. The form system is designed to be extensible, allowing for new form types to be added as needed.

I'd be happy to provide you with a detailed outline of the project and its current structure