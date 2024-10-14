import { NextResponse,NextRequest } from "next/server"
export const GET = ()=>{
return NextResponse.json({
    messsgae:"all is up and running"
})
}