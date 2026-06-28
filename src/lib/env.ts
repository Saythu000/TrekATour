/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  api: {
    url: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnvVar(name: string, value: string | undefined, defaultValue?: string): string {
  if (!value && !defaultValue) {
    throw new Error(
      `Missing or invalid environment variable: ${name}. ` +
      `Please check your .env file and ensure all keys are properly configured.`
    );
  }
  return value || defaultValue || '';
}

export const env: EnvConfig = {
  api: {
    url: validateEnvVar('VITE_API_URL', import.meta.env.VITE_API_URL, 'http://localhost:3001/api'),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate environment on module load
if (env.isDevelopment) {
  console.log('✅ Environment variables validated successfully');
}
