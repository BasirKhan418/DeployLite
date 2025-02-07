import React from 'react'
import Projecthome from '@/utils/Project/Projecthome'
import DatabaseComp from '@/utils/Project/Database'
import WebBuilder from '@/utils/Project/WebBuilder'
const page = ({params}:any) => {
  return (
    <div>
        {params.project=="database"&&<DatabaseComp/>}
        {params.project=="app-platform"&&<Projecthome name={params.project} />}
        {params.project=="webbuilder"&&<WebBuilder/>}
        {params.project=="storage"&&<WebBuilder/>}
    </div>
  )
}

export default page
