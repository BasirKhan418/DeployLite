"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import json from "../json/createproject.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  GitFork,
  Rocket,
  Server,
  Cloud,
  Zap,
  Shield,
  Users,
  Code,
  Globe,
  ChevronRight,
  Terminal,
  Layout,
  Check,
  AlertTriangle,
  Coffee,
  DollarSign,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { FaAngular } from "react-icons/fa";
import { SiFlask } from "react-icons/si";
import { DiDjango } from "react-icons/di";
import { SiSpringboot } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { FaJs } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { SiVite } from "react-icons/si";
import { Switch } from "@/components/ui/switch";
import { IoHelpCircleOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";
import { IoIosGitBranch } from "react-icons/io";
import { useAppSelector } from "@/lib/hook";
import { FiLock, FiUnlock } from "react-icons/fi";
import { SiNuxtdotjs } from "react-icons/si";
import { FaPhp } from "react-icons/fa6";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import RepoSkeleton from "../skeleton/RepoSkeleton";
import { Toaster,toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { set } from "mongoose";
export default function CreateProject({ name }: { name: string }) {
  const user = useAppSelector((state) => state.user.user);

  const [stage, setStage] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    repo: "",
    tech: "",
    buildCommand: "npm run build",
    envVariables: "",
    rootDirectory: "/",
    outputDirectory: "/dist",
    install: "npm install",
    start: "npm run start",
    branchurl: "",
    cloneurl: "",
  });
  const [isoverridebuid, setisoverridebuid] = useState(true);
  const [isrootdir, setisrootdir] = useState(true);
  const [isinstall, setisinstall] = useState(true);
  const [isoutputdir, setisoutputdir] = useState(true);
  const [isstart, setisstart] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("hobby");
  const [repoLoading, setRepoLoading] = useState(true);
  const [repovalue,setrepoValue] = useState(null);
  const [reposdata, setreposdata] = useState([
    {
      full_name: "Repos are fetching ....",
      private: true,
    },
  ]);
  const [pricingplans,setPricingPlans] = useState([]);
  const handleProjectDetailsChange = (e: any) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };
  //fetch all users repo public and private
  const fetchAllRepo = async () => {
    setRepoLoading(true);
    const repodata = await fetch(
      "https://api.github.com/user/repos?per_page=500",
      {
        headers: {
          Authorization: `token ${user.githubtoken}`,
        },
      }
    );
    const res = await repodata.json();
    setRepoLoading(false);
    console.log(res, res.length);
    setreposdata(res);
  };
  //useEffect for fetch all repo
  useEffect(() => {
    fetchAllRepo();
  }, []);
  //handle submit started from here
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Project Details:", projectDetails);
    console.log("Selected Plan:", selectedPlan);
    alert("Project created successfully!");
  };
  //useffect if tech changes according to that we have to change all build commands and all
  useEffect(() => {
    console.log("hook is running");
    json.map((item) => {
      if (projectDetails.tech == item.framework) {
        setProjectDetails({
          ...projectDetails,
          install: item.install_command,
          buildCommand: item.build_command,
          start: item.start_command,
          outputDirectory: item.outdir,
        });
      }
    });
  }, [projectDetails.tech]);
  //onrepo changes
  const onRepoChanges = (value: any) => {
    if(value==null){
      return;
    }
    var url:string;
    if(projectDetails.rootDirectory=="/"){
      url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/package.json`;
    }
    else{
      if(projectDetails.rootDirectory.startsWith("/")){
        url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/package.json`;
      }
      else{
        url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/package.json`;
      }
    }
    
    // Helper function to check if a specific package is present in dependencies or devDependencies
    function hasDependency(
      depName: any,
      dependencies: any,
      devDependencies: any
    ) {
      return dependencies[depName] || devDependencies[depName];
    }
    async function getPackageJson() {
      try {
        setRepoLoading(true);
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${user.githubtoken}`,
          },
        });
        const data = await response.json();

        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const packageJson = JSON.parse(content);

        console.log("Frameworks in package.json:", packageJson.dependencies);
        console.log("Scripts in package.json:", packageJson.scripts);

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        // Detect frameworks

        if (
          hasDependency("vite", dependencies, devDependencies) &&
          hasDependency("react", dependencies, devDependencies)
        ) {
          setProjectDetails({ ...projectDetails, tech: "Vite" });
        } else if (
          hasDependency("react", dependencies, devDependencies) &&
          hasDependency("next", dependencies, devDependencies)
        ) {
          setProjectDetails({ ...projectDetails, tech: "Next.js" });
        } else if (hasDependency("react", dependencies, devDependencies)) {
          setProjectDetails({ ...projectDetails, tech: "React" });
        } else if (
          hasDependency("vue", dependencies, devDependencies) &&
          hasDependency("nuxt", dependencies, devDependencies)
        ) {
          console.log(
            setProjectDetails({ ...projectDetails, tech: "Nuxt.js" })
          );
        } else if (hasDependency("vue", dependencies, devDependencies)) {
          setProjectDetails({ ...projectDetails, tech: "Vue.js" });
        } else if (
          hasDependency("@angular/core", dependencies, devDependencies)
        ) {
          setProjectDetails({ ...projectDetails, tech: "Angular" });
        } else if (hasDependency("express", dependencies, devDependencies)) {
          console.log(
            setProjectDetails({ ...projectDetails, tech: "Node.js" })
          );
        } else {
          setProjectDetails({ ...projectDetails, tech: "Other" });
        }
        setRepoLoading(false);
      } catch (err) {
        try {
          setRepoLoading(true);
          const url = `https://api.github.com/repos/${value.owner.login}/${value.name}/languages`;
          
          const response = await fetch(url, {
            headers: {
              Authorization: `token ${user.githubtoken}`,
            },
          });
          const datai = await response.json();
          console.log(datai);
          if (datai.hasOwnProperty("PHP")) {
            setProjectDetails({ ...projectDetails, tech: "PHP" });
          } else if (datai.hasOwnProperty("Python")) {
            try {
              var url1:string;
              if(projectDetails.rootDirectory=="/"){
                url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/requirements.txt`;
              }
              else{
                if(projectDetails.rootDirectory.startsWith("/")){
                  url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/requirements.txt`;
                }
                else{
                  url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/requirements.txt`;
                }
              }
              setRepoLoading(true);
              const response = await fetch(url1, {
                headers: {
                  Authorization: `token ${user.githubtoken}`,
                },
              });
              const data = await response.json();
              console.log(data);

              const content = Buffer.from(data.content, "base64").toString(
                "utf-8"
              );

              console.log(content);
              if (content.includes("django")) {
                console.log("inside the django checker");
                setProjectDetails({ ...projectDetails, tech: "Django" });
              } else if (content.includes("Flask")) {
                console.log("inside the flask checker");
                setProjectDetails({ ...projectDetails, tech: "Flask" });
              } else {
                console.log("inside the other checker");
                setProjectDetails({ ...projectDetails, tech: "Flask" });
              }
            } catch (err) {
              setProjectDetails({ ...projectDetails, tech: "Flask" });
            }
          } 
          else if(datai.hasOwnProperty("Java")){
            //try
            try{
            //api call
            var url2:string;
            if(projectDetails.rootDirectory=="/"){
              url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/pom.xml`;
            }
            else{
              if(projectDetails.rootDirectory.startsWith("/")){
                url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/pom.xml`;
              }
              else{
                url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/pom.xml`;
              }
            }
            setRepoLoading(true);
            const response = await fetch(url2, {
              headers: {
                Authorization: `token ${user.githubtoken}`,
              },
            });
            const data = await response.json();
            console.log(data);

            const content = Buffer.from(data.content, "base64").toString(
              "utf-8"
            );

            if(content.includes("spring")||content.includes("spring-boot")){
             setProjectDetails({...projectDetails,tech:"Springboot"})
            }
            else if (content.includes("serverlet")||content.includes("jakarta.servlet")){
            setProjectDetails({...projectDetails,tech:"Java Serverlet"})
            }
            else{
              setProjectDetails({...projectDetails,tech:"Other"})
            }
          }
          catch(err){
            setProjectDetails({...projectDetails,tech:"Other"})
          }
          //end 
          }
          else if (datai.hasOwnProperty("HTML")) {
            setProjectDetails({ ...projectDetails, tech: "HTML,CSS,JS" });
          } else if (datai.hasOwnProperty("JAVASCRIPT")) {
            setProjectDetails({ ...projectDetails, tech: "Node.js" });
          } else {
            setProjectDetails({ ...projectDetails, tech: "Other" });
          }
          setRepoLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    }

    getPackageJson();
  };

  //if root directory changes
  useEffect(() => {
    onRepoChanges(repovalue);
  }, [projectDetails.rootDirectory]);
//fetching all pricing plans
const fetchPricingPlans = async () => {
  const res = await fetch(`/api/project/getplans`);
  const data = await res.json();
  console.log(data);
  if(data.success){
    setPricingPlans(data.data);
  }
  else{
    toast.error(data.message);
  }
}
//useeffect for fetching all pricing plans
useEffect(()=>{
  fetchPricingPlans();
},[])
  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
    <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
            Create Your <span className="text-blue-600"> App</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl dark:text-gray-300">
            Deploy your code with ease. Start building the future of the
            technology today.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              New Project Setup
            </CardTitle>
            <CardDescription>
              Follow the steps below to create your new project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={`stage-${stage}`} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="stage-1"
                  onClick={() => setStage(1)}
                  disabled={stage < 1}
                >
                  Project Details
                </TabsTrigger>
                <TabsTrigger
                  value="stage-2"
                  onClick={() => setStage(2)}
                  disabled={stage < 2}
                >
                  Select Plan
                </TabsTrigger>
                <TabsTrigger
                  value="stage-3"
                  onClick={() => setStage(3)}
                  disabled={stage < 3}
                >
                  Review
                </TabsTrigger>
              </TabsList>
              <TabsContent value="stage-1">
                <div className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      name="name"
                      value={projectDetails.name}
                      onChange={handleProjectDetailsChange}
                      placeholder="My Awesome Project"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="github-repo">GitHub Repository</Label>
                    <Select
                      name="repo"
                      onValueChange={(value: any) => {
                        console.log(value);
                        setProjectDetails({
                          ...projectDetails,
                          repo: value.full_name,
                          branchurl: value.branches_url,
                          cloneurl: value.clone_url,
                        });
                        onRepoChanges(value);
                        setrepoValue(value);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a repository" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* @ts-ignore */}
                        {reposdata &&
                          reposdata.map((item: any) => (
                            <SelectItem value={item} className="w-full">
                              <div className="flex justify-center items-center">
                                <div className="flex">
                                  <FaGithub className="text-xl mx-2" />
                                  {item.full_name}
                                </div>
                                <div className="flex">
                                  {item.private && (
                                    <FiLock className="text-gray-500 mx-2" />
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="github-repo" className="flex  items-center">
                      Framework Preset
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoHelpCircleOutline className="text-xl text-gray-500 mx-2" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white text-sm rounded-md p-4 shadow-lg w-96 relative">
                            <p>
                              Select the technology and framework used in your
                              application. This helps us optimize the deployment
                              process based on the specific requirements of your
                              chosen tech stack. Available options include
                              popular frameworks like React, Next.js, Angular,
                              Vue.js, Node.js, Python (Django, Flask), Ruby on
                              Rails, and more. If unsure, refer to your
                              project's documentation to confirm the framework.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>

                    {repoLoading ? (
                      <RepoSkeleton />
                    ) : (
                      <Select
                        name="tech"
                        onValueChange={(value) =>
                          setProjectDetails({ ...projectDetails, tech: value })
                        }
                        value={projectDetails.tech}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a Framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="React">
                            <div className="flex justify-center items-center">
                              <FaReact className="mx-2 text-xl" /> React
                            </div>{" "}
                          </SelectItem>
                          <SelectItem value="Next.js">
                            <div className="flex justify-center items-center">
                              <RiNextjsFill className="mx-2 text-xl" /> Next.js
                            </div>
                          </SelectItem>
                          <SelectItem value="Angular">
                            <div className="flex justify-center items-center">
                              <FaAngular className="mx-2 text-xl" /> Angular
                            </div>
                          </SelectItem>
                          <SelectItem value="Flask">
                            <div className="flex justify-center items-center">
                              <SiFlask className="mx-2 text-xl" /> Flask
                            </div>
                          </SelectItem>
                          <SelectItem value="Django">
                            <div className="flex justify-center items-center">
                              <DiDjango className="mx-2 text-xl" /> Django
                            </div>
                          </SelectItem>
                          <SelectItem value="Springboot">
                            <div className="flex justify-center items-center">
                              <SiSpringboot className="mx-2 text-xl" />{" "}
                              Springboot
                            </div>
                          </SelectItem>
                          <SelectItem value="Java Serverlet">
                            <div className="flex justify-center items-center">
                              <FaJava className="mx-2 text-xl" /> Java Serverlet
                            </div>
                          </SelectItem>
                          <SelectItem value="Vue.js">
                            <div className="flex justify-center items-center">
                              <FaVuejs className="mx-2 text-xl" /> Vue.js
                            </div>
                          </SelectItem>
                          <SelectItem value="Node.js">
                            <div className="flex justify-center items-center">
                              <FaNodeJs className="mx-2 text-xl" /> Node.js
                            </div>
                          </SelectItem>
                          <SelectItem value="Vite">
                            <div className="flex justify-center items-center">
                              <SiVite className="mx-2 text-xl" /> Vite
                            </div>
                          </SelectItem>
                          <SelectItem value="HTML,CSS,JS">
                            <div className="flex justify-center items-center">
                              <FaHtml5 className="mx-1 text-xl" />{" "}
                              <FaCss3 className="mx-1 text-xl" />
                              <FaJs className="mx-1 text-xl" /> HTML ,CSS, JS
                            </div>
                          </SelectItem>
                          <SelectItem value="Nuxt.js">
                            <div className="flex justify-center items-center">
                              <SiNuxtdotjs className="mx-1 text-xl" />
                              Nuxt.js
                            </div>
                          </SelectItem>
                          <SelectItem value="PHP">
                            <div className="flex justify-center items-center">
                              <FaPhp className="mx-1 text-xl" />
                              PHP
                            </div>
                          </SelectItem>
                          <SelectItem value="Other">
                            <div className="flex justify-center items-center">
                              <VscWorkspaceUnknown className="mx-1 text-xl" />
                              Other
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="relative">
                    <Label
                      htmlFor="build-command"
                      className="flex  items-center"
                    >
                      Root Directory
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoHelpCircleOutline className="text-xl text-gray-500 mx-2" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white text-sm rounded-md p-4 shadow-lg w-96 relative">
                            <p>
                              The root directory is the top-level directory of
                              your project where key files such as configuration
                              files, the main application code, and package
                              management files are stored. This is the starting
                              point for your application's folder structure.
                              Ensure that all critical files are correctly
                              placed in the root to avoid deployment issues.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="rootDirectory"
                      name="rootDirectory"
                      onChange={handleProjectDetailsChange}
                      value={projectDetails.rootDirectory}
                      className="mt-1"
                      disabled={isrootdir}
                    />
                    <div className="flex items-center space-x-2 absolute top-[43px] right-4">
                      <Switch
                        id="override"
                        onCheckedChange={() => {
                          setisrootdir(!isrootdir);
                        }}
                      />
                      <Label htmlFor="override">OVERRIDE</Label>
                    </div>
                  </div>
                  <div></div>
                  {/* install command */}

                  <div className="relative">
                    <Label
                      htmlFor="build-command"
                      className="flex items-center"
                    >
                      Install Command
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoHelpCircleOutline className="text-xl text-gray-500 mx-2" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white text-sm rounded-md p-4 shadow-lg w-96 relative">
                            <p>
                              The command that is used to install your Project's
                              software dependencies. If you don't need to
                              install dependencies, override this field and
                              leave it empty.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="install"
                      name="install"
                      onChange={handleProjectDetailsChange}
                      value={projectDetails.install}
                      className="mt-1"
                      disabled={isinstall}
                    />
                    <div className="flex items-center space-x-2 absolute top-[43px] right-4">
                      <Switch
                        id="override"
                        onCheckedChange={() => {
                          setisinstall(!isinstall);
                        }}
                      />
                      <Label htmlFor="override">OVERRIDE</Label>
                    </div>
                  </div>
                  {/* build command */}
                  <div className="relative">
                    <Label
                      htmlFor="build-command"
                      className="flex items-center"
                    >
                      Build Command
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoHelpCircleOutline className="text-xl text-gray-500 mx-2" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white text-sm rounded-md p-4 shadow-lg w-96 relative">
                            <p>
                              The command your frontend framework provides for
                              compiling your code.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="build-command"
                      name="buildCommand"
                      onChange={handleProjectDetailsChange}
                      value={projectDetails.buildCommand}
                      className="mt-1"
                      disabled={isoverridebuid}
                    />
                    <div className="flex items-center space-x-2 absolute top-[43px] right-4">
                      <Switch
                        id="override"
                        onCheckedChange={() => {
                          setisoverridebuid(!isoverridebuid);
                        }}
                      />
                      <Label htmlFor="override">OVERRIDE</Label>
                    </div>
                  </div>
                  {/* out put directory */}
                  <div className="relative">
                    <Label
                      htmlFor="build-command"
                      className="flex items-center"
                    >
                      Output Directory
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoHelpCircleOutline className="text-xl text-gray-500 mx-2" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white text-sm rounded-md p-4 shadow-lg w-96 relative">
                            <p>
                              The directory in which your compiled
                              frontend/backend will be located.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="outputDirectory"
                      name="outputDirectory"
                      onChange={handleProjectDetailsChange}
                      value={projectDetails.outputDirectory}
                      className="mt-1"
                      disabled={isoutputdir}
                    />
                    <div className="flex items-center space-x-2 absolute top-[43px] right-4">
                      <Switch
                        id="override"
                        onCheckedChange={() => {
                          setisoutputdir(!isoutputdir);
                        }}
                      />
                      <Label htmlFor="override">OVERRIDE</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="env-variables">Environment Variables</Label>
                    <Textarea
                      id="env-variables"
                      name="envVariables"
                      value={projectDetails.envVariables}
                      onChange={handleProjectDetailsChange}
                      placeholder="KEY=value"
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={() => setStage(2)} className="w-full">
                    Next: Select Plan <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="stage-2">
                <div className="space-y-6 mt-6">
                  <RadioGroup
                    value={selectedPlan}
                    onValueChange={setSelectedPlan}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div
                        className={`relative flex flex-col p-6 bg-white border border-gray-200 dark:bg-black dark:border-gray-700  rounded-lg shadow-sm ${selectedPlan === "hobby" ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
                      >
                        <RadioGroupItem
                          value="hobby"
                          id="hobby"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="hobby"
                          className="font-semibold flex items-center"
                        >
                          <Cloud className="h-5 w-5 mr-2 text-blue-500" />
                          Hobby
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">
                          Perfect for side projects
                        </p>
                        <p className="mt-4 text-sm font-semibold">$0/month</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-green-500" /> 1
                            concurrent build
                          </li>
                          <li className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Automatic HTTPS
                          </li>
                        </ul>
                      </div>
                      <div
                        className={`relative flex flex-col p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${selectedPlan === "pro" ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
                      >
                        <RadioGroupItem
                          value="pro"
                          id="pro"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="pro"
                          className="font-semibold flex items-center"
                        >
                          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
                          Pro
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">
                          For growing businesses
                        </p>
                        <p className="mt-4 text-sm font-semibold">$20/month</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-green-500" /> 5
                            concurrent builds
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Advanced security
                          </li>
                          <li className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Team collaboration
                          </li>
                        </ul>
                      </div>
                      <div
                        className={`relative flex flex-col p-6 bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-lg shadow-sm ${selectedPlan === "enterprise" ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
                      >
                        <RadioGroupItem
                          value="enterprise"
                          id="enterprise"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="enterprise"
                          className="font-semibold flex items-center"
                        >
                          <Server className="h-5 w-5 mr-2 text-blue-500" />
                          Enterprise
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">
                          For large-scale applications
                        </p>
                        <p className="mt-4 text-sm font-semibold">Contact us</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Unlimited builds
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Advanced security
                          </li>
                          <li className="flex items-center">
                            <Code className="h-4 w-4 mr-2 text-green-500" />{" "}
                            Custom integrations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setStage(3)}>
                      Next: Review <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="stage-3">
                <div className="space-y-6 mt-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
                    Review Your Project
                  </h3>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="col-span-2">
                        <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Rocket className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Project Name
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                                {projectDetails.name || "Untitled Project"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-blue-500 border-blue-500"
                          >
                            {selectedPlan.charAt(0).toUpperCase() +
                              selectedPlan.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Repository
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <GitFork className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                {projectDetails.repo || "Not specified"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 ">
                              Build Command
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Terminal className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                {projectDetails.buildCommand || "Default"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-2">
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Environment Variables
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                              <pre className="text-xs text-gray-600 whitespace-pre-wrap dark:text-gray-300">
                                {projectDetails.envVariables ||
                                  "No environment variables set"}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-2">
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Web Builder
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Layout className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                Not selected
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Plan Details:{" "}
                        {selectedPlan.charAt(0).toUpperCase() +
                          selectedPlan.slice(1)}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Automatic HTTPS
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Unlimited Websites
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Continuous Deployment
                          </span>
                        </div>
                        <div className="flex items-center">
                          {selectedPlan === "hobby" ? (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          ) : (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Custom Domains
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-yellow-800">
                            Before you deploy
                          </h5>
                          <p className="mt-1 text-sm text-yellow-700">
                            Make sure you have committed all your changes and
                            pushed them to your repository.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <Coffee className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Estimated build time:{" "}
                        <span className="font-semibold">2-3 minutes</span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-6 w-6 text-gray-400 mr-2 dark:text-gray-300" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Estimated monthly cost:{" "}
                        <span className="font-semibold">$0.00</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage(3)}>
                      <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                      Back to Plans
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Project
                      <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <GitFork className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Branches
                </CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +6 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Deployments
                </CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <p className="text-xs text-muted-foreground">
                  +15 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Server Uptime
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">
                  +0.1% from last quarter
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-black shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Deployment Features
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative group bg-white dark:bg-gray-900 rounded p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <Cloud className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Cloud Hosting
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Deploy your projects to our reliable cloud infrastructure
                    for maximum uptime and scalability.
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>

              <div className="relative group bg-white dark:bg-gray-900 rounded  p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Instant Deployments
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Push your code and see it live in seconds with our automated
                    deployment pipeline.
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>

              <div className="relative group bg-white dark:bg-gray-900 rounded  p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Advanced Security
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Protect your applications with our built-in security
                    features and SSL certificates.
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
            Trusted by developers worldwide
          </h2>
          <div className="mt-8 flex justify-center space-x-6">
            <img
              className="h-8"
              src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
              alt="Tuple"
            />
            <img
              className="h-8"
              src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
              alt="Mirage"
            />
            <img
              className="h-8"
              src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
              alt="StaticKit"
            />
            <img
              className="h-8"
              src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
              alt="Transistor"
            />
            <img
              className="h-8"
              src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
              alt="Workcation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
