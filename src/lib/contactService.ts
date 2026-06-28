import { apiClient } from './apiClient';

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

export const contactService = {
  // Submit contact form to Hostinger
  async submitContact(data: Omit<ContactSubmission, 'id' | 'created_at'>) {
    try {
      const result = await apiClient.submitContact(data);
      return { success: true, data: result };
    } catch (error) {
      console.error('Contact submission error:', error);
      return { success: false, error };
    }
  },

  // Get all contact submissions (for admin)
  async getSubmissions() {
    try {
      return await apiClient.getContactSubmissions();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }
};
