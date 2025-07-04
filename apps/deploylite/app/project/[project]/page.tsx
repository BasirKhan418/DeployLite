import React from 'react'
import Projecthome from '@/utils/Project/Projecthome'
import DatabaseComp from '@/utils/Project/Database'
import WebBuilder from '@/utils/Project/WebBuilder'
import VirtualSpace from '@/utils/Project/VirtualSpace'
import ChatbotDashboard from '../chatbot/page'

interface PageProps {
  params: Promise<{ project: string }>
}

const page = async ({ params }: PageProps) => {
  const { project } = await params
  
  return (
    <div>
        {project === "database" && <DatabaseComp/>}
        {project === "app-platform" && <Projecthome name={project} />}
        {project === "webbuilder" && <WebBuilder/>}
        {project === "virtualspace" && <VirtualSpace/>}
        {project === "chatbot" && <ChatbotDashboard/>}
        {project === "storage" && <WebBuilder/>}
    </div>
  )
}

export default page