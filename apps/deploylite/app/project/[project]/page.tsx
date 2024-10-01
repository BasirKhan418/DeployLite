import React from 'react'
import Projecthome from '@/utils/Project/Projecthome'
import DatabaseComp from '@/utils/Project/Database'
import WebBuilder from '@/utils/Project/WebBuilder'
const page = ({params}:any) => {
  return (
    <div>
        {params.project=="database"&&<DatabaseComp/>}
        {params.project=="frontend"&&<Projecthome name={params.project}/>}
        {params.project=="backend"&&<Projecthome name={params.project}/>}
        {params.project=="fullstack"&&<Projecthome name={params.project} />}
        {params.project=="webbuilder"&&<WebBuilder/>}
    </div>
  )
}

export default page
