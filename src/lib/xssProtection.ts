/**
 * XSS Protection utilities
 * Provides protection against Cross-Site Scripting attacks
 */

/**
 * Sanitize HTML content to prevent XSS
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Escape HTML entities
 */
export const escapeHtml = (text: string): string => {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return text.replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
};

/**
 * Validate and sanitize URLs to prevent javascript: and data: schemes
 */
export const sanitizeUrl = (url: string): string => {
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const urlObj = new URL(url, window.location.origin);
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '#';
    }
    
    return urlObj.href;
  } catch {
    // Invalid URL, return safe default
    return '#';
  }
};

/**
 * Remove potentially dangerous attributes from HTML elements
 */
export const sanitizeAttributes = (element: Element): void => {
  const dangerousAttributes = [
    'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
    'onselect', 'onkeydown', 'onkeypress', 'onkeyup'
  ];

  dangerousAttributes.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });

  // Sanitize href attributes
  if (element.hasAttribute('href')) {
    const href = element.getAttribute('href');
    if (href) {
      element.setAttribute('href', sanitizeUrl(href));
    }
  }

  // Sanitize src attributes
  if (element.hasAttribute('src')) {
    const src = element.getAttribute('src');
    if (src) {
      element.setAttribute('src', sanitizeUrl(src));
    }
  }
};

/**
 * Content Security Policy violation reporter
 */
export const setupCSPReporting = (): void => {
  // Listen for CSP violations
  document.addEventListener('securitypolicyviolation', (event) => {
    const violation = {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      timestamp: new Date().toISOString()
    };

    // Log violation in development
    if (import.meta.env.DEV) {
      console.warn('🚨 CSP Violation:', violation);
    }

    // In production, you might want to send this to your logging service
    if (import.meta.env.PROD) {
      // Example: Send to logging service
      // fetch('/api/csp-violation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(violation)
      // });
    }
  });
};

/**
 * Detect and prevent potential XSS in form inputs
 */
export const validateFormInput = (input: string): { isValid: boolean; sanitized: string } => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ];

  const hasXSS = xssPatterns.some(pattern => pattern.test(input));
  const sanitized = escapeHtml(input);

  return {
    isValid: !hasXSS,
    sanitized
  };
};

/**
 * Initialize XSS protection
 */
export const initXSSProtection = (): void => {
  // Set up CSP violation reporting
  setupCSPReporting();

  // Monitor for potentially dangerous DOM modifications
  if (import.meta.env.DEV) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for dangerous elements
            const dangerousTags = ['script', 'iframe', 'object', 'embed'];
            if (dangerousTags.includes(element.tagName.toLowerCase())) {
              console.warn('🚨 Potentially dangerous element added to DOM:', element);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
