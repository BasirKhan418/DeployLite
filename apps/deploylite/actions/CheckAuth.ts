import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const CheckAuth =  () => {
    try{
        const cook = cookies()
        let token: any = cook.get("token");
        console.log(token.value)
        if (token) {
            const decoded = jwt.verify(token.value, process.env.SECRET_KEY|| "");
            return true;
        }
        return false;
    }
    catch(err){
        console.log(err)
        return false;
    }
}
export default CheckAuth