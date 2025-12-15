import paypal from '@paypal/checkout-server-sdk';

/**
 * PayPal Configuration
 * Set up PayPal environment (Sandbox or Live)
 */

// PayPal Client ID and Secret from environment variables
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'your-sandbox-client-id';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'your-sandbox-client-secret';
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

/**
 * Set up PayPal environment
 * Returns PayPal environment based on mode
 */
function environment() {
  if (PAYPAL_MODE === 'live') {
    return new paypal.core.LiveEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
  }
  return new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}

/**
 * Returns PayPal HTTP client instance with environment configuration
 */
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export { client };

