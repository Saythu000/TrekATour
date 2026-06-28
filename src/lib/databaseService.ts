import { apiClient } from '@/lib/apiClient';

// Site Content Service (Hero, Footer, About, Contact)
export const siteContentService = {
  async get(pageType: string, contentKey: string) {
    try {
      const data = await apiClient.getSiteContent(pageType, contentKey);
      return data || null;
    } catch (error) {
      console.error('Error fetching site content:', error);
      return null;
    }
  },

  async set(pageType: string, contentKey: string, contentValue: any) {
    try {
      const result = await apiClient.setSiteContent(pageType, contentKey, contentValue);
      return result?.success || false;
    } catch (error) {
      console.error('Error saving site content:', error);
      return false;
    }
  }
};

// Trip Images Service (Stubbed for now, using image_url in trips table)
export const tripImageService = {
  async get(tripId: string, imageType: string = 'primary') {
    return null;
  },

  async set(tripId: string, imageData: string, imageType: string = 'primary') {
    return false;
  }
};

// Trip Edits Service (Stubbed or updated if needed later)
export const tripEditService = {
  async get(tripId: string, editType: string) {
    return null;
  },

  async set(tripId: string, editType: string, editData: any) {
    return false;
  }
};

// Site Configuration Service
export const siteConfigService = {
  async get(configKey: string) {
    return null; // Stubbed for now
  },

  async set(configKey: string, configValue: any, description?: string) {
    return false; // Stubbed for now
  }
};
