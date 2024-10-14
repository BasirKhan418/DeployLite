import React from 'react'
import CreateProject from '@/utils/Project/CreateProject'
import CreateWebbuilder from '@/utils/Project/CreateWebbuider'
const page = ({params}:any) => {
    console.log(params)
  return (
    <div>
      {params.type=="frontend"&&<CreateProject name={params.type}/>}
        {params.type=="backend"&&<CreateProject name={params.type}/>}
        {params.type=="fullstack"&&<CreateProject name={params.type}/>}
        {params.type=="webbuilder"&&<CreateWebbuilder />}
    </div>
  )
}

export default page
