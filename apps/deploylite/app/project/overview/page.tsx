"use client"

import React, { useEffect, useState } from 'react'
import { Suspense } from 'react'
import ProjectOverview from '@/utils/Project/details/ProjectOverview'
import WebBuilderOverview from '@/utils/Project/details/WebBuilderOverview'
import { useSearchParams } from 'next/navigation'
import ProjectSkeleton from '@/utils/skeleton/ProjectSkeleton'
import { Toaster, toast } from 'sonner'

const page = () => {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false)
  const [projectdata, setProjectData] = useState({})
  const [deploymentdata, setDeploymentdata] = useState([])
  const id = params?.get("id");
  const type = params?.get("type");
  
  useEffect(() => {
    if (id) {
      fetchdata(id, type);
    }
  }, [id, type])
  
  const fetchdata = async (id: string, projectType?: string | null) => {
    try {
      setLoading(true)
      
    
      let apiUrl = `/api/project/details?id=${id}`;
      if (projectType === 'webbuilder') {
        apiUrl = `/api/project/wdetails?id=${id}`;
      }
      
      let data = await fetch(apiUrl)
      const result = await data.json();
      setLoading(false);
      
      if (result.success) {
        toast.success(result.message)
        console.log('Project data:', result.projectdata)
        
        setProjectData(result.projectdata)
        
        
        if (result.deployment) {
          console.log('Deployment data:', result.deployment)
          setDeploymentdata(result.deployment)
        } else {
          
          setDeploymentdata([])
        }
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      console.error('Error fetching project details:', err)
      toast.error("Our service is temporarily down please try again after some time!")
    }
  }

  return (
    <div>
      <Toaster position='top-center'/>
      <Suspense fallback={<SearchBarFallback />}>
        {loading ? (
          <ProjectSkeleton />
        ) : (
          type === 'webbuilder' ? (
            <WebBuilderOverview projectdata={projectdata} />
          ) : (
            <ProjectOverview projectdata={projectdata} deploymentdata={deploymentdata} />
          )
        )}
      </Suspense>
    </div>
  )
}

export default page

function SearchBarFallback() {
  return <>Loading your content...</>
}