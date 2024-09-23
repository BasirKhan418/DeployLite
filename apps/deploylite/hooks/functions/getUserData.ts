const getUserData = async()=>{
    try{
        const fetchdata= await fetch("/api/get/home");
        let res = fetchdata.json();
        return res;
    }
    catch(err){
        return {success:false,message:"Something went wrong"}
    }
    
}
export default getUserData