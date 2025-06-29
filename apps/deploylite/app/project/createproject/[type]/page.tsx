import React from 'react'
import CreateProject from '@/utils/Project/CreateProject'
import CreateWebbuilder from '@/utils/Project/CreateWebbuider'

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
    </div>
  )
}

export default page