"use client"

import React, { useEffect, useState } from 'react'
import { Suspense } from 'react'
import ProjectOverview from '@/utils/Project/details/ProjectOverview'
import WebBuilderOverview from '@/utils/Project/details/WebBuilderOverview'
import VirtualSpaceOverview from '@/utils/Project/details/VirtualSpaceOverview'
import { useSearchParams } from 'next/navigation'
import ProjectSkeleton from '@/utils/skeleton/ProjectSkeleton'
import { Toaster, toast } from 'sonner'

interface VirtualSpaceProject {
  _id: string;
  name: string;
  projectstatus: string;
  startdate: string;
  updatedAt: string;
  cpuusage: string;
  memoryusage: string;
  storageusage: string;
  planid: {
    name: string;
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
    pricephour: string;
    pricepmonth: string;
    features: string[];
  };
  [key: string]: any;
}

const page = () => {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false)
  const [projectdata, setProjectData] = useState<any>(null)
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
      } else if (projectType === 'virtualspace') {
       
        const response = await fetch(`/api/project/virtualspace`);
        const data = await response.json();
        setLoading(false);
        
        if (data.success && data.projectdata) {
        
          const project = data.projectdata.find((p: any) => p._id === id);
          if (project) {
            const convertedProject = {
              ...project,
              cpuusage: String(project.cpuusage || 0),
              memoryusage: String(project.memoryusage || 0),
              storageusage: String(project.storageusage || 0),
              planid: typeof project.planid === 'string' ? {
                name: project.planid,
                cpu: '',
                ram: '',
                storage: '',
                bandwidth: '',
                pricephour: '',
                pricepmonth: '',
                features: []
              } : project.planid
            };
            toast.success("Virtual space details loaded successfully");
            setProjectData(convertedProject);
            setDeploymentdata([]);
          } else {
            toast.error("Virtual space not found");
          }
        } else {
          toast.error(data.message || "Failed to load virtual space details");
        }
        return;
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
      setLoading(false);
    }
  }

  // Add type guard function
  const isVirtualSpaceProject = (data: any): data is VirtualSpaceProject => {
    return data && 
           typeof data._id === 'string' && 
           typeof data.name === 'string' && 
           typeof data.projectstatus === 'string' && 
           typeof data.startdate === 'string' &&
           typeof data.updatedAt === 'string' &&
           typeof data.cpuusage === 'string' && 
           typeof data.memoryusage === 'string' && 
           typeof data.storageusage === 'string' && 
           data.planid &&
           typeof data.planid === 'object' &&
           typeof data.planid.name === 'string';
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
          ) : type === 'virtualspace' ? (
            projectdata && isVirtualSpaceProject(projectdata) ? (
              <VirtualSpaceOverview projectdata={projectdata} />
            ) : (
              <div>No virtual space data available</div>
            )
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