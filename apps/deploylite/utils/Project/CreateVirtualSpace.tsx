"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  
  Rocket,
  ChevronDown,
  Zap,
  Star,
  Globe,
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
  HelpCircle,
  Activity,
  Database,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  Layers,
  Key,
  User,
  Lock,
  CloudLightning,
  Code,
  Monitor,
  Server,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/hook";
import { Toaster, toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

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

interface PricingPlan {
  _id: string;
  name: string;
  pcategory: string;
  features: string[];
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  pricephour: string;
  pricepmonth: string;
  isfree: boolean;
}

interface SelectedPlan {
  name: string;
  id: string;
  pricephour: string;
  pricepmonth: string;
  features: string[];
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
}

export default function CreateVirtualSpace() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const [stage, setStage] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>({
    name: "", 
    id: "", 
    pricephour: "", 
    pricepmonth: "", 
    features: [],
    cpu: "",
    ram: "",
    storage: "",
    bandwidth: ""
  });
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [displayPricing, setDisplayPricing] = useState<PricingPlan[]>([]);

  const [isProjectError, setProjectError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectError(false);
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // Fetch pricing plans for virtual space
  const fetchPricingPlans = async () => {
    try {
      const res = await fetch(`/api/project/getplans`);
      const data = await res.json();
      if (data.success) {
        setPricingPlans(data.data);
        // Filter for virtual space plans (assuming they have a specific category)
        const virtualSpacePlans = data.data.filter((item: PricingPlan) => 
          item.pcategory === "virtualspace" || item.pcategory === "development"
        );
        setDisplayPricing(virtualSpacePlans);
        
        // Auto-select first plan if available
        if (virtualSpacePlans.length > 0) {
          const firstPlan = virtualSpacePlans[0];
          setSelectedPlan({
            name: firstPlan.name,
            id: firstPlan._id,
            pricephour: firstPlan.pricephour,
            pricepmonth: firstPlan.pricepmonth,
            features: firstPlan.features,
            cpu: firstPlan.cpu,
            ram: firstPlan.ram,
            storage: firstPlan.storage,
            bandwidth: firstPlan.bandwidth
          });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      toast.error('Failed to fetch pricing plans');
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  // Generate secure password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setProjectDetails({
      ...projectDetails,
      password: password
    });
  };

  // Validate project name
  const validateProjectName = (name: string) => {
    if (!name) return "Virtual space name is required";
    if (name.length < 3) return "Virtual space name must be at least 3 characters";
    if (name.length > 50) return "Virtual space name must be less than 50 characters";
    if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) return "Virtual space name can only contain letters, numbers, spaces, hyphens, and underscores";
    return null;
  };

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 50) return "Password must be less than 50 characters";
    return null;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const nameError = validateProjectName(projectDetails.name);
    if (nameError) {
      setProjectError(true);
      setErrorMsg(nameError);
      toast.error(nameError);
      setStage(1);
      return;
    }

    const passwordError = validatePassword(projectDetails.password);
    if (passwordError) {
      setProjectError(true);
      setErrorMsg(passwordError);
      toast.error(passwordError);
      setStage(1);
      return;
    }

    if (!selectedPlan.id) {
      toast.error("Please select a pricing plan");
      setStage(2);
      return;
    }

    setLoading(true);
    setIsDeploying(true);

    try {
      const submissionData = {
        name: projectDetails.name.trim(),
        password: projectDetails.password,
        planid: selectedPlan.id,
      };

      console.log('Submitting virtual space data:', { ...submissionData, password: '[HIDDEN]' });

      const createProject = await fetch("/api/project/virtualspace", {
        headers: { 
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createProject.json();
      console.log('API Response:', res);
      
      setLoading(false);
      setIsDeploying(false);
 
      if (res.success) {
        toast.success(res.message);
        // Redirect to virtual space overview
        router.push(`/project/overview?id=${res.project._id}&type=virtualspace`);
      } else {
        if (res.projectname === "exists" || res.virtualspacename === "exists") {
          setStage(1);
          setProjectError(true);
          setErrorMsg(res.message);
        }
        toast.error(res.message || 'Failed to create virtual space');
        console.error('Virtual space creation failed:', res);
      }
    } catch (err: any) {
      console.error('Error creating virtual space:', err);
      toast.error(err.message || 'Failed to create virtual space');
      setLoading(false);
      setIsDeploying(false);
    }
  };

  // Check if user is authenticated and has GitHub connected
  if (!user?.email) {
    router.push('/login');
    return null;
  }

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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Create Virtual Space
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Set up your cloud-based development environment with containerized infrastructure
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
              {[
                { num: 1, title: "Space Setup", icon: Settings },
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

          <div className="max-w-4xl mx-auto">
            {/* Project Setup Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 shadow-2xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                        <CloudLightning className="w-6 h-6 text-pink-400" />
                      </div>
                      Virtual Space Setup
                    </CardTitle>
                    <div className="flex items-center space-x-2 border border-pink-500/30 rounded-xl px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                      <Terminal className="w-5 h-5 text-pink-400" />
                      <span className="text-sm text-gray-300 font-medium">Cloud IDE</span>
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 mt-2">
                    Configure your containerized development environment
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit}>
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
                          <div className="grid grid-cols-1 gap-6">
                            {/* Virtual Space Name */}
                            <div>
                              <Label htmlFor="space-name" className="text-gray-200 font-medium">
                                Virtual Space Name *
                              </Label>
                              <Input
                                id="space-name"
                                name="name"
                                value={projectDetails.name}
                                onChange={handleProjectDetailsChange}
                                placeholder="my-dev-space"
                                className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50"
                                required
                              />
                              {isProjectError && (
                                <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  {errorMsg}
                                </p>
                              )}
                              <p className="text-gray-500 text-sm mt-1">
                                This will be your virtual space identifier. Choose something memorable.
                              </p>
                            </div>

                            {/* Password Configuration */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Lock className="w-4 h-4" />
                                  Access Password
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={generatePassword}
                                  className="text-pink-400 border-pink-500/30 hover:bg-pink-500/10"
                                >
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate Secure
                                </Button>
                              </div>

                              <div className="relative">
                                <Input
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  value={projectDetails.password}
                                  onChange={handleProjectDetailsChange}
                                  placeholder="Enter a secure password"
                                  className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500/50 pr-12"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="text-amber-400 font-medium">Important: Save Your Password</h4>
                                    <p className="text-amber-300/80 text-sm mt-1">
                                      This password will be required to access your virtual development environment. 
                                      Make sure to save it securely as it cannot be recovered.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={() => {
                              const nameError = validateProjectName(projectDetails.name);
                              if (nameError) {
                                setProjectError(true);
                                setErrorMsg(nameError);
                                toast.error(nameError);
                                return;
                              }
                              const passwordError = validatePassword(projectDetails.password);
                              if (passwordError) {
                                setProjectError(true);
                                setErrorMsg(passwordError);
                                toast.error(passwordError);
                                return;
                              }
                              setStage(2);
                            }}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-pink-500/25"
                          >
                            Next: Choose Plan
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
                            <p className="text-gray-400">Select the perfect plan for your virtual development space</p>
                          </div>

                          {displayPricing.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-gray-400">Loading pricing plans...</p>
                            </div>
                          ) : (
                            <RadioGroup value={selectedPlan.name} onValueChange={(value) => {
                              const plan = displayPricing.find(p => p.name === value);
                              if (plan) {
                                setSelectedPlan({
                                  name: plan.name,
                                  id: plan._id,
                                  pricephour: plan.pricephour,
                                  pricepmonth: plan.pricepmonth,
                                  features: plan.features,
                                  cpu: plan.cpu,
                                  ram: plan.ram,
                                  storage: plan.storage,
                                  bandwidth: plan.bandwidth
                                });
                              }
                            }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {displayPricing.map((plan, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.02, y: -5 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="relative cursor-pointer"
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

                                    <Label htmlFor={plan.name} className="cursor-pointer">
                                      <div className="text-center">
                                        <div className="text-xl font-bold text-gray-100 mb-2">
                                          {plan.name}
                                        </div>
                                        <p className="text-gray-400 mt-2 text-sm">
                                          {plan.name.includes("Starter") && "Perfect for individual developers"}
                                          {plan.name.includes("Pro") && "Ideal for team projects"}
                                          {plan.name.includes("Enterprise") && "For large scale development"}
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
                                      </div>

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
                                        {plan.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                                          <div key={featureIndex} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                          </div>
                                        ))}
                                        {plan.features.length > 3 && (
                                          <div className="text-xs text-gray-400">
                                            +{plan.features.length - 3} more features
                                          </div>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                </motion.div>
                              ))}
                            </RadioGroup>
                          )}

                          <div className="flex justify-between pt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStage(1)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                if (!selectedPlan.id) {
                                  toast.error("Please select a plan");
                                } else {
                                  setStage(3);
                                }
                              }}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                            >
                              Next: Review & Deploy
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
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <div className="text-center">
                                <div className="text-xs text-green-400 font-medium">Ready to Deploy</div>
                                <div className="text-lg font-bold text-white">
                                  Virtual Space
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project Overview */}
                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                              <CardHeader className="pb-4">
                                <CardTitle className="text-gray-100 flex items-center gap-2">
                                  <CloudLightning className="w-5 h-5 text-pink-400" />
                                  Virtual Space Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Name:</span>
                                  <span className="text-gray-100 font-medium">{projectDetails.name || "Untitled"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Type:</span>
                                  <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-pink-400" />
                                    <span className="text-gray-100">Development Environment</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Access:</span>
                                  <span className="text-gray-100 text-sm">Password Protected</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">IDE:</span>
                                  <span className="text-gray-100 text-sm">Cloud-based VS Code</span>
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
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-pink-400" />
                                    <span className="text-gray-300">{selectedPlan.cpu}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MemoryStick className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">{selectedPlan.ram}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                                  <Coffee className="w-4 h-4" />
                                  <span>Est. setup time: 2-3 minutes</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Important Notice */}
                          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                              <div>
                                <h4 className="text-amber-400 font-medium">Remember Your Password</h4>
                                <p className="text-amber-300/80 text-sm mt-1">
                                  Your password: <code className="bg-black/30 px-2 py-1 rounded text-amber-300">{projectDetails.password}</code>
                                  <br />
                                  Save this password securely. You'll need it to access your virtual development environment.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Deployment Status */}
                          {isDeploying && (
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                              <div className="flex items-center gap-4">
                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                <div>
                                  <h4 className="text-blue-400 font-medium text-lg">Deploying Virtual Space...</h4>
                                  <p className="text-blue-300/80 text-sm mt-1">
                                    This may take 1-2 minutes. Please don't close this page.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-between pt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStage(2)}
                              disabled={isDeploying}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                              Back to Plans
                            </Button>
                            <Button
                              type="submit"
                              disabled={loading || isDeploying}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 px-8 h-12 text-lg font-semibold shadow-lg shadow-pink-500/25"
                            >
                              {loading || isDeploying ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                  Deploying...
                                </>
                              ) : (
                                <>
                                  Deploy Virtual Space
                                  <Rocket className="ml-2 h-5 w-5" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Showcase */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Virtual Space Features
              </h3>
              <p className="text-gray-400">Powerful development environment in the cloud</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Cloud IDE",
                  description: "VS Code in browser",
                  icon: <Code className="w-6 h-6 text-pink-400" />,
                  color: "from-pink-500/10 to-purple-500/10",
                  border: "border-pink-500/20"
                },
                {
                  title: "Terminal Access",
                  description: "Full Linux environment",
                  icon: <Terminal className="w-6 h-6 text-green-400" />,
                  color: "from-green-500/10 to-emerald-500/10",
                  border: "border-green-500/20"
                },
                {
                  title: "Secure Access",
                  description: "Password protected",
                  icon: <Shield className="w-6 h-6 text-blue-400" />,
                  color: "from-blue-500/10 to-cyan-500/10",
                  border: "border-blue-500/20"
                },
                {
                  title: "Auto-save",
                  description: "Work never lost",
                  icon: <CheckCircle className="w-6 h-6 text-orange-400" />,
                  color: "from-orange-500/10 to-red-500/10",
                  border: "border-orange-500/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`relative p-6 bg-gradient-to-br ${feature.color} border ${feature.border} rounded-xl text-center transition-all duration-300`}
                >
                  <div className="flex flex-col items-center gap-3">
                    {feature.icon}
                    <div>
                      <div className="text-lg font-bold text-gray-100">{feature.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{feature.description}</div>
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