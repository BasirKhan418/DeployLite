"use server"
import { cookies } from "next/headers"
const Logout = async () => {
    try{
        const cookieStore = await cookies();
        cookieStore.delete('token');
        return true;
    }
    catch(err){
        return false;
    }
}
export default Logout