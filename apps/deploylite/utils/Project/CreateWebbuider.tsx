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

// Web builders configuration
const webBuilders = [
  {
    name: 'WordPress',
    description: 'The most popular CMS platform',
    icon: '🏗️',
    features: ['Themes', 'Plugins', 'SEO-friendly', 'E-commerce ready'],
    complexity: 'Beginner to Advanced'
  },
  {
    name: 'Joomla',
    description: 'Powerful and flexible CMS',
    icon: '⚡',
    features: ['Multi-language', 'ACL', 'Templates', 'Extensions'],
    complexity: 'Intermediate to Advanced'
  },
  {
    name: 'Drupal',
    description: 'Enterprise-grade CMS',
    icon: '🛡️',
    features: ['Scalable', 'Secure', 'Customizable', 'Developer-friendly'],
    complexity: 'Advanced'
  },
  {
    name: 'PrestaShop',
    description: 'E-commerce focused platform',
    icon: '🛒',
    features: ['Online Store', 'Payment Gateway', 'Inventory', 'Analytics'],
    complexity: 'Beginner to Intermediate'
  },
  {
    name: 'OpenCart',
    description: 'Open source shopping cart',
    icon: '🛍️',
    features: ['Multi-store', 'SEO URLs', 'Backup', 'Error Logs'],
    complexity: 'Beginner to Intermediate'
  },
  {
    name: 'Magento',
    description: 'Professional e-commerce solution',
    icon: '💼',
    features: ['B2B & B2C', 'Multi-website', 'Advanced SEO', 'Performance'],
    complexity: 'Advanced'
  },
];

export default function CreateWebbuilder() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const [stage, setStage] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    dbname: "",
    dbuser: "",
    dbpass: "",
  });

  const [selectedWebBuilder, setSelectedWebBuilder] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
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
  const [pricingPlans, setPricingPlans] = useState([]);
  const [displayPricing, setDisplayPricing] = useState([]);

  const [isProjectError, setProjectError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectDetailsChange = (e: any) => {
    setProjectError(false);
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // Fetch pricing plans for webbuilder
  const fetchPricingPlans = async () => {
    try {
      const res = await fetch(`/api/project/getplans`);
      const data = await res.json();
      if (data.success) {
        setPricingPlans(data.data);
        // Filter for webbuilder plans
        const webbuilderPlans = data.data.filter((item: any) => item.pcategory === "webbuilder");
        setDisplayPricing(webbuilderPlans);
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

  // Generate secure database credentials
  const generateDbCredentials = () => {
    const dbName = `${projectDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_db`;
    const dbUser = `${projectDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_user`;
    const dbPass = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-8).toUpperCase();
    
    setProjectDetails({
      ...projectDetails,
      dbname: dbName,
      dbuser: dbUser,
      dbpass: dbPass
    });
  };

  // Handle submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {

      const submissionData = {
        name: projectDetails.name,
        webbuilder: selectedWebBuilder,
        dbname: projectDetails.dbname,
        dbuser: projectDetails.dbuser,
        dbpass: projectDetails.dbpass,
        planid: selectedPlan.id,
      };

      const createProject = await fetch("/api/project/wordpress", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createProject.json();
      console.log('API Response:', res);
      
      setLoading(false);

      if (res.success) {
        toast.success(res.message);
        console.log('Project created successfully:', res.project);
        // router.push(`/project/overview?id=${res.project._id}&type=webbuilder`);
      } else {
        if (res.projectname === "exists") {
          setStage(1);
          setProjectError(true);
          setErrorMsg(res.message);
        }
        toast.error(res.message);
        console.error('Project creation failed:', res);
      }
    } catch (err: any) {
      console.error('Error creating web builder project:', err);
      toast.error(err.message || 'Failed to create project');
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Create Web Builder Project
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deploy popular web builders with database configuration and hosting
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
              {[
                { num: 1, title: "Project Setup", icon: Settings },
                { num: 2, title: "Web Builder", icon: Globe },
                { num: 3, title: "Choose Plan", icon: Zap },
                { num: 4, title: "Deploy", icon: Rocket },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stage >= step.num
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white"
                        : "border-gray-600 text-gray-400"
                      }`}>
                      {stage > step.num ? (
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <step.icon className="w-4 h-4 md:w-6 md:h-6" />
                      )}
                    </div>
                    <span className={`text-xs md:text-sm mt-2 font-medium text-center ${stage >= step.num ? "text-purple-400" : "text-gray-400"
                      }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-12 md:w-20 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${stage > step.num ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-600"
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Project Setup Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 shadow-2xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                        <Globe className="w-6 h-6 text-purple-400" />
                      </div>
                      Web Builder Project Setup
                    </CardTitle>
                    <div className="flex items-center space-x-2 border border-purple-500/30 rounded-xl px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                      <Database className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-300 font-medium">Database Powered</span>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 mt-2">
                    Configure your web builder project with database integration
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
                        <div className="grid grid-cols-1 gap-6">
                          {/* Project Name */}
                          <div>
                            <Label htmlFor="project-name" className="text-gray-200 font-medium">
                              Project Name
                            </Label>
                            <Input
                              id="project-name"
                              name="name"
                              value={projectDetails.name}
                              onChange={handleProjectDetailsChange}
                              placeholder="my-awesome-website"
                              className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                            />
                            {isProjectError && (
                              <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {errorMsg}
                              </p>
                            )}
                          </div>

                          {/* Database Configuration */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-gray-200 font-medium flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Database Configuration
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={generateDbCredentials}
                                className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Auto Generate
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Database Name */}
                              <div>
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Database className="w-4 h-4" />
                                  Database Name
                                </Label>
                                <Input
                                  name="dbname"
                                  value={projectDetails.dbname}
                                  onChange={handleProjectDetailsChange}
                                  placeholder="my_website_db"
                                  className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                                />
                              </div>

                              {/* Database User */}
                              <div>
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Database User
                                </Label>
                                <Input
                                  name="dbuser"
                                  value={projectDetails.dbuser}
                                  onChange={handleProjectDetailsChange}
                                  placeholder="db_user"
                                  className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                                />
                              </div>

                              {/* Database Password */}
                              <div>
                                <Label className="text-gray-200 font-medium flex items-center gap-2">
                                  <Lock className="w-4 h-4" />
                                  Database Password
                                </Label>
                                <Input
                                  name="dbpass"
                                  type="password"
                                  value={projectDetails.dbpass}
                                  onChange={handleProjectDetailsChange}
                                  placeholder="secure_password"
                                  className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                                />
                              </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-blue-400 font-medium">Database Information</h4>
                                  <p className="text-blue-300/80 text-sm mt-1">
                                    A MySQL database will be automatically created with these credentials. Make sure to save these details as they will be needed for your web builder installation.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            if (!projectDetails.name || !projectDetails.dbname || !projectDetails.dbuser || !projectDetails.dbpass) {
                              toast.error("Please fill all required fields");
                            } else {
                              setStage(2);
                            }
                          }}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/25"
                        >
                          Next: Choose Web Builder
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}

                    {/* Stage 2: Web Builder Selection */}
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
                          <h3 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Web Builder</h3>
                          <p className="text-gray-400">Select the platform that best fits your project needs</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {webBuilders.map((builder, index) => (
                            <motion.div
                              key={builder.name}
                              whileHover={{ scale: 1.02, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative cursor-pointer"
                              onClick={() => setSelectedWebBuilder(builder.name)}
                            >
                              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${selectedWebBuilder === builder.name
                                  ? "border-purple-500 shadow-lg shadow-purple-500/20"
                                  : "border-gray-700 hover:border-purple-500/50"
                                }`}>
                                {selectedWebBuilder === builder.name && (
                                  <div className="absolute top-4 right-4">
                                    <CheckCircle className="w-6 h-6 text-purple-400" />
                                  </div>
                                )}

                                <div className="text-center">
                                  <div className="text-4xl mb-4">{builder.icon}</div>
                                  <h4 className="text-xl font-bold text-gray-100 mb-2">{builder.name}</h4>
                                  <p className="text-gray-400 text-sm mb-4">{builder.description}</p>
                                  
                                  <div className="space-y-2 mb-4">
                                    {builder.features.slice(0, 3).map((feature, featureIndex) => (
                                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                        <span>{feature}</span>
                                      </div>
                                    ))}
                                  </div>

                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      builder.complexity === 'Beginner to Advanced' ? 'bg-green-500/20 text-green-400' :
                                      builder.complexity === 'Intermediate to Advanced' ? 'bg-yellow-500/20 text-yellow-400' :
                                      builder.complexity === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                                      'bg-blue-500/20 text-blue-400'
                                    }`}
                                  >
                                    {builder.complexity}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

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
                              if (selectedWebBuilder === "") {
                                toast.error("Please select a web builder");
                              } else {
                                setStage(3);
                              }
                            }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                          >
                            Next: Select Plan
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 3: Select Plan */}
                    {stage === 3 && (
                      <motion.div
                        key="stage3"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideIn}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Plan</h3>
                          <p className="text-gray-400">Select the perfect plan for your web builder project</p>
                        </div>

                        <RadioGroup value={selectedPlan.name} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {displayPricing.map((plan: any, index) => (
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
                                  cpu: plan.cpu,
                                  ram: plan.ram,
                                  storage: plan.storage,
                                  bandwidth: plan.bandwidth
                                })
                              }
                            >
                              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${selectedPlan.name === plan.name
                                  ? "border-purple-500 shadow-lg shadow-purple-500/20"
                                  : "border-gray-700 hover:border-purple-500/50"
                                }`}>
                                <RadioGroupItem value={plan.name} id={plan.name} className="sr-only" />

                                {selectedPlan.name === plan.name && (
                                  <div className="absolute top-4 right-4">
                                    <CheckCircle className="w-6 h-6 text-purple-400" />
                                  </div>
                                )}

                                <div className="text-center">
                                  <Label htmlFor={plan.name} className="text-xl font-bold text-gray-100 cursor-pointer">
                                    {plan.name}
                                  </Label>
                                  <p className="text-gray-400 mt-2 text-sm">
                                    {plan.name.includes("Starter") && "Perfect for personal websites"}
                                    {plan.name.includes("Pro") && "Ideal for business websites"}
                                    {plan.name.includes("Enterprise") && "For high-traffic websites"}
                                  </p>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm text-gray-300">{plan.cpu}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MemoryStick className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-gray-300">{plan.ram}</span>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4 text-green-400" />
                                    <span className="text-sm text-gray-300">{plan.storage}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-orange-400" />
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
                            onClick={() => setStage(2)}
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
                                setStage(4);
                              }
                            }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                          >
                            Next: Review
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 4: Review & Deploy */}
                    {stage === 4 && (
                      <motion.div
                        key="stage4"
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
                                {selectedWebBuilder}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Project Overview */}
                          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-gray-100 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-purple-400" />
                                Project Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Name:</span>
                                <span className="text-gray-100 font-medium">{projectDetails.name || "Untitled"}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Web Builder:</span>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-purple-400" />
                                  <span className="text-gray-100">{selectedWebBuilder || "Not selected"}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Database:</span>
                                <span className="text-gray-100 text-sm font-mono truncate max-w-32">
                                  {projectDetails.dbname || "Not configured"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">DB User:</span>
                                <span className="text-gray-100 text-sm font-mono">
                                  {projectDetails.dbuser || "Not set"}
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Plan Details */}
                          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-gray-100 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-blue-400" />
                                Selected Plan
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="text-center">
                                <div className="text-xl font-bold text-blue-400 mb-2">
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
                                  <Cpu className="w-4 h-4 text-purple-400" />
                                  <span className="text-gray-300">{selectedPlan.cpu}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MemoryStick className="w-4 h-4 text-blue-400" />
                                  <span className="text-gray-300">{selectedPlan.ram}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                                <Coffee className="w-4 h-4" />
                                <span>Est. setup time: 5-10 minutes</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Database Configuration Review */}
                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-gray-100 flex items-center gap-2">
                              <Database className="w-5 h-5 text-green-400" />
                              Database Configuration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="text-xs text-gray-400">Database Name:</div>
                              <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-green-400">
                                {projectDetails.dbname}
                              </code>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs text-gray-400">Database User:</div>
                              <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-blue-400">
                                {projectDetails.dbuser}
                              </code>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs text-gray-400">Database Password:</div>
                              <code className="block text-sm bg-black/50 p-2 rounded border border-gray-700 text-purple-400">
                                {"*".repeat(projectDetails.dbpass.length)}
                              </code>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Important Notice */}
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                            <div>
                              <h4 className="text-amber-400 font-medium">Important: Save Your Database Credentials</h4>
                              <p className="text-amber-300/80 text-sm mt-1">
                                Please save your database credentials securely. You&apos;ll need them to complete the {selectedWebBuilder} installation after deployment.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between pt-6">
                          <Button
                            variant="outline"
                            onClick={() => setStage(3)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                            Back to Plans
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 px-8 h-12 text-lg font-semibold shadow-lg shadow-purple-500/25"
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

          {/* Web Builder Showcase */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Popular Web Builders
              </h3>
              <p className="text-gray-400">Deploy any web builder with zero configuration</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {webBuilders.map((builder, index) => (
                <motion.div
                  key={builder.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="relative p-4 bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:border-purple-500/40"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl">{builder.icon}</div>
                    <span className="text-sm font-medium text-gray-200">{builder.name}</span>
                    <span className="text-xs text-gray-400">{builder.description.split(' ').slice(0, 2).join(' ')}</span>
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
                  title: "Setup Time",
                  value: "< 10min",
                  description: "Average deployment time",
                  icon: <Rocket className="w-6 h-6 text-purple-400" />,
                  color: "from-purple-500/10 to-blue-500/10",
                  border: "border-purple-500/20"
                },
                {
                  title: "Database",
                  value: "MySQL",
                  description: "Reliable database service",
                  icon: <Database className="w-6 h-6 text-green-400" />,
                  color: "from-green-500/10 to-emerald-500/10",
                  border: "border-green-500/20"
                },
                {
                  title: "SSL",
                  value: "Auto",
                  description: "Free SSL certificates",
                  icon: <Lock className="w-6 h-6 text-blue-400" />,
                  color: "from-blue-500/10 to-cyan-500/10",
                  border: "border-blue-500/20"
                },
                {
                  title: "Support",
                  value: "24/7",
                  description: "Round-the-clock assistance",
                  icon: <Users className="w-6 h-6 text-orange-400" />,
                  color: "from-orange-500/10 to-red-500/10",
                  border: "border-orange-500/20"
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