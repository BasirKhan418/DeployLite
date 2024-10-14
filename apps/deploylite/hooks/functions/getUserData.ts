const getUserData = async()=>{
    try{
        const fetchdata= await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get/home`);
        let res = fetchdata.json();
        console.log(res)
        return res;
    }
    catch(err){
        console.log(err)
        return {success:false,message:"Something went wrong"}
    }
    
}
export default getUserData