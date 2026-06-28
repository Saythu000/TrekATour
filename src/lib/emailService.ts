import emailjs from '@emailjs/browser';

// EmailJS Configuration - Uses environment variables or fallback values
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_your_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_your_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'
};

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => {
  return EMAILJS_CONFIG.SERVICE_ID !== 'service_your_id' &&
         EMAILJS_CONFIG.TEMPLATE_ID !== 'template_your_id' &&
         EMAILJS_CONFIG.PUBLIC_KEY !== 'your_public_key';
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (isEmailJSConfigured()) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialized with real credentials');
  } else {
    console.log('⚠️ EmailJS not configured - using demo mode');
  }
};

// Send OTP Email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  // Check if EmailJS is properly configured
  if (!isEmailJSConfigured()) {
    console.log(`📧 Demo Mode - OTP for ${email}: ${otp}`);
    return true; // Return success for demo mode
  }

  try {
    console.log(`📧 Sending real OTP email to ${email}...`);
    
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      from_name: 'TrekaTour Admin Team',
      message: `Your OTP for TrekaTour admin panel access is: ${otp}. This OTP will expire in 5 minutes.`,
      otp_code: otp,
      reply_to: 'noreply@trekatour.com'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ Real email sent successfully:', response);
    return response.status === 200;
  } catch (error: any) {
    console.error('❌ EmailJS error:', error);
    
    // If EmailJS fails, fall back to demo mode
    console.log(`📧 Fallback Demo Mode - OTP for ${email}: ${otp}`);
    return false; // Return false to trigger demo mode in UI
  }
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
