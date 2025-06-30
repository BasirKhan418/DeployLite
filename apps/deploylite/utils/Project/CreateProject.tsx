"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Server,
  ChevronDown,
  Zap,
  Star,
  Shield,
  Code,
  Bot,
  ChevronRight,
  Terminal,
  Check,
  AlertTriangle,
  Coffee,
  DollarSign,
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
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  Globe,
  BarChart3,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { FaAngular } from "react-icons/fa";
import { SiFlask } from "react-icons/si";
import { DiDjango } from "react-icons/di";
import { FaHtml5 } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { FaGithub } from "react-icons/fa6";
import { useAppSelector } from "@/lib/hook";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import { Toaster, toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// Add interface for project data
interface ProjectData {
  _id: string;
  name: string;
  projectstatus: 'live' | 'building' | 'failed' | 'creating';
  techused: string;
  repobranch?: string;
  updatedAt?: string;
  startdate?: string;
}

// Animation variants
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

export default function CreateProject({ name }: { name: string }) {
  const user = useAppSelector((state) => state.user.user);

  const [stage, setStage] = useState(1);
  const router = useRouter();
  const [buildScore, setBuildScore] = useState("");
  const [buildText, setBuildText] = useState(""); 
  const [projectDetails, setProjectDetails] = useState({
    name: name || "",
    tech: "",
    buildCommand: "npm run build",
    envVariables: "",
    rootDirectory: "/",
    outputDirectory: "/dist",
    install: "npm install",
    start: "npm run start",
  });
  const [repoDetails, setRepoDetails] = useState({
    reponame: "",
    cloneurl: "",
    branchesurl: "",
  });

  // Real data states
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    liveProjects: 0,
    buildingProjects: 0,
    failedProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Query AI Agent function
  async function queryAiAgent(message: string) {
    const API_URL = 'https://agent-9bce58c1b5878cb58d14-brwoz.ondigitalocean.app/api/v1/chat/completions';
    
    const payload = {
        messages: [
            {
                role: 'user',
                content: message
            }
        ],
        temperature: 0.7,
        stream: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DG1}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0]?.message?.content || 'No content found';
        }
        return 'No response generated';

    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
          return `Error: ${error.message}`;
        }
        return 'An unknown error occurred';
    }
  }

  // Process text function
  const processText = (text: string) => {
    const buildScoreMatch = text.match(/Build Score: (\d+)/);
    const buildScore = buildScoreMatch ? parseInt(buildScoreMatch[1]) : null;
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    processedText = processedText.replace(/[']/g, '"');
    
    return {
      buildScore,
      processedText
    };
  }

  const [isAnalyze, setIsAnalyze] = useState(false);

  // Handle analyze function
  const handleAnalyze = async(repourl: string) => {
    console.log("entering in analyzing function");
    setIsAnalyze(true);
    const response = await fetch('/api/repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl: repourl, authToken: user.githubtoken }),
    });
    const data = await response.json();
    
    console.log(data); 
    const testMessage = `
    Hii, I am sending you the one of the repo code in this format <repository>
  <folder name="src" path="src">
    <folder name="components" path="src/components">
      <folder name="ui" path="src/components/ui">
        <folder name="buttons" path="src/components/ui/buttons">
          <file name="Button.js" path="src/components/ui/buttons/Button.js">
            <content>// Button code here</content>
          </file>
        </folder>
        <folder name="forms" path="src/components/ui/forms">
          <file name="Form.js" path="src/components/ui/forms/Form.js">
            <content>// Form code here</content>
          </file>
        </folder>
      </folder>
      <file name="App.js" path="src/components/App.js">
        <content>// App code here</content>
      </file>
    </folder>
    <file name="index.js" path="src/index.js">
      <content>// Index code here</content>
    </file>
  </folder>
</repository> and you have to assume and the application in react.js and what to improve in the code practices like you are a code reviewer and you have to give the feedback to the developer in detailed manner and also if i have deploy it with deploylite give a build pass score if it 90 then high probably of pass the build build consit of all things all linitng and all give me the reponse like buildscore:then all texts in detailed manner .Whole code is ${data}. `; 
    const response2 = await queryAiAgent(testMessage);
    setIsAnalyze(false);
    console.log('Response:', response2)  
    const { buildScore, processedText } = processText(response2);
    setBuildScore(buildScore?.toString() || '');
    setBuildText(processedText);
  }

  useEffect(() => {
    if (repoDetails.cloneurl) {
      handleAnalyze(repoDetails.cloneurl);
    }
  }, [repoDetails])

  const [isoverridebuid, setisoverridebuid] = useState(true);
  const [isrootdir, setisrootdir] = useState(true);
  const [isinstall, setisinstall] = useState(true);
  const [isoutputdir, setisoutputdir] = useState(true);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    name: "",
    id: "",
    pricephour: "",
    pricepmonth: "",
    features: [],
  });
  const [repoLoading, setRepoLoading] = useState(true);
  const [repovalue, setrepoValue] = useState(null);
  const [reposdata, setreposdata] = useState([
    {
      full_name: "Repos are fetching ....",
      private: true,
    },
  ]);
  const [pricingplans, setPricingPlans] = useState([]);
  const [displayPricing, setDisplayPricing] = useState([]);
  const [detectedbranch, setDetectedBranch] = useState([]);
  const [branch, setBranch] = useState("");
  const [count, setCount] = useState(1);
  const [isprojecterror, setProjecterror] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjecterror(false);
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // Fetch user's existing projects and stats
  const fetchUserProjectsAndStats = async () => {
    console.log('User object:', user); // Add this to debug
    if (!user?.email) return;
    
    setLoadingStats(true);
    try {
      const result = await fetch(`/api/project/crud?email=${user.email}`);
      const data = await result.json();
      
      if (data.success && data.projectdata) {
        // Calculate stats
        const stats = {
          totalProjects: data.projectdata.length,
          liveProjects: data.projectdata.filter((p: ProjectData) => p.projectstatus === 'live').length,
          buildingProjects: data.projectdata.filter((p: ProjectData) => p.projectstatus === 'building').length,
          failedProjects: data.projectdata.filter((p: ProjectData) => p.projectstatus === 'failed').length,
        };
        setProjectStats(stats);
        
        // Get recent projects (last 3)
        const recent = data.projectdata
          .sort((a: ProjectData, b: ProjectData) => new Date(b.updatedAt || b.startdate || 0).getTime() - new Date(a.updatedAt || a.startdate || 0).getTime())
          .slice(0, 3);
        setRecentProjects(recent);
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch all user repos
  const fetchAllRepo = async () => {
    try {
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
      if (res.status == "401") {
        toast.error(res.message);
        setreposdata([
          {
            full_name: res.message,
            private: true,
          },
        ]);
      } else {
        setreposdata(res);
        console.log(res, res.length);
      }
      console.log(res);
      setRepoLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllRepo();
      fetchUserProjectsAndStats();
    }
  }, [user]);

  // Tech change effect
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
    if (
      projectDetails.tech == "React" ||
      projectDetails.tech == "HTML,CSS,JS" ||
      projectDetails.tech == "Vue.js" ||
      projectDetails.tech == "Angular" ||
      projectDetails.tech == "Vite"
    ) {
      let frontend = pricingplans.filter(
        (item: any) => item.pcategory == "frontend"
      );
      setType("frontend");
      setDisplayPricing(frontend);
    } else {
      let backend = pricingplans.filter(
        (item: any) => item.pcategory == "backend"
      );
      setDisplayPricing(backend);
      setType("backend");
    }
  }, [projectDetails.tech]);

  // Detect branch function
  const detectedbranchfunc = async (url: string) => {
    const newurl = url.replace("{/branch}", "");
    const fetchbranch = await fetch(newurl, {
      headers: {
        Authorization: `token ${user.githubtoken}`,
      },
    });
    const data = await fetchbranch.json();
    setDetectedBranch(data);
    setBranch(data[0].name);
  };

  // On repo changes function (keeping original logic for framework detection)
  const onRepoChanges = (value: any) => {
    if (value == null) {
      return;
    }
    detectedbranchfunc(value.branches_url);
    var url: string;
    if (projectDetails.rootDirectory == "/") {
      url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/package.json`;
    } else {
      if (projectDetails.rootDirectory.startsWith("/")) {
        url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/package.json`;
      } else {
        url = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/package.json`;
      }
    }

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

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        // Framework detection logic (keeping original logic)
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
          setProjectDetails({ ...projectDetails, tech: "Nuxt.js" });
        } else if (hasDependency("vue", dependencies, devDependencies)) {
          setProjectDetails({ ...projectDetails, tech: "Vue.js" });
        } else if (
          hasDependency("@angular/core", dependencies, devDependencies)
        ) {
          setProjectDetails({ ...projectDetails, tech: "Angular" });
        } else if (hasDependency("express", dependencies, devDependencies)) {
          setProjectDetails({ ...projectDetails, tech: "Node.js" });
        } else {
          setProjectDetails({ ...projectDetails, tech: "Other" });
        }
        setRepoLoading(false);
      } catch (err) {
        // Language detection fallback (keeping original logic)
        try {
          setRepoLoading(true);
          const url = `https://api.github.com/repos/${value.owner.login}/${value.name}/languages`;

          const response = await fetch(url, {
            headers: {
              Authorization: `token ${user.githubtoken}`,
            },
          });
          const datai = await response.json();
          
          if (datai.hasOwnProperty("PHP")) {
            setProjectDetails({ ...projectDetails, tech: "PHP" });
          } else if (datai.hasOwnProperty("Python")) {
            // Python framework detection logic
            try {
              var url1: string;
              if (projectDetails.rootDirectory == "/") {
                url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/requirements.txt`;
              } else {
                if (projectDetails.rootDirectory.startsWith("/")) {
                  url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/requirements.txt`;
                } else {
                  url1 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/requirements.txt`;
                }
              }
              
              const response = await fetch(url1, {
                headers: {
                  Authorization: `token ${user.githubtoken}`,
                },
              });
              const data = await response.json();
              const content = Buffer.from(data.content, "base64").toString("utf-8");

              if (content.includes("django")) {
                setProjectDetails({ ...projectDetails, tech: "Django" });
              } else if (content.includes("Flask")) {
                setProjectDetails({ ...projectDetails, tech: "Flask" });
              } else {
                setProjectDetails({ ...projectDetails, tech: "Flask" });
              }
            } catch (err) {
              setProjectDetails({ ...projectDetails, tech: "Flask" });
            }
          } else if (datai.hasOwnProperty("Java")) {
            // Java framework detection logic
            try {
              var url2: string;
              if (projectDetails.rootDirectory == "/") {
                url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/pom.xml`;
              } else {
                if (projectDetails.rootDirectory.startsWith("/")) {
                  url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents${projectDetails.rootDirectory}/pom.xml`;
                } else {
                  url2 = `https://api.github.com/repos/${value.owner.login}/${value.name}/contents/${projectDetails.rootDirectory}/pom.xml`;
                }
              }
              
              const response = await fetch(url2, {
                headers: {
                  Authorization: `token ${user.githubtoken}`,
                },
              });
              const data = await response.json();
              const content = Buffer.from(data.content, "base64").toString("utf-8");

              if (content.includes("spring") || content.includes("spring-boot")) {
                setProjectDetails({ ...projectDetails, tech: "Springboot" });
              } else if (content.includes("serverlet") || content.includes("jakarta.servlet")) {
                setProjectDetails({ ...projectDetails, tech: "Java Serverlet" });
              } else {
                setProjectDetails({ ...projectDetails, tech: "Other" });
              }
            } catch (err) {
              setProjectDetails({ ...projectDetails, tech: "Other" });
            }
          } else if (datai.hasOwnProperty("HTML")) {
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

  useEffect(() => {
    onRepoChanges(repovalue);
  }, [projectDetails.rootDirectory]);

  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    const res = await fetch(`/api/project/getplans`);
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setPricingPlans(data.data);
    } else {
      toast.error(data.message);
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
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ...data }),
      });
      const res = await createproject.json();
      console.log("res is", res);
      setLoading(false);
      if (res.success) {
        toast.success(res.message);
        router.push(`/project/overview?id=${res.project._id}`);
      } else {
        if (res.projectname == "exists") {
          setStage(1);
          setProjecterror(true);
          setErrormsg(res.message);
          toast.error(res.message);
          return;
        }
        toast.error(res.message);
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const getTechIcon = (tech: string) => {
    const techLower = tech?.toLowerCase() || '';
    if (techLower.includes('react')) return <FaReact className="w-4 h-4 text-blue-400" />;
    if (techLower.includes('next')) return <RiNextjsFill className="w-4 h-4" />;
    if (techLower.includes('vue')) return <FaVuejs className="w-4 h-4 text-green-400" />;
    if (techLower.includes('angular')) return <FaAngular className="w-4 h-4 text-red-400" />;
    if (techLower.includes('node')) return <FaNodeJs className="w-4 h-4 text-green-500" />;
    if (techLower.includes('python') || techLower.includes('django') || techLower.includes('flask')) return <Server className="w-4 h-4 text-yellow-400" />;
    if (techLower.includes('html')) return <FaHtml5 className="w-4 h-4 text-orange-400" />;
    return <Code className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'building':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'creating':
        return 'bg-pink-500/10 border-pink-500/30 text-pink-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl">
                <Rocket className="h-12 w-12 text-pink-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Create Your <span className="text-white">Project</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deploy your code with ease. Start building the future of technology today with our AI-powered deployment platform.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-8 mb-8">
              {[
                { num: 1, title: "Project Details", icon: Settings },
                { num: 2, title: "Select Plan", icon: Zap },
                { num: 3, title: "Review & Deploy", icon: Rocket },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      stage >= step.num 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500 text-white" 
                        : "border-gray-600 text-gray-400"
                    }`}>
                      {stage > step.num ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      stage >= step.num ? "text-pink-400" : "text-gray-400"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-20 h-0.5 mx-4 transition-colors duration-300 ${
                      stage > step.num ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-600"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                    <Code className="w-6 h-6 text-pink-400" />
                    </div>
                    New Project Setup
                  </CardTitle>
                  <div className="flex items-center space-x-2 border border-pink-500/30 rounded-xl px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                    <Bot className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-300 font-medium">
                      AI Powered
                    </span>
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
                                    Select the technology and framework used in your application. 
                                    This helps us optimize the deployment process.
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
                                <SelectItem value="Node.js" className="text-white hover:bg-pink-500/10">
                                  <div className="flex items-center gap-2">
                                    <FaNodeJs className="w-4 h-4 text-green-500" />
                                    Node.js
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

                        {/* Root Directory */}
                        <div className="relative">
                          <Label htmlFor="rootDirectory" className="text-gray-200 font-medium flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            Root Directory
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="rootDirectory"
                              name="rootDirectory"
                              onChange={handleProjectDetailsChange}
                              value={projectDetails.rootDirectory}
                              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50 pr-24"
                              disabled={isrootdir}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <Switch
                                checked={!isrootdir}
                                onCheckedChange={() => setisrootdir(!isrootdir)}
                                className="data-[state=checked]:bg-pink-500"
                              />
                              <Label className="text-xs text-gray-400">OVERRIDE</Label>
                            </div>
                          </div>
                        </div>

                        {/* Install Command */}
                        <div className="relative">
                          <Label htmlFor="install" className="text-gray-200 font-medium flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Install Command
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="install"
                              name="install"
                              onChange={handleProjectDetailsChange}
                              value={projectDetails.install}
                              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50 pr-24"
                              disabled={isinstall}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <Switch
                                checked={!isinstall}
                                onCheckedChange={() => setisinstall(!isinstall)}
                                className="data-[state=checked]:bg-pink-500"
                              />
                              <Label className="text-xs text-gray-400">OVERRIDE</Label>
                            </div>
                          </div>
                        </div>

                        {/* Build Command */}
                        <div className="relative">
                          <Label htmlFor="buildCommand" className="text-gray-200 font-medium flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Build Command
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="buildCommand"
                              name="buildCommand"
                              onChange={handleProjectDetailsChange}
                              value={projectDetails.buildCommand}
                              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50 pr-24"
                              disabled={isoverridebuid}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <Switch
                                checked={!isoverridebuid}
                                onCheckedChange={() => setisoverridebuid(!isoverridebuid)}
                                className="data-[state=checked]:bg-pink-500"
                              />
                              <Label className="text-xs text-gray-400">OVERRIDE</Label>
                            </div>
                          </div>
                        </div>

                        {/* Output Directory */}
                        <div className="relative">
                          <Label htmlFor="outputDirectory" className="text-gray-200 font-medium flex items-center gap-2">
                            <HardDrive className="w-4 h-4" />
                            Output Directory
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="outputDirectory"
                              name="outputDirectory"
                              onChange={handleProjectDetailsChange}
                              value={projectDetails.outputDirectory}
                              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50 pr-24"
                              disabled={isoutputdir}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <Switch
                                checked={!isoutputdir}
                                onCheckedChange={() => setisoutputdir(!isoutputdir)}
                                className="data-[state=checked]:bg-pink-500"
                              />
                              <Label className="text-xs text-gray-400">OVERRIDE</Label>
                            </div>
                          </div>
                        </div>

                        {/* Environment Variables */}
                        <div className="lg:col-span-2">
                          <Label htmlFor="envVariables" className="text-gray-200 font-medium flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Environment Variables
                          </Label>
                          <Textarea
                            id="envVariables"
                            name="envVariables"
                            value={projectDetails.envVariables}
                            onChange={handleProjectDetailsChange}
                            placeholder="KEY=value&#10;API_URL=https://api.example.com"
                            rows={4}
                            className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50"
                          />
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          onClick={() => {
                            if (
                              repoDetails.reponame == "" ||
                              projectDetails.name == "" ||
                              projectDetails.tech == ""
                            ) {
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
                      </div>
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
                              className={`relative cursor-pointer`}
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
                              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${
                                selectedPlan.name === plan.name 
                                  ? "border-pink-500 shadow-lg shadow-pink-500/20" 
                                  : "border-gray-700 hover:border-pink-500/50"
                              }`}>
                                <RadioGroupItem
                                  value={plan.name}
                                  id={plan.name}
                                  className="sr-only"
                                />
                                
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

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-pink-400" />
                                    <span className="text-sm text-gray-300">{plan.cpu}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MemoryStick className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm text-gray-300">{plan.ram}</span>
                                  </div>
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
                                      <Check className="w-4 h-4 text-emerald-400" />
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

                  {/* Stage 3: Review */}
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
                        <h3 className="text-2xl font-bold text-gray-100">Review Your Project</h3>
                        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <div className="text-center">
                            <div className="text-xs text-yellow-400 font-medium">Build Score</div>
                            <div className="text-lg font-bold text-white">
                              {isAnalyze ? (
                                <Loader2 className="w-4 h-4 animate-spin inline" />
                              ) : (
                                `${buildScore || "--"}%`
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Project Overview */}
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <Rocket className="w-5 h-5 text-pink-400" />
                              Project Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Name:</span>
                              <span className="text-gray-100 font-medium">{projectDetails.name || "Untitled"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Framework:</span>
                              <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                                {projectDetails.tech || "Not selected"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Plan:</span>
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                                {selectedPlan.name || "Not selected"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Repository Details */}
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <FaGithub className="w-5 h-5" />
                              Repository
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Repo:</span>
                              <span className="text-gray-100 font-mono text-sm truncate max-w-48">
                                {repoDetails.reponame || "Not selected"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Branch:</span>
                              <div className="flex items-center gap-2">
                                <GitBranch className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-100">{branch || "main"}</span>
                                {detectedbranch && detectedbranch.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      let maxcount = detectedbranch.length;
                                      if (count < maxcount) {
                                        //@ts-ignore
                                        setBranch(detectedbranch[count].name);
                                        setCount((prev) => prev + 1);
                                      } else {
                                        setCount(0);
                                        //@ts-ignore
                                        setBranch(detectedbranch[0].name);
                                      }
                                    }}
                                    className="text-xs h-6 px-2 text-pink-400 hover:text-pink-300"
                                  >
                                    Switch
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Build Configuration */}
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <Terminal className="w-5 h-5 text-green-400" />
                              Build Configuration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
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
                              <div className="text-xs text-gray-400">Start Command:</div>
                              <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-yellow-400">
                                {projectDetails.start}
                              </code>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Pricing Details */}
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-emerald-400" />
                              Pricing Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Hourly Rate:</span>
                              <span className="text-2xl font-bold text-emerald-400">₹{selectedPlan.pricephour}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Est. Monthly:</span>
                              <span className="text-lg text-gray-100">₹{selectedPlan.pricepmonth}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Coffee className="w-4 h-4" />
                              <span>Estimated build time: 3-4 minutes</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Environment Variables */}
                      {projectDetails.envVariables && (
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <Settings className="w-5 h-5 text-purple-400" />
                              Environment Variables
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-sm bg-black/50 p-4 rounded border border-gray-700 text-gray-300 overflow-x-auto">
                              {projectDetails.envVariables || "No environment variables set"}
                            </pre>
                          </CardContent>
                        </Card>
                      )}

                      {/* AI Code Review */}
                      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                        <CardHeader>
                          <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <Bot className="w-5 h-5 text-pink-400" />
                              AI Code Review
                            </CardTitle>
                            <ChevronDown
                              className={`w-5 h-5 text-pink-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
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
                            <h4 className="text-yellow-400 font-medium">Before you deploy</h4>
                            <p className="text-yellow-300/80 text-sm mt-1">
                              Make sure you have committed all your changes and pushed them to your repository.
                              Your project will be built and deployed automatically.
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
                              Creating Project...
                            </>
                          ) : (
                            <>
                              Deploy Project
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

          {/* Your Current Projects - Real Data */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Your Projects Overview
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Track your deployment journey and project statistics in real-time
              </p>
            </div>

            {loadingStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700 rounded-xl p-6 animate-pulse">
                    <div className="h-5 w-5 bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 w-16 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { 
                    icon: BarChart3, 
                    label: "Total Projects", 
                    value: projectStats.totalProjects.toString(), 
                    color: "from-blue-400 to-cyan-400",
                    bgColor: "from-blue-500/10 to-cyan-500/10",
                    borderColor: "border-blue-500/20"
                  },
                  { 
                    icon: CheckCircle, 
                    label: "Live Projects", 
                    value: projectStats.liveProjects.toString(), 
                    color: "from-emerald-400 to-green-400",
                    bgColor: "from-emerald-500/10 to-green-500/10",
                    borderColor: "border-emerald-500/20"
                  },
                  { 
                    icon: Activity, 
                    label: "Building", 
                    value: projectStats.buildingProjects.toString(), 
                    color: "from-amber-400 to-orange-400",
                    bgColor: "from-amber-500/10 to-orange-500/10",
                    borderColor: "border-amber-500/20"
                  },
                  { 
                    icon: AlertCircle, 
                    label: "Failed", 
                    value: projectStats.failedProjects.toString(), 
                    color: "from-red-400 to-pink-400",
                    bgColor: "from-red-500/10 to-pink-500/10",
                    borderColor: "border-red-500/20"
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} rounded-xl p-6 group transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-6 h-6 text-gray-400" />
                        <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-200 mb-1">{stat.label}</div>
                      <div className="text-xs text-gray-400">
                        {stat.label === "Total Projects" && "All time"}
                        {stat.label === "Live Projects" && "Currently active"}
                        {stat.label === "Building" && "In progress"}
                        {stat.label === "Failed" && "Need attention"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Projects - Real Data */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-100">Recent Projects</h3>
              <Button
                variant="ghost"
                onClick={() => router.push('/project/app-platform')}
                className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700 rounded-xl p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 bg-gray-700 rounded-lg"></div>
                      <div className="h-5 w-32 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-4 w-48 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentProjects.map((project: ProjectData, index) => (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-6 group transition-all duration-300 hover:border-pink-500/40 cursor-pointer"
                    onClick={() => router.push(`/project/overview?id=${project._id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                          {getTechIcon(project.techused)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-100 group-hover:text-pink-300 transition-colors">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.projectstatus)}`}>
                              {project.projectstatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          <span>{project.repobranch || 'main'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {project.updatedAt 
                              ? new Date(project.updatedAt).toLocaleDateString() 
                              : "Never deployed"
                            }
                          </span>
                        </div>
                        {project.name && (
                          <div className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors">
                            <Globe className="w-4 h-4" />
                            <span className="truncate text-xs">
                              {project.name}.cloud.deploylite.tech
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
                  <div className="relative">
                    <div className="text-6xl opacity-20 mb-6">🚀</div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-2">No projects yet</h3>
                    <p className="text-gray-400 mb-6">
                      Create your first project to start deploying with DeployLite.
                    </p>
                    <Button
                      onClick={() => setStage(1)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                    >
                      Create Your First Project
                      <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Deployment Benefits - Real Features */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Why Choose DeployLite?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the power of modern deployment with our cutting-edge features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast Deployments",
                  description: "Deploy your applications in seconds with our optimized build pipeline and CDN integration.",
                  color: "from-yellow-400 to-orange-400",
                  bgColor: "from-yellow-500/10 to-orange-500/10",
                  borderColor: "border-yellow-500/20"
                },
                {
                  icon: Bot,
                  title: "AI-Powered Optimization",
                  description: "Get intelligent code analysis and deployment suggestions powered by advanced AI technology.",
                  color: "from-pink-400 to-purple-400",
                  bgColor: "from-pink-500/10 to-purple-500/10",
                  borderColor: "border-pink-500/20"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Built-in security features, SSL certificates, and compliance standards to protect your applications.",
                  color: "from-emerald-400 to-green-400",
                  bgColor: "from-emerald-500/10 to-green-500/10",
                  borderColor: "border-emerald-500/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative overflow-hidden bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl border ${feature.borderColor} rounded-2xl p-6 group transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.bgColor} border ${feature.borderColor} mb-4`}>
                      <feature.icon className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <div className="relative bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-100 mb-4">
                  Ready to Deploy?
                </h3>
                <p className="text-gray-400 mb-6">
                  Join thousands of developers who trust DeployLite for their deployment needs.
                  Start your journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setStage(1)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 px-8 py-3"
                  >
                    Start Building
                    <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/docs')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
                  >
                    View Documentation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const FormattedBuildText = ({ text }: { text: string }) => {
  if (!text) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No analysis available yet</p>
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
        <span>Analysis powered by DeployLite AI • This review helps optimize your deployment</span>
      </div>
    </div>
  );
};