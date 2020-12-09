import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Tag } from './base';

console.log(process.env.STRIPE_PUBLISHABLE_KEY);

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

const Checkout = ({ priceId, children }) => {
  const [loading, setLoading] = useState(false);

  const redirectToCheckout = async (event) => {
    console.log('YOYOYO');
    event.preventDefault();
    setLoading(true);
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: priceId, quantity: 1 }],
      successUrl: `${process.env.ROOT_URL}/thank-you`,
      cancelUrl: `${process.env.ROOT_URL}/art`,
    });
    if (error) {
      console.warn('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Tag type="button" disabled={loading} onClick={redirectToCheckout}>
      {children}
    </Tag>
  );
};
export default Checkout;
