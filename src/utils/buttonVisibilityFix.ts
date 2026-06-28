// Button Visibility Fix Utility
// This ensures all buttons are visible across the application

export const applyButtonVisibilityFixes = () => {
  // Apply fixes when DOM is loaded
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      /* Global Button Visibility Fixes */
      button, 
      [role="button"], 
      .cursor-pointer,
      input[type="button"],
      input[type="submit"] {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        z-index: 10 !important;
        min-height: 36px !important;
        min-width: fit-content !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Fix for buttons with low contrast */
      button[class*="bg-white"],
      button[class*="bg-gray"] {
        color: rgb(17, 24, 39) !important;
        border-color: rgb(209, 213, 219) !important;
      }
      
      /* Fix for buttons on dark backgrounds */
      button[class*="text-white"] {
        background-color: rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(4px) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
      
      /* Admin buttons */
      button[class*="admin"],
      .admin-button {
        background-color: rgb(234, 88, 12) !important;
        color: white !important;
        border-color: rgb(194, 65, 12) !important;
      }
      
      /* Navigation buttons */
      nav button,
      .nav-button {
        background-color: white !important;
        color: rgb(17, 24, 39) !important;
        border-color: rgb(209, 213, 219) !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Hero section buttons */
      .hero-section button {
        background-color: rgba(0, 0, 0, 0.3) !important;
        color: white !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        backdrop-filter: blur(4px) !important;
      }
      
      /* Ensure buttons are always clickable */
      button:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Button visibility fixes applied');
  }
};

// Auto-apply fixes when module is imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyButtonVisibilityFixes);
  } else {
    applyButtonVisibilityFixes();
  }
}
