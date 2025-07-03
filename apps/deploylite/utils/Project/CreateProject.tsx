"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import json from "../json/createproject.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Rocket,
  ChevronDown,
  Zap,
  Star,
  Shield,
  Code,
  Globe,
  Bot,
  ChevronRight,
  Terminal,
  Check,
  AlertTriangle,
  Coffee,
  MemoryStick,
  Cpu,
  HardDrive,
  Gauge,
  Sparkles,
  Settings,
  Lock,
  HelpCircle,
  Activity,
  Folder,
  Package,
  ArrowRight,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  Layers,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FaReact, FaAngular, FaHtml5, FaNodeJs, FaVuejs, FaJava, FaPhp, FaGithub } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { SiFlask, SiSpringboot, SiVite, SiNuxtdotjs, SiTypescript, SiPython } from "react-icons/si";
import { DiDjango } from "react-icons/di";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import { Switch } from "@/components/ui/switch";
import { useAppSelector } from "@/lib/hook";
import { Toaster, toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { set } from "mongoose";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Tech icon mapping
const getTechIcon = (tech: string) => {
  const techLower = tech?.toLowerCase() || '';

  if (techLower.includes('react')) return <FaReact className="w-5 h-5 text-blue-400" />;
  if (techLower.includes('next')) return <RiNextjsFill className="w-5 h-5 text-white" />;
  if (techLower.includes('angular')) return <FaAngular className="w-5 h-5 text-red-500" />;
  if (techLower.includes('vue')) return <FaVuejs className="w-5 h-5 text-green-400" />;
  if (techLower.includes('nuxt')) return <SiNuxtdotjs className="w-5 h-5 text-green-400" />;
  if (techLower.includes('vite')) return <SiVite className="w-5 h-5 text-purple-400" />;
  if (techLower.includes('node')) return <FaNodeJs className="w-5 h-5 text-green-500" />;
  if (techLower.includes('python')) return <SiPython className="w-5 h-5 text-yellow-400" />;
  if (techLower.includes('flask')) return <SiFlask className="w-5 h-5 text-white" />;
  if (techLower.includes('django')) return <DiDjango className="w-5 h-5 text-green-600" />;
  if (techLower.includes('spring')) return <SiSpringboot className="w-5 h-5 text-green-500" />;
  if (techLower.includes('java')) return <FaJava className="w-5 h-5 text-orange-500" />;
  if (techLower.includes('php')) return <FaPhp className="w-5 h-5 text-purple-500" />;
  if (techLower.includes('html')) return <FaHtml5 className="w-5 h-5 text-orange-500" />;
  if (techLower.includes('typescript')) return <SiTypescript className="w-5 h-5 text-blue-500" />;

  return <VscWorkspaceUnknown className="w-5 h-5 text-gray-400" />;
};

export default function CreateProject({ name }: { name: string }) {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const client = new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const [stage, setStage] = useState(1);
  const [buildScore, setBuildScore] = useState("");
  const [buildText, setBuildText] = useState("");
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    tech: "",
    buildCommand: "npm run build",
    envVariables: "",
    rootDirectory: "/",
    outputDirectory: "dist",
    install: "npm install",
    start: "npm run start",
  });
  const [repoDetails, setRepoDetails] = useState({
    reponame: "",
    cloneurl: "",
    branchesurl: "",
  });


  const [existingProjects, setExistingProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalProjects: 0,
    activeDeployments: 0,
    successRate: 0,
    totalUsers: 0
  });


  async function queryAiAgent(message: string) {

    try {
      const response = await client.responses.create({
    model: "gpt-4o",
    input: message,
});

console.log("response data is ",response.output_text);

      const data = response.output_text
      if(data!=null && data.trim() !== '') {
        return data;
      }
      return 'No response generated';

    } catch (error) {
      console.error('Error:', error);
      return 'Error occurred while analyzing code';
    }
  }


  const processText = (text: string) => {
    const buildScoreMatch = text.match(/Build Score: (\d+)/);
    const buildScore = buildScoreMatch ? parseInt(buildScoreMatch[1]) : null;
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    processedText = processedText.replace(/[']/g, '"');

    return { buildScore, processedText };
  }

  const [isAnalyze, setIsAnalyze] = useState(false);


  const handleAnalyze = async (repourl: string) => {
    setIsAnalyze(true);
    try {
      const response = await fetch('/api/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repourl, authToken: user.githubtoken }),
      });
      const data = await response.json();

      const testMessage = `Analyze this repository code and provide a build score (0-100) and detailed feedback: ${JSON.stringify(data)} in json like {"buildScore":85,"feedback":"..."} format. please strict to this format and do not add any extra text. Only return the json object. dont add json key "data" or "result" or "response" or "output" or "message" or "text". Only return the json object.`;
      const response2 = await queryAiAgent(testMessage);
      const newresponse = response2.split('```json')[1]?.split('```')[0].trim();
      console.log('AI Response:', newresponse);
      const parsedResponse = JSON.parse(newresponse);

      console.log('AI parsed Response:', parsedResponse);

      const buildScore = parsedResponse.buildScore;
      const feedback = parsedResponse.feedback;

      setBuildScore(buildScore?.toString() || '85');
      setBuildText(feedback || 'No feedback provided.');
    } catch (error) {
      console.error('Analysis error:', error);
      setBuildScore('--');
      setBuildText('Unable to analyze repository at this time.');
    } finally {
      setIsAnalyze(false);
    }
  }


  const fetchExistingProjects = async () => {

    if (!user?.email) return;

    try {

      const response = await fetch(`/api/project/crud?email=${user.email}`);
      const data = await response.json();

      if (data.success && data.projectdata) {
        setExistingProjects(data.projectdata.slice(0, 6));

        // Calculate platform stats
        const total = data.projectdata.length;
        const active = data.projectdata.filter((p: any) => p.projectstatus === 'live').length;
        const success = total > 0 ? Math.round((active / total) * 100) : 0;

        setPlatformStats({
          totalProjects: total,
          activeDeployments: active,
          successRate: success,
          totalUsers: 1250
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // State management
  const [isoverridebuid, setisoverridebuid] = useState(true);
  const [isrootdir, setisrootdir] = useState(true);
  const [isinstall, setisinstall] = useState(true);
  const [isoutputdir, setisoutputdir] = useState(true);
  const [isstart, setisstart] = useState(true);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    name: "", id: "", pricephour: "", pricepmonth: "", features: [],
  });
  const [repoLoading, setRepoLoading] = useState(true);
  const [repovalue, setrepoValue] = useState(null);
  const [reposdata, setreposdata] = useState([{ full_name: "Repos are fetching ....", private: true }]);
  const [pricingplans, setPricingPlans] = useState([]);
  const [displayPricing, setDisplayPricing] = useState([]);
  const [detectedbranch, setDetectedBranch] = useState([]);
  const [branch, setBranch] = useState("");

  const [isprojecterror, setProjecterror] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectDetailsChange = (e: any) => {
    setProjecterror(false);
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // Fetch all user repos
  const fetchAllRepo = async () => {
    try {
      setRepoLoading(true);
      const repodata = await fetch("https://api.github.com/user/repos?per_page=500", {
        headers: { Authorization: `token ${user.githubtoken}` },
      });
      const res = await repodata.json();

      if (res.status == "401") {
        toast.error(res.message);
        setreposdata([{ full_name: res.message, private: true }]);
      } else {
        setreposdata(res);
      }
      setRepoLoading(false);
    } catch (err: any) {
      toast.error(err.message);
      setRepoLoading(false);
    }
  };

  useEffect(() => {
    if (user?.githubtoken) {
      fetchAllRepo();
      fetchExistingProjects();
    }
  }, [user]);

  useEffect(() => {
    if (repoDetails.cloneurl) {
      handleAnalyze(repoDetails.cloneurl);
    }
  }, [repoDetails]);

  // Tech change effect
  useEffect(() => {
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

    // Determine project type and set pricing
    if (["React", "HTML,CSS,JS", "Vue.js", "Angular", "Vite"].includes(projectDetails.tech)) {
      let frontend = pricingplans.filter((item: any) => item.pcategory == "frontend");
      setType("frontend");
      setDisplayPricing(frontend);
    }
    else if (["Next.js", "Nuxt.js"].includes(projectDetails.tech)) {
      setType("fullstack");
      let backend = pricingplans.filter((item: any) => item.pcategory == "backend");
      setDisplayPricing(backend);
    }
    else {
      let backend = pricingplans.filter((item: any) => item.pcategory == "backend");
      setDisplayPricing(backend);
      setType("backend");
    }
  }, [projectDetails.tech, pricingplans]);

  // Detect branches
  const detectedbranchfunc = async (url: string) => {
    const newurl = url.replace("{/branch}", "");
    try {
      const fetchbranch = await fetch(newurl, {
        headers: { Authorization: `token ${user.githubtoken}` },
      });
      const data = await fetchbranch.json();
      setDetectedBranch(data);
      setBranch(data[0]?.name || 'main');
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranch('main');
    }
  };


  const onRepoChanges = (value: any) => {
    if (value == null) return;

    detectedbranchfunc(value.branches_url);

    const baseUrl = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents`;
    const rootDir = projectDetails.rootDirectory === "/" ? "" : projectDetails.rootDirectory;
    const packageJsonUrl = `${baseUrl}${rootDir}/package.json`;

    const hasDependency = (depName: any, dependencies: any, devDependencies: any) => {
      return dependencies[depName] || devDependencies[depName];
    };

    const detectFramework = async () => {
      try {
        setRepoLoading(true);


        const response = await fetch(packageJsonUrl, {
          headers: { Authorization: `token ${user.githubtoken}` },
        });

        if (response.ok) {
          const data = await response.json();
          const content = Buffer.from(data.content, "base64").toString("utf-8");
          const packageJson = JSON.parse(content);

          const dependencies = packageJson.dependencies || {};
          const devDependencies = packageJson.devDependencies || {};

          if (hasDependency("vite", dependencies, devDependencies)) {
            if (hasDependency("react", dependencies, devDependencies)) {
              setProjectDetails({ ...projectDetails, tech: "Vite" });
            } else if (hasDependency("vue", dependencies, devDependencies)) {
              setProjectDetails({ ...projectDetails, tech: "Vite" });
            } else {
              setProjectDetails({ ...projectDetails, tech: "Vite" });
            }
          } else if (hasDependency("next", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "Next.js" });
          } else if (hasDependency("nuxt", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "Nuxt.js" });
          } else if (hasDependency("react", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "React" });
          } else if (hasDependency("vue", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "Vue.js" });
          } else if (hasDependency("@angular/core", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "Angular" });
          } else if (hasDependency("express", dependencies, devDependencies)) {
            setProjectDetails({ ...projectDetails, tech: "Node.js" });
          } else {
            setProjectDetails({ ...projectDetails, tech: "Node.js" });
          }
        } else {
          // Fallback to language detection
          const langResponse = await fetch(`https://api.github.com/repos/${value.owner.login}/${value.name}/languages`, {
            headers: { Authorization: `token ${user.githubtoken}` },
          });
          const languages = await langResponse.json();

          if (languages.PHP) {
            setProjectDetails({ ...projectDetails, tech: "PHP" });
          } else if (languages.Python) {
            try {
              const reqResponse = await fetch(`${baseUrl}${rootDir}/requirements.txt`, {
                headers: { Authorization: `token ${user.githubtoken}` },
              });
              if (reqResponse.ok) {
                const reqData = await reqResponse.json();
                const content = Buffer.from(reqData.content, "base64").toString("utf-8");
                if (content.includes("django")) {
                  setProjectDetails({ ...projectDetails, tech: "Django" });
                } else if (content.includes("Flask")) {
                  setProjectDetails({ ...projectDetails, tech: "Flask" });
                } else {
                  setProjectDetails({ ...projectDetails, tech: "Python" });
                }
              } else {
                setProjectDetails({ ...projectDetails, tech: "Python" });
              }
            } catch {
              setProjectDetails({ ...projectDetails, tech: "Python" });
            }
          } else if (languages.Java) {
            setProjectDetails({ ...projectDetails, tech: "Java" });
          } else if (languages.HTML) {
            setProjectDetails({ ...projectDetails, tech: "HTML,CSS,JS" });
          } else if (languages.JavaScript) {
            setProjectDetails({ ...projectDetails, tech: "Node.js" });
          } else {
            setProjectDetails({ ...projectDetails, tech: "Other" });
          }
        }

        setRepoLoading(false);
      } catch (error) {
        console.error('Error detecting framework:', error);
        setProjectDetails({ ...projectDetails, tech: "Other" });
        setRepoLoading(false);
      }
    };

    detectFramework();
  };

  useEffect(() => {
    onRepoChanges(repovalue);
  }, [projectDetails.rootDirectory]);

  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    try {
      const res = await fetch(`/api/project/getplans`);
      const data = await res.json();
      if (data.success) {
        setPricingPlans(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  // Handle submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: projectDetails.name,
        type: type,
        repourl: repoDetails.cloneurl,
        repobranch: branch,
        techused: projectDetails.tech,
        buildcommand: projectDetails.buildCommand,
        rootfolder: projectDetails.rootDirectory,
        outputfolder: projectDetails.outputDirectory,
        startcommand: projectDetails.start,
        installcommand: projectDetails.install,
        env: projectDetails.envVariables,
        planid: selectedPlan.id,
      };

      const createproject = await fetch("/api/project/crud", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });

      const res = await createproject.json();
      setLoading(false);

      if (res.success) {
        toast.success(res.message);
        router.push(`/project/overview?id=${res.project._id}`);
      } else {
        if (res.projectname == "exists") {
          setStage(1);
          setProjecterror(true);
          setErrormsg(res.message);
        }
        toast.error(res.message);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <Toaster position="top-right" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">

            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Create Your Project
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deploy your code with our AI-powered platform. Get real-time analysis and instant deployments.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
              {[
                { num: 1, title: "Project Setup", icon: Settings },
                { num: 2, title: "Choose Plan", icon: Zap },
                { num: 3, title: "Deploy", icon: Rocket },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stage >= step.num
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500 text-white"
                        : "border-gray-600 text-gray-400"
                      }`}>
                      {stage > step.num ? (
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <step.icon className="w-4 h-4 md:w-6 md:h-6" />
                      )}
                    </div>
                    <span className={`text-xs md:text-sm mt-2 font-medium text-center ${stage >= step.num ? "text-pink-400" : "text-gray-400"
                      }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-12 md:w-20 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${stage > step.num ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-600"
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* New Project Setup Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 shadow-2xl mb-8">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                          <Code className="w-6 h-6 text-pink-400" />
                        </div>
                        New Project Setup
                      </CardTitle>
                      <div className="flex items-center space-x-2 border border-pink-500/30 rounded-xl px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                        <Bot className="w-5 h-5 text-pink-400" />
                        <span className="text-sm text-gray-300 font-medium">AI Powered</span>
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                    <CardDescription className="text-gray-400 mt-2">
                      Follow the steps below to create and deploy your new project
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <AnimatePresence mode="wait">
                      {/* Stage 1: Project Details */}
                      {stage === 1 && (
                        <motion.div
                          key="stage1"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={slideIn}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Project Name */}
                            <div className="lg:col-span-2">
                              <Label htmlFor="project-name" className="text-gray-200 font-medium">
                                Project Name
                              </Label>
                              <Input
                                id="project-name"
                                name="name"
                                value={projectDetails.name}
                                onChange={handleProjectDetailsChange}
                                placeholder="my-awesome-project"
                                className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50"
                              />
                              {isprojecterror && (
                                <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  {errormsg}
                                </p>
                              )}
                            </div>

                            {/* GitHub Repository */}
                            <div className="lg:col-span-2">
                              <Label htmlFor="repo" className="text-gray-200 font-medium flex items-center gap-2">
                                <FaGithub className="w-4 h-4" />
                                GitHub Repository
                              </Label>
                              <Select
                                onValueChange={(value: any) => {
                                  onRepoChanges(value);
                                  setrepoValue(value);
                                  setRepoDetails({
                                    reponame: value.full_name,
                                    cloneurl: value.clone_url,
                                    branchesurl: value.branches_url,
                                  });
                                }}
                              >
                                <SelectTrigger className="mt-2 bg-black/50 border-gray-700 text-white focus:border-pink-500/50">
                                  <SelectValue placeholder="Select a repository" />
                                </SelectTrigger>
                                <SelectContent className="bg-black/95 border-gray-700">
                                  {reposdata &&
                                    reposdata.map((item: any, index) => (
                                      <SelectItem key={index} value={item} className="text-white hover:bg-pink-500/10">
                                        <div className="flex items-center justify-between w-full">
                                          <div className="flex items-center gap-2">
                                            <FaGithub className="w-4 h-4" />
                                            <span className="truncate">{item.full_name}</span>
                                          </div>
                                          {item.private && (
                                            <Lock className="w-4 h-4 text-gray-400 ml-2" />
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Framework Selection */}
                            <div className="lg:col-span-2">
                              <Label htmlFor="tech" className="text-gray-200 font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Framework Preset
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-pink-400" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black/95 border-pink-500/20 text-white max-w-xs">
                                      <p className="text-sm">
                                        Auto-detected from your repository. Override if needed.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>

                              {repoLoading ? (
                                <div className="mt-2 p-4 bg-black/30 border border-gray-700 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                                    <span className="text-gray-400">Detecting framework...</span>
                                  </div>
                                </div>
                              ) : (
                                <Select
                                  onValueChange={(value) =>
                                    setProjectDetails({ ...projectDetails, tech: value })
                                  }
                                  value={projectDetails.tech}
                                >
                                  <SelectTrigger className="mt-2 bg-black/50 border-gray-700 text-white focus:border-pink-500/50">
                                    <SelectValue placeholder="Choose a Framework" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black/95 border-gray-700">
                                    <SelectItem value="React" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <FaReact className="w-4 h-4 text-blue-400" />
                                        React
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Next.js" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <RiNextjsFill className="w-4 h-4" />
                                        Next.js
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Angular" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <FaAngular className="w-4 h-4 text-red-400" />
                                        Angular
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Vue.js" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <FaVuejs className="w-4 h-4 text-green-400" />
                                        Vue.js
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Vite" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <SiVite className="w-4 h-4 text-purple-400" />
                                        Vite
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Node.js" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <FaNodeJs className="w-4 h-4 text-green-500" />
                                        Node.js
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Python" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <SiPython className="w-4 h-4 text-yellow-400" />
                                        Python
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Flask" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <SiFlask className="w-4 h-4" />
                                        Flask
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Django" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <DiDjango className="w-4 h-4" />
                                        Django
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="HTML,CSS,JS" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <FaHtml5 className="w-4 h-4 text-orange-400" />
                                        HTML, CSS, JS
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Other" className="text-white hover:bg-pink-500/10">
                                      <div className="flex items-center gap-2">
                                        <VscWorkspaceUnknown className="w-4 h-4" />
                                        Other
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            {/* Build Commands Grid */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Root Directory */}
                              <div className="relative">
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Folder className="w-4 h-4" />
                                  Root Directory
                                </Label>
                                <div className="relative mt-2">
                                  <Input
                                    name="rootDirectory"
                                    onChange={handleProjectDetailsChange}
                                    value={projectDetails.rootDirectory}
                                    className="bg-black/50 border-gray-700 text-white pr-20"
                                    disabled={isrootdir}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Switch
                                      checked={!isrootdir}
                                      onCheckedChange={() => setisrootdir(!isrootdir)}
                                      className="data-[state=checked]:bg-pink-500"
                                    />
                                    <span className="text-xs text-gray-400">Edit</span>
                                  </div>
                                </div>
                              </div>

                              {/* Install Command */}
                              <div className="relative">
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Package className="w-4 h-4" />
                                  Install Command
                                </Label>
                                <div className="relative mt-2">
                                  <Input
                                    name="install"
                                    onChange={handleProjectDetailsChange}
                                    value={projectDetails.install}
                                    className="bg-black/50 border-gray-700 text-white pr-20"
                                    disabled={isinstall}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Switch
                                      checked={!isinstall}
                                      onCheckedChange={() => setisinstall(!isinstall)}
                                      className="data-[state=checked]:bg-pink-500"
                                    />
                                    <span className="text-xs text-gray-400">Edit</span>
                                  </div>
                                </div>
                              </div>

                              {/* Build Command */}
                              <div className="relative">
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Terminal className="w-4 h-4" />
                                  Build Command
                                </Label>
                                <div className="relative mt-2">
                                  <Input
                                    name="buildCommand"
                                    onChange={handleProjectDetailsChange}
                                    value={projectDetails.buildCommand}
                                    className="bg-black/50 border-gray-700 text-white pr-20"
                                    disabled={isoverridebuid}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Switch
                                      checked={!isoverridebuid}
                                      onCheckedChange={() => setisoverridebuid(!isoverridebuid)}
                                      className="data-[state=checked]:bg-pink-500"
                                    />
                                    <span className="text-xs text-gray-400">Edit</span>
                                  </div>
                                </div>
                              </div>

                              {/* Output Directory */}
                              <div className="relative">
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <HardDrive className="w-4 h-4" />
                                  Output Directory
                                </Label>
                                <div className="relative mt-2">
                                  <Input
                                    name="outputDirectory"
                                    onChange={handleProjectDetailsChange}
                                    value={projectDetails.outputDirectory}
                                    className="bg-black/50 border-gray-700 text-white pr-20"
                                    disabled={isoutputdir}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Switch
                                      checked={!isoutputdir}
                                      onCheckedChange={() => setisoutputdir(!isoutputdir)}
                                      className="data-[state=checked]:bg-pink-500"
                                    />
                                    <span className="text-xs text-gray-400">Edit</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Environment Variables */}
                            <div className="lg:col-span-2">
                              <Label className="text-gray-200 font-medium flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Environment Variables
                              </Label>
                              <Textarea
                                name="envVariables"
                                value={projectDetails.envVariables}
                                onChange={handleProjectDetailsChange}
                                placeholder="NODE_ENV=production&#10;API_URL=https://api.example.com"
                                rows={4}
                                className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50"
                              />
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              if (!repoDetails.reponame || !projectDetails.name || !projectDetails.tech) {
                                toast.error("Please fill all required fields");
                              } else {
                                setStage(2);
                              }
                            }}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-pink-500/25"
                          >
                            Next: Select Plan
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Stage 2: Select Plan */}
                      {stage === 2 && (
                        <motion.div
                          key="stage2"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={slideIn}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Plan</h3>
                            <p className="text-gray-400">Select the perfect plan for your project needs</p>
                          </div>

                          <RadioGroup value={selectedPlan.name} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {displayPricing &&
                              displayPricing.map((plan: any, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.02, y: -5 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="relative cursor-pointer"
                                  onClick={() =>
                                    setSelectedPlan({
                                      name: plan.name,
                                      id: plan._id,
                                      pricephour: plan.pricephour,
                                      pricepmonth: plan.pricepmonth,
                                      features: plan.features,
                                    })
                                  }
                                >
                                  <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${selectedPlan.name === plan.name
                                      ? "border-pink-500 shadow-lg shadow-pink-500/20"
                                      : "border-gray-700 hover:border-pink-500/50"
                                    }`}>
                                    <RadioGroupItem value={plan.name} id={plan.name} className="sr-only" />

                                    {selectedPlan.name === plan.name && (
                                      <div className="absolute top-4 right-4">
                                        <CheckCircle className="w-6 h-6 text-pink-400" />
                                      </div>
                                    )}

                                    <div className="text-center">
                                      <Label htmlFor={plan.name} className="text-xl font-bold text-gray-100 cursor-pointer">
                                        {plan.name}
                                      </Label>
                                      <p className="text-gray-400 mt-2 text-sm">
                                        {plan.name === "Starter Plan" && "Perfect for side projects"}
                                        {plan.name === "Pro Plan" && "Ideal for startups & growing businesses"}
                                        {plan.name === "Enterprise Plan" && "For large-scale applications"}
                                      </p>
                                    </div>

                                    {/* Only show CPU/RAM for backend projects */}
                                    {type !== "frontend" && (
                                      <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                          <Cpu className="w-4 h-4 text-pink-400" />
                                          <span className="text-sm text-gray-300">{plan.cpu}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MemoryStick className="w-4 h-4 text-purple-400" />
                                          <span className="text-sm text-gray-300">{plan.ram}</span>
                                        </div>
                                      </div>
                                    )}

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                      <div className="flex items-center gap-2">
                                        <HardDrive className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm text-gray-300">{plan.storage}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-gray-300">{plan.bandwidth}</span>
                                      </div>
                                    </div>

                                    <Separator className="my-4 bg-gray-700" />

                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-gray-100">
                                        ₹{plan.pricephour}
                                        <span className="text-base font-normal text-gray-400">/hour</span>
                                      </div>
                                      <div className="text-sm text-gray-400 mt-1">
                                        ~₹{plan.pricepmonth}/month
                                      </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                      {plan.features.slice(0, 3).map((feature: any, featureIndex: number) => (
                                        <div key={featureIndex} className="flex items-center gap-2">
                                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                          <span className="text-sm text-gray-300">{String(feature)}</span>
                                        </div>
                                      ))}
                                      {plan.features.length > 3 && (
                                        <div className="text-xs text-gray-400">
                                          +{plan.features.length - 3} more features
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </RadioGroup>

                          <div className="flex justify-between pt-6">
                            <Button
                              variant="outline"
                              onClick={() => setStage(1)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                              Back
                            </Button>
                            <Button
                              onClick={() => {
                                if (selectedPlan.name === "") {
                                  toast.error("Please select a plan");
                                } else {
                                  setStage(3);
                                }
                              }}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                            >
                              Next: Review
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Stage 3: Review & Deploy */}
                      {stage === 3 && (
                        <motion.div
                          key="stage3"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={slideIn}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-100">Review & Deploy</h3>
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                              <Star className="w-5 h-5 text-yellow-400" />
                              <div className="text-center">
                                <div className="text-xs text-yellow-400 font-medium">Build Score</div>
                                <div className="text-lg font-bold text-white">
                                  {isAnalyze ? (
                                    <Loader2 className="w-4 h-4 animate-spin inline" />
                                  ) : (
                                    `${buildScore || "85"}%`
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project Overview */}
                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                              <CardHeader className="pb-4">
                                <CardTitle className="text-gray-100 flex items-center gap-2">
                                  <Rocket className="w-5 h-5 text-pink-400" />
                                  Project Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Name:</span>
                                  <span className="text-gray-100 font-medium">{projectDetails.name || "Untitled"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Framework:</span>
                                  <div className="flex items-center gap-2">
                                    {getTechIcon(projectDetails.tech)}
                                    <span className="text-gray-100">{projectDetails.tech || "Not selected"}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Repository:</span>
                                  <span className="text-gray-100 text-sm font-mono truncate max-w-32">
                                    {repoDetails.reponame?.split('/')[1] || "Not selected"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Branch:</span>
                                  <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-100">{branch || "main"}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Plan Details */}
                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                              <CardHeader className="pb-4">
                                <CardTitle className="text-gray-100 flex items-center gap-2">
                                  <Zap className="w-5 h-5 text-purple-400" />
                                  Selected Plan
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="text-center">
                                  <div className="text-xl font-bold text-purple-400 mb-2">
                                    {selectedPlan.name || "No plan selected"}
                                  </div>
                                  <div className="text-2xl font-bold text-gray-100">
                                    ₹{selectedPlan.pricephour}
                                    <span className="text-base font-normal text-gray-400">/hour</span>
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    ~₹{selectedPlan.pricepmonth}/month
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                                  <Coffee className="w-4 h-4" />
                                  <span>Est. build time: 3-4 minutes</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Build Configuration */}
                          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-gray-100 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-green-400" />
                                Build Configuration
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="text-xs text-gray-400">Install Command:</div>
                                <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-green-400">
                                  {projectDetails.install}
                                </code>
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs text-gray-400">Build Command:</div>
                                <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-blue-400">
                                  {projectDetails.buildCommand}
                                </code>
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs text-gray-400">Output Directory:</div>
                                <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-purple-400">
                                  {projectDetails.outputDirectory}
                                </code>
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs text-gray-400">Root Directory:</div>
                                <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-orange-400">
                                  {projectDetails.rootDirectory}
                                </code>
                              </div>
                            </CardContent>
                          </Card>

                          {/* AI Code Review */}
                          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                            <CardHeader>
                              <div
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <CardTitle className="text-gray-100 flex items-center gap-2">
                                  <Bot className="w-5 h-5 text-pink-400" />
                                  AI Code Analysis
                                </CardTitle>
                                <ChevronDown
                                  className={`w-5 h-5 text-pink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                    }`}
                                />
                              </div>
                            </CardHeader>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CardContent>
                                    <FormattedBuildText text={isAnalyze ? "Analyzing your code..." : buildText} />
                                  </CardContent>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>

                          {/* Warning */}
                          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="text-yellow-400 font-medium">Ready to deploy?</h4>
                                <p className="text-yellow-300/80 text-sm mt-1">
                                  Make sure all changes are pushed to your repository. Your project will be built and deployed automatically.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-between pt-6">
                            <Button
                              variant="outline"
                              onClick={() => setStage(2)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                              Back to Plans
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={loading}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 px-8 h-12 text-lg font-semibold shadow-lg shadow-pink-500/25"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                  Deploying...
                                </>
                              ) : (
                                <>
                                  Deploy Now
                                  <Rocket className="ml-2 h-5 w-5" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Platform Stats */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-pink-400" />
                      Platform Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                        <div className="text-2xl font-bold text-pink-400">{platformStats.totalProjects}</div>
                        <div className="text-xs text-gray-400">Your Projects</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                        <div className="text-2xl font-bold text-green-400">{platformStats.activeDeployments}</div>
                        <div className="text-xs text-gray-400">Active</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-2xl font-bold text-blue-400">{platformStats.successRate}%</div>
                        <div className="text-xs text-gray-400">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-2xl font-bold text-purple-400">{platformStats.totalUsers.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Total Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Projects */}
              {existingProjects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-gray-100 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-400" />
                        Your Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {existingProjects.slice(0, 4).map((project: any, index) => (
                        <motion.div
                          key={project._id}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 cursor-pointer"
                          onClick={() => router.push(`/project/overview?id=${project._id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getTechIcon(project.techused)}
                              <div>
                                <div className="text-sm font-medium text-gray-200 truncate max-w-32">
                                  {project.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {project.techused}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${project.projectstatus === 'live' ? 'bg-green-400' :
                                  project.projectstatus === 'building' ? 'bg-yellow-400' :
                                    project.projectstatus === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                                }`} />
                              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {existingProjects.length > 4 && (
                        <Button
                          variant="ghost"
                          onClick={() => router.push('/project/app-platform')}
                          className="w-full text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                        >
                          View all {existingProjects.length} projects
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => router.push('/project/templates')}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Code className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">Browse Templates</div>
                          <div className="text-xs text-gray-400">Start with pre-built projects</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => router.push('/docs')}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Activity className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">Documentation</div>
                          <div className="text-xs text-gray-400">Learn deployment best practices</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => router.push('/support')}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Users className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">Get Support</div>
                          <div className="text-xs text-gray-400">Need help? We're here for you</div>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Deployment Tips */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <Info className="w-5 h-5 text-cyan-400" />
                      Deployment Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                      <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-200">Environment Variables</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Add your API keys and secrets in the Environment Variables section
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-200">Build Optimization</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Our AI analyzes your code to suggest optimizations
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                      <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-200">Auto Deployments</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Push to your main branch for automatic redeployments
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Framework Showcase */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Supported Frameworks
              </h3>
              <p className="text-gray-400">Deploy any framework with zero configuration</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "React", icon: <FaReact className="w-8 h-8 text-blue-400" />, color: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/20" },
                { name: "Next.js", icon: <RiNextjsFill className="w-8 h-8 text-white" />, color: "from-gray-500/10 to-gray-700/10", border: "border-gray-500/20" },
                { name: "Vue.js", icon: <FaVuejs className="w-8 h-8 text-green-400" />, color: "from-green-500/10 to-emerald-500/10", border: "border-green-500/20" },
                { name: "Angular", icon: <FaAngular className="w-8 h-8 text-red-500" />, color: "from-red-500/10 to-pink-500/10", border: "border-red-500/20" },
                { name: "Node.js", icon: <FaNodeJs className="w-8 h-8 text-green-500" />, color: "from-green-500/10 to-lime-500/10", border: "border-green-500/20" },
                { name: "Python", icon: <SiPython className="w-8 h-8 text-yellow-400" />, color: "from-yellow-500/10 to-orange-500/10", border: "border-yellow-500/20" },
                { name: "Flask", icon: <SiFlask className="w-8 h-8 text-white" />, color: "from-gray-500/10 to-slate-500/10", border: "border-gray-500/20" },
                { name: "Django", icon: <DiDjango className="w-8 h-8 text-green-600" />, color: "from-green-600/10 to-green-800/10", border: "border-green-600/20" },
                { name: "Vite", icon: <SiVite className="w-8 h-8 text-purple-400" />, color: "from-purple-500/10 to-indigo-500/10", border: "border-purple-500/20" },
                { name: "HTML/CSS", icon: <FaHtml5 className="w-8 h-8 text-orange-500" />, color: "from-orange-500/10 to-red-500/10", border: "border-orange-500/20" },
                { name: "PHP", icon: <FaPhp className="w-8 h-8 text-purple-500" />, color: "from-purple-500/10 to-violet-500/10", border: "border-purple-500/20" },
                { name: "Java", icon: <FaJava className="w-8 h-8 text-orange-500" />, color: "from-orange-500/10 to-amber-500/10", border: "border-orange-500/20" },
              ].map((framework, index) => (
                <motion.div
                  key={framework.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`relative p-4 bg-gradient-to-br ${framework.color} border ${framework.border} rounded-xl text-center transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {framework.icon}
                    <span className="text-sm font-medium text-gray-200">{framework.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Deploy Speed",
                  value: "< 30s",
                  description: "Average deployment time",
                  icon: <Rocket className="w-6 h-6 text-pink-400" />,
                  color: "from-pink-500/10 to-purple-500/10",
                  border: "border-pink-500/20"
                },
                {
                  title: "Uptime",
                  value: "99.9%",
                  description: "Platform reliability",
                  icon: <Shield className="w-6 h-6 text-green-400" />,
                  color: "from-green-500/10 to-emerald-500/10",
                  border: "border-green-500/20"
                },
                {
                  title: "Global CDN",
                  value: "180+",
                  description: "Edge locations worldwide",
                  icon: <Globe className="w-6 h-6 text-blue-400" />,
                  color: "from-blue-500/10 to-cyan-500/10",
                  border: "border-blue-500/20"
                },
                {
                  title: "Free SSL",
                  value: "Auto",
                  description: "Certificates included",
                  icon: <Lock className="w-6 h-6 text-purple-400" />,
                  color: "from-purple-500/10 to-indigo-500/10",
                  border: "border-purple-500/20"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`relative p-6 bg-gradient-to-br ${metric.color} border ${metric.border} rounded-xl text-center transition-all duration-300`}
                >
                  <div className="flex flex-col items-center gap-3">
                    {metric.icon}
                    <div>
                      <div className="text-2xl font-bold text-gray-100">{metric.value}</div>
                      <div className="text-sm font-medium text-gray-200 mt-1">{metric.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{metric.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Formatted Build Text Component
const FormattedBuildText = ({ text }: { text: string }) => {
  if (!text) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No analysis available yet</p>
          <p className="text-sm text-gray-500 mt-2">Connect a repository to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  const parts = text.split(/(<b>.*?<\/b>)/g);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-pink-400" />
        <span className="text-sm font-medium text-pink-400">DeployLite AI Analysis</span>
        <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 text-xs">
          Beta
        </Badge>
      </div>

      <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
        <div className="prose prose-invert prose-sm max-w-none">
          <div className="text-gray-300 leading-relaxed">
            {parts.map((part, index) => {
              if (part.startsWith('<b>') && part.endsWith('</b>')) {
                const boldText = part.replace(/<\/?b>/g, '');
                return (
                  <span key={index} className="font-semibold text-white">
                    {boldText}
                  </span>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Info className="w-3 h-3" />
        <span>AI analysis helps optimize your deployment • Results may vary based on code complexity</span>
      </div>
    </div>
  );
};