import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Loader } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  projectId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ projectId, amount, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ projectId, amount })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { clientSecret, paymentId } = await response.json();

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: '4242424242424242', // Test card number
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Confirm payment on backend
      const confirmResponse = await fetch(`/api/payments/confirm-payment/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm payment');
      }

      onSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
        <p className="text-gray-600 mt-2">
          Amount to pay: ${amount}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader size={20} className="animate-spin mr-2" />
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <CreditCard size={20} className="mr-2" />
            Pay Now
          </span>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        This is a secure, encrypted payment
      </p>
    </div>
  );
};

export default PaymentForm;