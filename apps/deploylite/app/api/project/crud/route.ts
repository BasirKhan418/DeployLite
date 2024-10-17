import { NextResponse,NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
export const GET = ()=>{
return NextResponse.json({
    messsgae:"all crud is up and running"
})
}