import React from 'react'
import CreateProject from '@/utils/Project/CreateProject'
import CreateWebbuilder from '@/utils/Project/CreateWebbuider'
const page = ({params}:any) => {
    console.log(params)
  return (
    <div>
      {params.type=="frontend"&&<CreateProject/>}
        {params.type=="backend"&&<CreateProject/>}
        {params.type=="fullstack"&&<CreateProject/>}
        {params.type=="webbuilder"&&<CreateWebbuilder/>}
    </div>
  )
}

export default page
