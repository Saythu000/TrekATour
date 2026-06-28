export const imageService = {
  // Delete old image from storage - Not strictly needed for local PHP storage 
  // unless we want to keep the server clean.
  async deleteOldHeroImage(imageUrl: string) {
    return { success: true };
  },

  // Upload hero image to Hostinger PHP backend
  async uploadHeroImage(file: File, oldImageUrl?: string) {
    try {
      console.log('Uploading hero image to server...');
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api-php/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('✅ Hero image uploaded successfully:', result.url);
      
      return { success: true, url: result.url };
    } catch (error) {
      console.error('Error uploading hero image:', error);
      return { success: false, error };
    }
  }
};
