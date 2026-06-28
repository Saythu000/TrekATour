/**
 * Development security utilities
 * Provides security checks and warnings for development environment
 */

import { logSecurityHeaderValidation, getSecurityScore } from './securityValidator';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

/**
 * Perform security checks in development environment
 */
export const performDevSecurityChecks = (): SecurityCheck[] => {
  const checks: SecurityCheck[] = [];

  // Check if running on HTTPS in production
  if (import.meta.env.PROD && window.location.protocol !== 'https:') {
    checks.push({
      name: 'HTTPS',
      status: 'fail',
      message: 'Production site should use HTTPS'
    });
  } else {
    checks.push({
      name: 'HTTPS',
      status: 'pass',
      message: 'Protocol security check passed'
    });
  }

  // Check for development server exposure
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      checks.push({
        name: 'Dev Server',
        status: 'warn',
        message: 'Development server accessible from external network'
      });
    } else {
      checks.push({
        name: 'Dev Server',
        status: 'pass',
        message: 'Development server properly restricted to localhost'
      });
    }
  }

  // Check for environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName] === 'REGENERATE_THIS_KEY'
  );

  if (missingEnvVars.length > 0) {
    checks.push({
      name: 'Environment Variables',
      status: 'fail',
      message: `Missing or invalid environment variables: ${missingEnvVars.join(', ')}`
    });
  } else {
    checks.push({
      name: 'Environment Variables',
      status: 'pass',
      message: 'All required environment variables are configured'
    });
  }

  // Check security headers implementation
  const securityScore = getSecurityScore();
  checks.push({
    name: 'Security Headers',
    status: securityScore.score >= 80 ? 'pass' : securityScore.score >= 60 ? 'warn' : 'fail',
    message: `Security score: ${securityScore.score}% (Grade: ${securityScore.grade})`
  });

  // Check for console.log statements in production
  if (import.meta.env.PROD) {
    checks.push({
      name: 'Console Logs',
      status: 'pass',
      message: 'Console logs removed in production build'
    });
  }

  return checks;
};

/**
 * Log security check results to console (development only)
 */
export const logSecurityChecks = (): void => {
  if (!import.meta.env.DEV) return;

  const checks = performDevSecurityChecks();
  
  console.group('🔒 Security Checks');
  
  checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
    const style = check.status === 'pass' ? 'color: green' : check.status === 'warn' ? 'color: orange' : 'color: red';
    
    console.log(`%c${icon} ${check.name}: ${check.message}`, style);
  });
  
  console.groupEnd();

  // Show summary
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  
  if (failCount > 0) {
    console.warn(`🚨 ${failCount} security issue(s) found that need immediate attention`);
  } else if (warnCount > 0) {
    console.warn(`⚠️ ${warnCount} security warning(s) found`);
  } else {
    console.log('🛡️ All security checks passed');
  }

  // Log detailed security header validation
  logSecurityHeaderValidation();
};

/**
 * Initialize development security monitoring
 */
export const initDevSecurity = (): void => {
  if (!import.meta.env.DEV) return;

  // Run security checks on load
  setTimeout(logSecurityChecks, 1000);

  // Monitor for external access attempts
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.warn('⚠️ Development server accessed from external network. This may be a security risk.');
  }
};
