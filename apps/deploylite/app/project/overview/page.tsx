"use client"
import React, { useEffect, useState } from 'react'
import { Suspense } from 'react'
import ProjectOverview from '@/utils/Project/details/ProjectOverview'
import { useSearchParams } from 'next/navigation'
import ProjectSkeleton from '@/utils/skeleton/ProjectSkeleton'
import { Toaster,toast } from 'sonner'
const page = () => {
  const params = useSearchParams();
  const [loading,setLoading]=useState(false)
  const[projectdata,setProjectData]=useState({})
  const [deploymentdata,setDeploymentdata]=useState([])
  const id = params.get("id");
  useEffect(()=>{
   fetchdata(id);
  },[params.get("id")])
  //fetching data from the server
  const fetchdata =async(id:any)=>{
   try{
    setLoading(true)
 let data = await fetch(`/api/project/details?id=${id}`)
 const result = await data.json();
 setLoading(false);
 if(result.success){
toast.success(result.message)
//logs
console.log(result.projectdata)
console.log(result.deployment)
//setting data in states
setProjectData(result.projectdata)
setDeploymentdata(result.deployment)
 }
 else{
toast.error(result.message)
//triggered error page that you failed to fetch
 }
   }
   catch(err){
    toast.error("Our service is temporarily down please try again after some time !")
   }
  }
  return (
    <div>
      <Toaster position='top-center'/>
      <Suspense fallback={<SearchBarFallback />}>
      {loading?<ProjectSkeleton />:<ProjectOverview projectdata={projectdata} deploymentdata={deploymentdata}/>}
        </Suspense>
    </div>
  )
}

export default page

function SearchBarFallback() {
  return <>Loading your content...</>
}
 
