import Razorpay from 'razorpay';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import ConnectDb from '../../../../middleware/connectdb';
import CheckAuth from '@/actions/CheckAuth';
import TempPayment from '../../../../models/TempPayment';
import Wallet from '../../../../models/Wallet';
import User from '../../../../models/User';
export const POST = async (req:NextRequest) => {
  try {
    // Attempt to parse the incoming request body as JSON
    await ConnectDb();
    let result = CheckAuth()
    if(!result.result){
        return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
    }
    let user = await User.findOne({email:result.email})
    let tempdata = await TempPayment.findOne({email:result.email})
    const contentType = req.headers.get('content-type') || '';
    let body;

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      throw new Error('Unsupported Content-Type');
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const key_secret = process.env.NEXT_PUBLIC_KEY_SECRET||"";     

    // Creating hmac object and passing the data to be hashed
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        
    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
        
    if (razorpay_signature === generated_signature) {
        let wallet= await Wallet.findOneAndUpdate({userid:user._id},{$inc:{balance:tempdata.amount}})
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/wallet?id=${razorpay_order_id}?payment_id=${razorpay_payment_id}`, 302);
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error:any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
};

