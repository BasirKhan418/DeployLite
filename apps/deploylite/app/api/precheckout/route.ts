import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from "next/server";
import ConnectDb from '../../../../middleware/connectdb';
import CheckAuth from '@/actions/CheckAuth';
import TempPayment from '../../../../models/TempPayment';
export const POST = async (req: NextRequest) => {
  const data = await req.json();
  await ConnectDb();
  let result = await CheckAuth()
  if(!result.result){
      return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
  }
  let Delete = await TempPayment.deleteMany({email:result.email})
  let rand = Math.floor(Math.random() * 10000000);

  var instance = new Razorpay({ 
    key_id: process.env.NEXT_PUBLIC_KEY_ID ||"", 
    key_secret: process.env.NEXT_PUBLIC_KEY_SECRET||"" 
  });
   let add =new TempPayment({
    email:result.email,
    amount:data.amount,
   })
    let saved = await add.save()
  var options = {
    amount: data.amount * 100, 
    currency: "INR",
    receipt: `${rand}`
  };

  try {
    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    return NextResponse.json({ order, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
};