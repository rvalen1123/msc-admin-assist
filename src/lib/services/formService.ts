/**
 * Service for interacting with the forms API endpoints
 */
import { apiService } from '../api';
import { FormTemplate, FormSubmission } from '../../types';

export const formService = {
  /**
   * Get all form templates
   * @returns Promise with array of form templates
   */
  async getFormTemplates(): Promise<FormTemplate[]> {
    return await apiService.get<FormTemplate[]>('/forms/templates');
  },

  /**
   * Get a single form template by ID
   * @param id - Form template ID
   * @returns Promise with form template data
   */
  async getFormTemplate(id: string): Promise<FormTemplate> {
    return await apiService.get<FormTemplate>(`/forms/templates/${id}`);
  },

  /**
   * Create a new form template
   * @param formData - Form template data
   * @returns Promise with created form template
   */
  async createFormTemplate(formData: Partial<FormTemplate>): Promise<FormTemplate> {
    return await apiService.post<FormTemplate>('/forms/templates', formData);
  },

  /**
   * Update an existing form template
   * @param id - Form template ID
   * @param formData - Updated form data
   * @returns Promise with updated form template
   */
  async updateFormTemplate(id: string, formData: Partial<FormTemplate>): Promise<FormTemplate> {
    return await apiService.patch<FormTemplate>(`/forms/templates/${id}`, formData);
  },

  /**
   * Delete a form template
   * @param id - Form template ID
   * @returns Promise with deletion status
   */
  async deleteFormTemplate(id: string): Promise<void> {
    return await apiService.delete<void>(`/forms/templates/${id}`);
  },

  /**
   * Get all form submissions
   * @returns Promise with array of form submissions
   */
  async getFormSubmissions(): Promise<FormSubmission[]> {
    return await apiService.get<FormSubmission[]>('/forms/submissions');
  },

  /**
   * Get a single form submission by ID
   * @param id - Form submission ID
   * @returns Promise with form submission data
   */
  async getFormSubmission(id: string): Promise<FormSubmission> {
    return await apiService.get<FormSubmission>(`/forms/submissions/${id}`);
  },

  /**
   * Create a new form submission
   * @param formData - Form submission data
   * @returns Promise with created form submission
   */
  async createFormSubmission(submissionData: Partial<FormSubmission>): Promise<FormSubmission> {
    return await apiService.post<FormSubmission>('/forms/submissions', submissionData);
  },

  /**
   * Update an existing form submission
   * @param id - Form submission ID
   * @param submissionData - Updated submission data
   * @returns Promise with updated form submission
   */
  async updateFormSubmission(id: string, submissionData: Partial<FormSubmission>): Promise<FormSubmission> {
    return await apiService.patch<FormSubmission>(`/forms/submissions/${id}`, submissionData);
  },

  /**
   * Delete a form submission
   * @param id - Form submission ID
   * @returns Promise with deletion status
   */
  async deleteFormSubmission(id: string): Promise<void> {
    return await apiService.delete<void>(`/forms/submissions/${id}`);
  },

  /**
   * Download a form submission as PDF
   * @param id - Form submission ID
   * @returns Promise with PDF data URL
   */
  async downloadSubmissionPdf(id: string): Promise<string> {
    const response = await apiService.get<{ pdfUrl: string }>(`/forms/submissions/${id}/pdf`);
    return response.pdfUrl;
  },

  /**
   * Get form submissions by user
   * @param userId - User ID
   * @returns Promise with array of form submissions
   */
  async getUserFormSubmissions(userId: string): Promise<FormSubmission[]> {
    return await apiService.get<FormSubmission[]>(`/users/${userId}/form-submissions`);
  }
}; 