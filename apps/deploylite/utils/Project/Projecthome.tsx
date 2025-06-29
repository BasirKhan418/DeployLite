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

interface Project {
  id?: number;
  _id?: string;
  name: string;
  url?: string;
  lastDeployment?: string;
  branch?: string;
  repobranch?: string;
  status?: string;
  projectstatus?: string;
  cpu?: number;
  memory?: number;
  logo?: string;
  updatedAt?: string;
}

const Projecthome = ({ name }: { name: string }) => {
  const user = useAppSelector((state) => state.user.user);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasProjectsLoaded, setHasProjectsLoaded] = useState(false); 
  const router = useRouter();

  const getDetails = async () => {
    if (!user) {
      console.log('No user found for project fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching project details for user:', user.email);
    
    try {
      const result = await fetch(`/api/project/crud`);
      const data = await result.json();
      
      console.log('Project API Response:', data);
      
      if (data.success && data.projectdata) {
        setProjects(data.projectdata);
        setHasProjectsLoaded(true);
        console.log('Projects loaded successfully:', data.projectdata.length);
      } else {
        console.log('No projects found or API error:', data.message);
        setProjects([]);
        setHasProjectsLoaded(true);
        if (data.message && !data.message.includes('No Projects found')) {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      toast.error('Error while fetching data');
      setProjects([]);
      setHasProjectsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails()
  }, [user]) 

  const handleCreateProject = async () => {
    setLoading(true);

    toast.custom(() => (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
        <span className="text-pink-600">Creating your project...</span>
      </div>
    ));

    await router.push(`/project/createproject/${name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (id: number | string | undefined) => {
    if (!id) {
      toast.error('Project ID is missing');
      return;
    }
    
    try{
      const confirm = window.confirm('Are you sure you want to delete this project?');
      if(!confirm){
        return;
      }
      setLoading(true);
      const deleteproject = await fetch(`/api/project/crud`,{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({id})
      });
      const result = await deleteproject.json();
      setLoading(false);
      if(result.success){
        toast.success(result.message);
        getDetails()
      }
      else{
        toast.error(result.message);
      }
    }
    catch(err){
      console.error('Error while deleting project:', err);
      setLoading(false);
      toast.error('Error while deleting project');
    }
  }

  return (
    <>
      {!user?.connectgithub ? (
        <Connect />
      ) : (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-background/90">
          {/* Show NoProject component only if we've loaded data and have no projects */}
          {hasProjectsLoaded && projects.length === 0 && !loading ? (
            <NoProject name={name} />
          ) : (
            <div>
              <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
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
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Project
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
                      <span className="ml-2 text-lg">Loading your projects...</span>
                    </div>
                  )}

                  {/* Projects Grid - Only show when not loading and have projects */}
                  {!loading && projects.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {projects.map((project, index) => (
                        <Card
                          key={project._id || project.id || index} 
                          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                          onClick={() => window.open(`/project/overview?id=${project._id || project.id}`)}
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
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[200px]"
                                >
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View project</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <BarChart2 className="mr-2 h-4 w-4" />
                                    <span>Analytics</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit project</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Play className="mr-2 h-4 w-4" />
                                    <span>Start</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Pause className="mr-2 h-4 w-4" />
                                    <span>Pause</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    <span>Restart</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(project._id || project.id);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete project</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription 
                              className="flex items-center text-sm mb-4 cursor-pointer hover:text-pink-600" 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://${project.name}.cloud.deploylite.tech`);
                              }}
                            >
                              <ExternalLink className="mr-1 h-4 w-4" />
                              {`${project.name}.cloud.deploylite.tech`}
                            </CardDescription>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm">
                                  <GitBranch className="h-4 w-4" />
                                  <span>{project.repobranch}</span>
                                </div>
                                <Badge
                                  variant={
                                    project.projectstatus === "live"
                                      ? "default"
                                      : project.projectstatus === "creating"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className={
                                    project.projectstatus === "live"
                                      ? "bg-green-500 text-white"
                                      : ""
                                  }
                                >
                                  {project.projectstatus}
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                  <Cpu className="h-4 w-4 text-pink-600" />
                                  <span className="text-sm">
                                    CPU: {project.cpu || 15}%
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <HardDrive className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Memory: {project.memory || 25}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last deploy: {project.updatedAt 
                                  ? new Date(project.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                  : "Never deployed"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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