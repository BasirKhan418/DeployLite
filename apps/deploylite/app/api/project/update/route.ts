import { NextResponse } from "next/server"
export const GET  = ()=>{
    return NextResponse.json({
        message:"hello how are you"
    })
}