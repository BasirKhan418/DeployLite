"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  PlusCircle,
  MoreHorizontal,
  GitBranch,
  ExternalLink,
  Cpu,
  HardDrive,
  Eye,
  BarChart2,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  CloudUpload,
  Loader2,
} from "lucide-react";

import { useAppSelector } from "@/lib/hook";
import Connect from "./Connect";
import NoProject from "./NoProject";

const Projecthome = ({ name }: { name: string }) => {
  // Getting user from Redux
  const user = useAppSelector((state) => state.user.user);
  console.log(user);

  const getDetails = async()=>{
    console.log('fetching data')
    try{
     setLoading(true)
     let result = await fetch('/api/project/crud');
     const data = await result.json();
      setLoading(false)
      console.log("result is ",data)
     if(data.success){
       console.log("data is ",data)
     }
     else{
      toast.error(data.message)
     }
    }
    catch(err){
      console.log(err)
      toast.error('Error while fetching data');
     
    }
  }
  useEffect(()=>{
    getDetails()
  },[]) 

  // Sample data
  const [projects] = useState([
    {
      id: 1,
      name: "My Blog",
      url: "myblog.com",
      lastDeployment: "2 hours ago",
      branch: "main",
      status: "Live",
      cpu: 15,
      memory: 30,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "E-commerce Site",
      url: "myshop.com",
      lastDeployment: "1 day ago",
      branch: "production",
      status: "Building",
      cpu: 45,
      memory: 60,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Portfolio",
      url: "myportfolio.com",
      lastDeployment: "5 days ago",
      branch: "main",
      status: "Live",
      cpu: 5,
      memory: 20,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Mobile App Landing",
      url: "myapp.com",
      lastDeployment: "1 week ago",
      branch: "develop",
      status: "Live",
      cpu: 10,
      memory: 25,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "API Documentation",
      url: "api.myservice.com",
      lastDeployment: "3 days ago",
      branch: "main",
      status: "Failed",
      cpu: 0,
      memory: 0,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Internal Dashboard",
      url: "dashboard.internal.com",
      lastDeployment: "12 hours ago",
      branch: "staging",
      status: "Live",
      cpu: 25,
      memory: 40,
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const haveproject = true;

  const handleCreateProject = () => {
    setLoading(true);

    toast.custom((id) => (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
        <span className="text-pink-600">Creating your project...</span>
      </div>
    ));

    router.push(`/project/createproject/${name}`);
  };

  return (
    <>
      {!user?.connectgithub ? (
        <Connect />
      ) : (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-background/90">
          {!haveproject ? (
            <NoProject name={name} />
          ) : (
            <div>
              <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                      <CloudUpload className="h-8 w-8 text-pink-600" />
                      <h1 className="text-3xl font-bold tracking-tight mx-2">
                        App Platform
                      </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        className="hidden sm:flex"
                        onClick={handleCreateProject}
                        disabled={loading}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {loading ? "Loading..." : "Create Project"}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg font-semibold">
                              {project.name}
                            </CardTitle>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-[200px]"
                              >
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View project</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart2 className="mr-2 h-4 w-4" />
                                  <span>Analytics</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  <span>Start</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pause className="mr-2 h-4 w-4" />
                                  <span>Pause</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  <span>Restart</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete project</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="flex items-center text-sm mb-4">
                            <ExternalLink className="mr-1 h-4 w-4" />
                            {project.url}
                          </CardDescription>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm">
                                <GitBranch className="h-4 w-4" />
                                <span>{project.branch}</span>
                              </div>
                              <Badge
                                variant={
                                  project.status === "Live"
                                    ? "default"
                                    : project.status === "Building"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  project.status === "Live"
                                    ? "bg-green-500 text-white"
                                    : ""
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2">
                                <Cpu className="h-4 w-4 text-pink-600" />
                                <span className="text-sm">
                                  CPU: {project.cpu}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <HardDrive className="h-4 w-4 text-green-500" />
                                <span className="text-sm">
                                  {" "}
                                  Memory: {project.memory}%
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last deploy: {project.lastDeployment}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Projecthome;
