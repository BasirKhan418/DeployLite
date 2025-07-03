import React from 'react'
import CreateProject from '@/utils/Project/CreateProject'
import CreateWebbuilder from '@/utils/Project/CreateWebbuider'
import CreateVirtualSpace from '@/utils/Project/CreateVirtualSpace'
import CreateDatabase from '@/utils/Project/CreateDatabase'

interface PageProps {
  params: Promise<{ type: string }>
}

const page = async ({ params }: PageProps) => {
  const { type } = await params
  
  console.log(type)
  
  return (
    <div>
      {type === "app-platform" && <CreateProject name={type}/>}
      {type === "webbuilder" && <CreateWebbuilder />}
      {type === "virtualspace" && <CreateVirtualSpace />}
      {type === "database" && <CreateDatabase />}
    </div>
  )
}

export default page