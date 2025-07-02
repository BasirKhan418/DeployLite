"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Wallet from '@/utils/Header/Wallet';

const WalletPage = () => {
  const searchParams = useSearchParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
 
    const paymentStatus = searchParams?.get('payment');
    const amount = searchParams?.get('amount');
    const newBalance = searchParams?.get('new_balance');
    const orderId = searchParams?.get('order_id');

    console.log('Wallet page loaded with params:', {
      paymentStatus,
      amount,
      newBalance,
      orderId
    });

    if (paymentStatus === 'success' && amount) {
      console.log('Payment successful, showing success toast');
      toast.success(`Payment successful! ₹${amount} added to your wallet.${newBalance ? ` New balance: ₹${newBalance}` : ''}`);
      
     
      setRefreshTrigger(prev => prev + 1);
      
     
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('payment');
          url.searchParams.delete('amount');
          url.searchParams.delete('order_id');
          url.searchParams.delete('new_balance');
          window.history.replaceState({}, '', url.toString());
          console.log('URL parameters cleaned up');
        }
      }, 3000); 
      
    } else if (paymentStatus === 'failed') {
      console.log('Payment failed');
      toast.error('Payment verification failed. Please try again.');
      
     
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('message');
        window.history.replaceState({}, '', url.toString());
      }
      
    } else if (paymentStatus === 'error') {
      const errorMessage = searchParams?.get('message') || 'Payment processing error';
      console.log('Payment error:', errorMessage);
      toast.error(`Payment error: ${errorMessage}. Please contact support if the issue persists.`);
      
      // Clean up URL parameters
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('message');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  return (
    <div>
   
      <Wallet key={refreshTrigger} />
    </div>
  );
};

export default WalletPage;