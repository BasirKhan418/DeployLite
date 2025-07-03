import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from "next/server";
import ConnectDb from '../../../../middleware/connectdb';
import CheckAuth from '@/actions/CheckAuth';
import TempPayment from '../../../../models/TempPayment';

export const POST = async (req: NextRequest) => {
  console.log('PreCheckout API called at:', new Date().toISOString());
  
  try {
    const data = await req.json();
    console.log('PreCheckout request data:', { 
      amount: data.amount, 
      email: data.email,
      name: data.name 
    });

    await ConnectDb();
    console.log('Database connected for PreCheckout');

    // Check authentication
    let result = await CheckAuth();
    if (!result.result) {
      console.error('Authentication failed in PreCheckout');
      return NextResponse.json({
        message: "You are not authenticated. Please login to continue",
        success: false,
        login: false
      });
    }

    console.log('User authenticated:', result.email);

    // Validate amount
    if (!data.amount || data.amount <= 0) {
      console.error('Invalid amount:', data.amount);
      return NextResponse.json({
        message: "Invalid amount",
        success: false
      });
    }

    // Clean up any existing pending payments for this user
    const deletedCount = await TempPayment.deleteMany({ email: result.email });
    console.log('🗑️ Cleaned up existing temp payments:', deletedCount.deletedCount);


    const razorpayInstance = new Razorpay({ 
      key_id: process.env.NEXT_PUBLIC_KEY_ID || "", 
      key_secret: process.env.NEXT_PUBLIC_KEY_SECRET || "" 
    });

  
    const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orderOptions = {
      amount: data.amount * 100, 
      currency: "INR",
      receipt: receiptId,
      notes: {
        email: result.email,
        user_name: data.name || result.username,
        timestamp: new Date().toISOString()
      }
    };

    console.log('🏦 Creating Razorpay order with options:', {
      amount: orderOptions.amount,
      currency: orderOptions.currency,
      receipt: orderOptions.receipt,
      email: result.email
    });

    // Create Razorpay order
    const order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(orderOptions, (err, order) => {
        if (err) {
          console.error('Razorpay order creation failed:', err);
          reject(err);
        } else {
          console.log('Razorpay order created successfully:', {
            id: order.id,
            amount: order.amount,
            status: order.status
          });
          resolve(order);
        }
      });
    });

    // Create temp payment record with order ID
    const tempPayment = new TempPayment({
      email: result.email,
      amount: data.amount,
      orderId: (order as any).id,
      status: 'pending'
    });

    await tempPayment.save();
    console.log('Temp payment record created:', {
      id: tempPayment._id,
      email: tempPayment.email,
      amount: tempPayment.amount,
      orderId: tempPayment.orderId,
      status: tempPayment.status
    });

    return NextResponse.json({ 
      order, 
      success: true,
      tempPaymentId: tempPayment._id,
      message: "Order created successfully"
    });

  } catch (err: any) {
    console.error('PreCheckout API error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: false, 
      message: "Order creation failed",
      error: err.message 
    });
  }
};