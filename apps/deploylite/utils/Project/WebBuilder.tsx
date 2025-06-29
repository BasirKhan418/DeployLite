"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaWordpress } from "react-icons/fa";
import { SiPrestashop } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { FaDrupal } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { PlusCircle, Search, MoreHorizontal ,ExternalLink, Layers, Cpu, Eye, BarChart2, Edit, Trash2, Play, Pause, RefreshCw, Settings,Globe } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { useRouter } from 'next/navigation';
export default function WebBuilder() {
  const [open,setOpen] = useState(false)
  const [sites, setSites] = useState([
    { id: 1, name: 'My Portfolio', url: 'myportfolio.com', lastUpdated: '2 hours ago', template: 'Custom', status: 'Live', visitors: 152, logo: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Coffee Shop', url: 'bestcoffee.com', lastUpdated: '1 day ago', template: 'E-commerce', status: 'Updating', visitors: 1089, logo: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Tech Blog', url: 'techinsights.com', lastUpdated: '5 days ago', template: 'Blog', status: 'Live', visitors: 567, logo: '/placeholder.svg?height=40&width=40' },
    { id: 4, name: 'Fitness Studio', url: 'fitnessforyou.com', lastUpdated: '1 week ago', template: 'Business', status: 'Live', visitors: 324, logo: '/placeholder.svg?height=40&width=40' },
    { id: 5, name: 'Art Gallery', url: 'modernart.com', lastUpdated: '3 days ago', template: 'Portfolio', status: 'Maintenance', visitors: 0, logo: '/placeholder.svg?height=40&width=40' },
    { id: 6, name: 'Local Restaurant', url: 'tasteofitaly.com', lastUpdated: '12 hours ago', template: 'Restaurant', status: 'Live', visitors: 789, logo: '/placeholder.svg?height=40&width=40' },
  ])
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-background/90">
     
      <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto ">
        
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          
            <h1 className="text-3xl font-bold tracking-tight flex"><Globe className="h-8 w-8 text-blue-500 mx-2"/> Web Builder</h1>
            <div className="flex items-center space-x-4">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sites..."
                  className="w-full sm:w-[300px] pl-8 pr-4 py-2 bg-background"
                />
              </form>
              <Button onClick={()=>{
                router.push(`/project/createproject/webbuilder`)
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Site
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Card key={site.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                   
                    <CardTitle className="text-lg font-semibold">
                      {site.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View site</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit site</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Analytics</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          <span>Publish changes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          <span>Unpublish</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Rebuild</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete site</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="flex items-center text-sm mb-4">
                    <Globe className="mr-1 h-4 w-4" />
                    {site.url}
                  </CardDescription>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Layers className="h-4 w-4" />
                        <span>{site.template}</span>
                      </div>
                      <Badge 
                        variant={site.status === 'Live' ? 'default' : site.status === 'Updating' ? 'secondary' : 'destructive'}
                      >
                        {site.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <FaUsers className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Visitors: {site.visitors}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {site.lastUpdated}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
     
    </div>
  )
}