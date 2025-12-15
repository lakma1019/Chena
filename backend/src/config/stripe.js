import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || stripeSecretKey === 'your-stripe-secret-key') {
  console.warn('⚠️  Stripe secret key not configured. Stripe payments will not work.');
}

const stripe = stripeSecretKey && stripeSecretKey !== 'your-stripe-secret-key'
  ? new Stripe(stripeSecretKey)
  : null;

export default stripe;

