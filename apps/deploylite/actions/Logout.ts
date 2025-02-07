"use server"
import { cookies } from "next/headers"
const Logout = async () => {
    try{
        const cook = cookies()
        cook.delete('token');
        return true;
    }
    catch(err){
        return false;
    }
}
export default Logout