import React from 'react'
import CreateProject from '@/utils/Project/CreateProject'
import CreateWebbuilder from '@/utils/Project/CreateWebbuider'
const page = ({params}:any) => {
    console.log(params)
  return (
    <div>
      {params.type=="app-platform"&&<CreateProject name={params.type}/>}
        {params.type=="webbuilder"&&<CreateWebbuilder />}
    </div>
  )
}

export default page
