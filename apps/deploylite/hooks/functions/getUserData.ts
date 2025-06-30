const getUserData = async()=>{
    try{
        const fetchdata= await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get/home`);
        let res = await fetchdata.json();
        console.log("res is ",res)
        return res;
    }
    catch(err){
        console.log("error is ",err)
        return {success:false,message:"Something went wrong"}
    }
    
}
export default getUserData