import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY!);

export async function initiateSubscription() {
  const stripe = await stripePromise;
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const session = await response.json();
  await stripe?.redirectToCheckout({ sessionId: session.id });
}
