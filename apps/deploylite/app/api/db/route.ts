import { NextRequest,NextResponse } from "next/server"
import mongoose from 'mongoose';
import User from '../../../../models/User'
import ConnectDb from '../../../../middleware/connectdb'
export const GET = async()=>{
    await ConnectDb()
    let user = new User({
        name: 'John Doe',
        email: 'basirlada'
    })
    await user.save()
    return NextResponse.json({status: 'success'})


}