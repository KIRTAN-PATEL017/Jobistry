import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PaymentForm from '../components/payment/PaymentForm';

const Payment: React.FC = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const amount = location.state?.amount;

  const handlePaymentSuccess = () => {
    // Handle successful payment
    console.log('Payment successful');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PaymentForm 
          projectId={projectId!}
          amount={amount}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default Payment;