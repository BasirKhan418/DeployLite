import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const CheckAuth = async () => {
    try{
        const cook = await cookies()
        let token: any = cook.get("token");
        if (token) {
            const decoded:any = jwt.verify(token.value, process.env.SECRET_KEY|| "");
            return {result:true,email:decoded.email};
        }
        return {result:false};
    }
    catch(err){
        return {result:false};
    }
}
export default CheckAuth