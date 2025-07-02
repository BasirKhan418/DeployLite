import Razorpay from 'razorpay';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import ConnectDb from '../../../../middleware/connectdb';
import TempPayment from '../../../../models/TempPayment';
import Wallet from '../../../../models/Wallet';
import User from '../../../../models/User';

export const POST = async (req: NextRequest) => {
  console.log('🔄 PostCheckout API called at:', new Date().toISOString());
  
  try {
    
    await ConnectDb();
    console.log(' Database connected successfully');
    
  
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    
    console.log('📝 Razorpay callback data received:', {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
      signature_present: !!body.razorpay_signature,
      timestamp: new Date().toISOString()
    });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing required Razorpay parameters:', {
        order_id: !!razorpay_order_id,
        payment_id: !!razorpay_payment_id,
        signature: !!razorpay_signature
      });
      
      return NextResponse.redirect(
        new URL('/wallet?payment=error&message=Missing payment parameters', req.url)
      );
    }

  
    const key_secret = process.env.NEXT_PUBLIC_KEY_SECRET;
    if (!key_secret) {
      console.error('Razorpay key secret not found in environment');
      return NextResponse.redirect(
        new URL('/wallet?payment=error&message=Server configuration error', req.url)
      );
    }

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    const signatureValid = generated_signature === razorpay_signature.toString();
    console.log('Signature verification:', {
      valid: signatureValid,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id
    });

    if (!signatureValid) {
      console.error('Payment signature verification failed');
      
    
      await TempPayment.updateMany(
        { orderId: razorpay_order_id.toString() },
        { status: 'failed' }
      );
      
      return NextResponse.redirect(
        new URL('/wallet?payment=failed&message=Invalid payment signature', req.url)
      );
    }

    console.log('✅ Payment signature verified successfully');

  
    let tempPayment = await TempPayment.findOne({ 
      orderId: razorpay_order_id.toString(),
      status: 'pending'
    });

    console.log('🔍 Temp payment search by order ID:', {
      orderId: razorpay_order_id.toString(),
      found: !!tempPayment,
      tempPaymentData: tempPayment ? {
        id: tempPayment._id,
        email: tempPayment.email,
        amount: tempPayment.amount,
        status: tempPayment.status
      } : null
    });

    if (!tempPayment) {
      console.log('⚠️ No temp payment found by order ID, trying fallback method');
      
      const recentTime = new Date(Date.now() - 30 * 60 * 1000); 
      const recentPayments = await TempPayment.find({
        status: 'pending',
        createdAt: { $gte: recentTime }
      }).sort({ createdAt: -1 }).limit(5);

      console.log('🔍 Fallback search - recent pending payments:', {
        count: recentPayments.length,
        payments: recentPayments.map(tp => ({
          id: tp._id,
          email: tp.email,
          amount: tp.amount,
          orderId: tp.orderId,
          createdAt: tp.createdAt
        }))
      });

      if (recentPayments.length > 0) {
        tempPayment = recentPayments[0];
        console.log('📋 Using most recent pending payment as fallback');
      }
    }

    if (!tempPayment) {
      console.error('❌ No matching temp payment record found');
      return NextResponse.redirect(
        new URL('/wallet?payment=error&message=Payment record not found', req.url)
      );
    }

    console.log('📋 Processing temp payment:', {
      id: tempPayment._id,
      email: tempPayment.email,
      amount: tempPayment.amount,
      orderId: tempPayment.orderId,
      status: tempPayment.status
    });

   
    await TempPayment.findByIdAndUpdate(tempPayment._id, { 
      status: 'processing' 
    });
    console.log('🔄 Updated temp payment status to processing');

    // Find user
    const user = await User.findOne({ email: tempPayment.email });
    if (!user) {
      console.error('User not found for email:', tempPayment.email);
      
    
      await TempPayment.findByIdAndUpdate(tempPayment._id, { 
        status: 'failed' 
      });
      
      return NextResponse.redirect(
        new URL('/wallet?payment=error&message=User not found', req.url)
      );
    }

    console.log('👤 User found:', {
      email: user.email,
      name: user.name,
      id: user._id
    });

   
    let wallet = await Wallet.findOne({ userid: user._id });
    
    if (!wallet) {
      console.log('💳 Creating new wallet for user');
      wallet = new Wallet({
        userid: user._id,
        balance: 0,
        transactions: []
      });
      await wallet.save();
      console.log('New wallet created with ID:', wallet._id);
    }

    const oldBalance = wallet.balance || 0;
    const addAmount = tempPayment.amount;
    const newBalance = oldBalance + addAmount;

    console.log('💰 Wallet update calculation:', {
      walletId: wallet._id,
      oldBalance,
      addAmount,
      newBalance
    });

    
    const newTransaction = {
      amount: addAmount,
      description: `Payment via Razorpay - Order: ${razorpay_order_id} - Payment: ${razorpay_payment_id}`,
      type: "credit",
      date: new Date()
    };

    console.log('Creating transaction:', newTransaction);

  
    const updateResult = await Wallet.findOneAndUpdate(
      { userid: user._id },
      {
        $set: { balance: newBalance },
        $push: { transactions: newTransaction }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updateResult) {
      console.error('Failed to update wallet');
      
      // Update temp payment status to failed
      await TempPayment.findByIdAndUpdate(tempPayment._id, { 
        status: 'failed' 
      });
      
      return NextResponse.redirect(
        new URL('/wallet?payment=error&message=Failed to update wallet', req.url)
      );
    }

    console.log('Wallet updated successfully:', {
      walletId: updateResult._id,
      newBalance: updateResult.balance,
      transactionCount: updateResult.transactions.length,
      latestTransactionAmount: updateResult.transactions[updateResult.transactions.length - 1]?.amount
    });

    // Verify the update by fetching fresh data
    const verifyWallet = await Wallet.findOne({ userid: user._id });
    console.log('🔍 Verification - fresh wallet data:', {
      balance: verifyWallet?.balance,
      transactionCount: verifyWallet?.transactions?.length,
      userId: user._id
    });

    // Update temp payment status to completed and clean up
    await TempPayment.findByIdAndUpdate(tempPayment._id, { 
      status: 'completed' 
    });
    console.log('Updated temp payment status to completed');

    // Delete the completed temp payment record
    const deleteResult = await TempPayment.deleteOne({ _id: tempPayment._id });
    console.log('🗑️ Temp payment cleanup:', {
      deleted: deleteResult.deletedCount,
      tempPaymentId: tempPayment._id
    });

    // Create success redirect URL
    const redirectUrl = new URL('/wallet', req.url);
    redirectUrl.searchParams.set('payment', 'success');
    redirectUrl.searchParams.set('amount', addAmount.toString());
    redirectUrl.searchParams.set('order_id', razorpay_order_id.toString());
    redirectUrl.searchParams.set('payment_id', razorpay_payment_id.toString());
    redirectUrl.searchParams.set('new_balance', newBalance.toString());
    
    console.log('Redirecting to wallet with success parameters:', {
      url: redirectUrl.toString(),
      amount: addAmount,
      newBalance: newBalance,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error: any) {
    console.error('PostCheckout API error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.redirect(
      new URL('/wallet?payment=error&message=Payment processing failed', req.url)
    );
  }
};