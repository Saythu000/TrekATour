/**
 * Security headers validation utility
 * Validates and reports on security header implementation
 */

interface SecurityHeaderCheck {
  header: string;
  present: boolean;
  value?: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

/**
 * Check if security headers are properly implemented
 */
export const validateSecurityHeaders = (): SecurityHeaderCheck[] => {
  const checks: SecurityHeaderCheck[] = [];

  // Check for CSP in meta tags
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  checks.push({
    header: 'Content-Security-Policy',
    present: !!cspMeta,
    value: cspMeta?.getAttribute('content') || undefined,
    status: cspMeta ? 'pass' : 'warn',
    message: cspMeta ? 'CSP policy configured' : 'CSP policy missing - configure on server'
  });

  // Check for X-Frame-Options
  const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  checks.push({
    header: 'X-Frame-Options',
    present: !!frameOptions,
    value: frameOptions?.getAttribute('content') || undefined,
    status: frameOptions ? 'pass' : 'warn',
    message: frameOptions ? 'Clickjacking protection enabled' : 'Clickjacking protection missing'
  });

  // Check for X-Content-Type-Options
  const contentTypeOptions = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
  checks.push({
    header: 'X-Content-Type-Options',
    present: !!contentTypeOptions,
    value: contentTypeOptions?.getAttribute('content') || undefined,
    status: contentTypeOptions ? 'pass' : 'warn',
    message: contentTypeOptions ? 'MIME sniffing protection enabled' : 'MIME sniffing protection missing'
  });

  // Check for Referrer Policy
  const referrerPolicy = document.querySelector('meta[http-equiv="Referrer-Policy"]');
  checks.push({
    header: 'Referrer-Policy',
    present: !!referrerPolicy,
    value: referrerPolicy?.getAttribute('content') || undefined,
    status: referrerPolicy ? 'pass' : 'warn',
    message: referrerPolicy ? 'Referrer policy configured' : 'Referrer policy missing'
  });

  // Check HTTPS
  const isHttps = window.location.protocol === 'https:';
  checks.push({
    header: 'HTTPS',
    present: isHttps,
    status: isHttps ? 'pass' : (window.location.hostname === 'localhost' ? 'warn' : 'fail'),
    message: isHttps ? 'Secure connection' : 'Insecure connection - use HTTPS in production'
  });

  return checks;
};

/**
 * Log security header validation results
 */
export const logSecurityHeaderValidation = (): void => {
  if (!import.meta.env.DEV) return;

  const checks = validateSecurityHeaders();
  
  console.group('🛡️ Security Headers Validation');
  
  checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
    const style = check.status === 'pass' ? 'color: green' : check.status === 'warn' ? 'color: orange' : 'color: red';
    
    console.log(`%c${icon} ${check.header}: ${check.message}`, style);
    if (check.value && import.meta.env.DEV) {
      console.log(`   Value: ${check.value.substring(0, 100)}${check.value.length > 100 ? '...' : ''}`);
    }
  });
  
  console.groupEnd();

  // Summary
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  
  if (failCount > 0) {
    console.warn(`🚨 ${failCount} critical security header(s) missing`);
  } else if (warnCount > 0) {
    console.warn(`⚠️ ${warnCount} security header(s) should be configured on server`);
  } else {
    console.log('🛡️ All security headers properly configured');
  }
};

/**
 * Get security score based on header implementation
 */
export const getSecurityScore = (): { score: number; grade: string; recommendations: string[] } => {
  const checks = validateSecurityHeaders();
  const passCount = checks.filter(c => c.status === 'pass').length;
  const totalChecks = checks.length;
  
  const score = Math.round((passCount / totalChecks) * 100);
  
  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  
  const recommendations = checks
    .filter(c => c.status !== 'pass')
    .map(c => `Configure ${c.header} on your web server`);
  
  return { score, grade, recommendations };
};
