"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Server,
  Shield,
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

// Database types configuration
const databaseTypes = [
  {
    name: 'MySQL',
    description: 'Popular relational database',
    icon: '🗄️',
    defaultPort: '3306',
    features: ['ACID Compliance', 'Full-text Search', 'Replication', 'High Performance'],
    complexity: 'Beginner to Advanced',
    useCase: 'Web applications, E-commerce'
  },
  {
    name: 'PostgreSQL',
    description: 'Advanced open-source database',
    icon: '🐘',
    defaultPort: '5432',
    features: ['ACID Compliance', 'JSON Support', 'Full-text Search', 'Advanced Types'],
    complexity: 'Intermediate to Advanced',
    useCase: 'Analytics, Complex queries'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL document database',
    icon: '🍃',
    defaultPort: '27017',
    features: ['Document Store', 'Flexible Schema', 'Horizontal Scaling', 'Rich Queries'],
    complexity: 'Beginner to Advanced',
    useCase: 'Content management, IoT'
  },
  {
    name: 'Redis',
    description: 'In-memory data structure store',
    icon: '🔴',
    defaultPort: '6379',
    features: ['In-Memory', 'Pub/Sub', 'Caching', 'Real-time Analytics'],
    complexity: 'Intermediate',
    useCase: 'Caching, Session store'
  },
  {
    name: 'Qdrant',
    description: 'Vector similarity search engine',
    icon: '🔍',
    defaultPort: '6333',
    features: ['Vector Search', 'Machine Learning', 'Real-time', 'Scalable'],
    complexity: 'Advanced',
    useCase: 'AI/ML, Semantic search'
  },
];

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

interface CreateDatabaseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDatabaseCreated?: () => void;
}

export default function CreateDatabase({ open, setOpen, onDatabaseCreated }: CreateDatabaseProps) {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const [stage, setStage] = useState(1);
  const [databaseDetails, setDatabaseDetails] = useState({
    dbname: "",
    dbuser: "",
    dbpass: "",
    dbport: "",
    dbtype: "",
  });

  const [selectedDbType, setSelectedDbType] = useState("");
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

  const [isDatabaseError, setDatabaseError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDatabaseDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatabaseError(false);
    const { name, value } = e.target;
    setDatabaseDetails({ ...databaseDetails, [name]: value });
  };

  // Fetch pricing plans for database
  const fetchPricingPlans = async () => {
    try {
      const res = await fetch(`/api/project/getplans`);
      const data = await res.json();
      if (data.success) {
        setPricingPlans(data.data);
        // Filter for database plans
        const databasePlans = data.data.filter((item: PricingPlan) => item.pcategory === "database");
        setDisplayPricing(databasePlans);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      toast.error('Failed to fetch pricing plans');
    }
  };

  useEffect(() => {
    if (open) {
      fetchPricingPlans();
      // Reset form when modal opens
      setStage(1);
      setDatabaseDetails({
        dbname: "",
        dbuser: "",
        dbpass: "",
        dbport: "",
        dbtype: "",
      });
      setSelectedDbType("");
      setSelectedPlan({
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
    }
  }, [open]);

  // Auto-fill database details based on selected type
  const handleDbTypeSelect = (dbType: string) => {
    setSelectedDbType(dbType);
    const selectedType = databaseTypes.find(type => type.name.toLowerCase() === dbType.toLowerCase());
    
    if (selectedType) {
      setDatabaseDetails(prev => ({
        ...prev,
        dbtype: dbType.toLowerCase(),
        dbport: selectedType.defaultPort
      }));
    }

    // Filter plans based on selected database type
    const filteredPlans = pricingPlans.filter((plan: PricingPlan) => 
      plan.pcategory === "database" && 
      plan.name.toLowerCase().includes(dbType.toLowerCase())
    );
    setDisplayPricing(filteredPlans);

    // Auto-select first plan if available
    if (filteredPlans.length > 0) {
      const firstPlan = filteredPlans[0];
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
  };

  // Generate secure database credentials
  const generateDbCredentials = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const dbName = `db_${timestamp}_${randomStr}`;
    const dbUser = `user_${randomStr}`;
    const dbPass = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + Math.floor(Math.random() * 100);
    
    setDatabaseDetails(prev => ({
      ...prev,
      dbname: dbName,
      dbuser: dbUser,
      dbpass: dbPass
    }));
  };

  // Validate database details
  const validateDatabaseDetails = () => {
    if (!databaseDetails.dbname) return "Database name is required";
    if (!databaseDetails.dbuser) return "Database user is required";
    if (!databaseDetails.dbpass) return "Database password is required";
    if (!databaseDetails.dbport) return "Database port is required";
    if (!databaseDetails.dbtype) return "Database type is required";
    if (databaseDetails.dbname.length < 3) return "Database name must be at least 3 characters";
    if (databaseDetails.dbuser.length < 3) return "Database user must be at least 3 characters";
    if (databaseDetails.dbpass.length < 8) return "Database password must be at least 8 characters";
    return null;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const detailsError = validateDatabaseDetails();
    if (detailsError) {
      setDatabaseError(true);
      setErrorMsg(detailsError);
      toast.error(detailsError);
      setStage(1);
      return;
    }

    if (!selectedDbType) {
      toast.error("Please select a database type");
      setStage(2);
      return;
    }

    if (!selectedPlan.id) {
      toast.error("Please select a pricing plan");
      setStage(3);
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        dbname: databaseDetails.dbname.trim(),
        dbuser: databaseDetails.dbuser.trim(),
        dbpass: databaseDetails.dbpass,
        dbport: databaseDetails.dbport,
        dbtype: databaseDetails.dbtype.toLowerCase(),
        planid: selectedPlan.id,
      };

      console.log('Submitting database data:', submissionData);

      const createDatabase = await fetch("/api/project/database", {
        headers: { 
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createDatabase.json();
      console.log('API Response:', res);
      
      setLoading(false);
 
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
        // Call callback to refresh database list
        if (onDatabaseCreated) {
          onDatabaseCreated();
        }
        // Small delay then redirect to overview
        setTimeout(() => {
          router.push(`/project/overview?id=${res.project._id}&type=database`);
        }, 1000);
      } else {
        if (res.message.includes("already exists")) {
          setStage(1);
          setDatabaseError(true);
          setErrorMsg(res.message);
        }
        toast.error(res.message || 'Failed to create database');
        console.error('Database creation failed:', res);
      }
    } catch (err: any) {
      console.error('Error creating database:', err);
      toast.error(err.message || 'Failed to create database');
      setLoading(false);
    }
  };

  const getDbTypeIcon = (type: string) => {
    return databaseTypes.find(db => db.name.toLowerCase() === type.toLowerCase())?.icon || '🗄️';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 text-white">
        <Toaster position="top-right" />
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-400" />
            Create Database
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Deploy and manage your database with ease
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-6"
        >
          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
              {[
                { num: 1, title: "Database Setup", icon: Settings },
                { num: 2, title: "Database Type", icon: Database },
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

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Stage 1: Database Setup */}
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
                    {/* Database Configuration */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-200 font-medium flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Database Configuration
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateDbCredentials}
                          className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Auto Generate
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Database Name */}
                        <div>
                          <Label className="text-gray-200 font-medium flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Database Name *
                          </Label>
                          <Input
                            name="dbname"
                            value={databaseDetails.dbname}
                            onChange={handleDatabaseDetailsChange}
                            placeholder="my_database"
                            className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                            required
                          />
                        </div>

                        {/* Database User */}
                        <div>
                          <Label className="text-gray-200 font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Database User *
                          </Label>
                          <Input
                            name="dbuser"
                            value={databaseDetails.dbuser}
                            onChange={handleDatabaseDetailsChange}
                            placeholder="db_user"
                            className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                            required
                          />
                        </div>

                        {/* Database Password */}
                        <div>
                          <Label className="text-gray-200 font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Database Password *
                          </Label>
                          <Input
                            name="dbpass"
                            type="password"
                            value={databaseDetails.dbpass}
                            onChange={handleDatabaseDetailsChange}
                            placeholder="secure_password123"
                            className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                            required
                          />
                        </div>

                        {/* Database Port */}
                        <div>
                          <Label className="text-gray-200 font-medium flex items-center gap-2">
                            <Server className="w-4 h-4" />
                            Database Port *
                          </Label>
                          <Input
                            name="dbport"
                            value={databaseDetails.dbport}
                            onChange={handleDatabaseDetailsChange}
                            placeholder="3306"
                            className="mt-2 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                            required
                          />
                        </div>
                      </div>

                      {isDatabaseError && (
                        <div className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errorMsg}
                        </div>
                      )}

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-blue-400 font-medium">Database Information</h4>
                            <p className="text-blue-300/80 text-sm mt-1">
                              These credentials will be used to create and access your database instance. Make sure to save them securely.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      const detailsError = validateDatabaseDetails();
                      if (detailsError) {
                        setDatabaseError(true);
                        setErrorMsg(detailsError);
                        toast.error(detailsError);
                        return;
                      }
                      setStage(2);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/25"
                  >
                    Next: Choose Database Type
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Stage 2: Database Type Selection */}
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
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Database Type</h3>
                    <p className="text-gray-400">Select the database that best fits your application needs</p>
                  </div>

                  <RadioGroup value={selectedDbType} onValueChange={handleDbTypeSelect} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {databaseTypes.map((database, index) => (
                      <motion.div
                        key={database.name}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative cursor-pointer"
                      >
                        <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${selectedDbType === database.name
                            ? "border-purple-500 shadow-lg shadow-purple-500/20"
                            : "border-gray-700 hover:border-purple-500/50"
                          }`}>
                          <RadioGroupItem value={database.name} id={database.name} className="sr-only" />

                          {selectedDbType === database.name && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle className="w-6 h-6 text-purple-400" />
                            </div>
                          )}

                          <Label htmlFor={database.name} className="cursor-pointer">
                            <div className="text-center">
                              <div className="text-4xl mb-4">{database.icon}</div>
                              <h4 className="text-xl font-bold text-gray-100 mb-2">{database.name}</h4>
                              <p className="text-gray-400 text-sm mb-4">{database.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                {database.features.slice(0, 3).map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="text-xs text-gray-400 mb-2">
                                Default Port: {database.defaultPort}
                              </div>

                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  database.complexity === 'Beginner to Advanced' ? 'bg-green-500/20 text-green-400' :
                                  database.complexity === 'Intermediate to Advanced' ? 'bg-yellow-500/20 text-yellow-400' :
                                  database.complexity === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {database.complexity}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>

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
                        if (!selectedDbType) {
                          toast.error("Please select a database type");
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
                    <p className="text-gray-400">Select the perfect plan for your {selectedDbType} database</p>
                  </div>

                  {displayPricing.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading pricing plans for {selectedDbType}...</p>
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
                              ? "border-purple-500 shadow-lg shadow-purple-500/20"
                              : "border-gray-700 hover:border-purple-500/50"
                            }`}>
                            <RadioGroupItem value={plan.name} id={plan.name} className="sr-only" />

                            {selectedPlan.name === plan.name && (
                              <div className="absolute top-4 right-4">
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                              </div>
                            )}

                            <Label htmlFor={plan.name} className="cursor-pointer">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-100 mb-2">
                                  {plan.name}
                                </div>
                                <p className="text-gray-400 mt-2 text-sm">
                                  {plan.name.includes("Starter") && `Perfect for ${selectedDbType} development`}
                                  {plan.name.includes("Pro") && `Ideal for ${selectedDbType} production`}
                                  {plan.name.includes("Enterprise") && `${selectedDbType} at scale`}
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
                                {plan.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                                  <div key={featureIndex} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{feature}</span>
                                  </div>
                                ))}
                                {plan.features.length > 4 && (
                                  <div className="text-xs text-gray-400">
                                    +{plan.features.length - 4} more features
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
                      onClick={() => setStage(2)}
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
                        <div className="text-lg font-bold text-white flex items-center gap-2">
                          {getDbTypeIcon(selectedDbType)}
                          {selectedDbType}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Database Configuration Review */}
                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-gray-100 flex items-center gap-2">
                          <Database className="w-5 h-5 text-purple-400" />
                          Database Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-gray-100 font-medium flex items-center gap-2">
                            {getDbTypeIcon(selectedDbType)}
                            {selectedDbType}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Database:</span>
                          <span className="text-gray-100 font-medium text-sm truncate max-w-32">
                            {databaseDetails.dbname}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">User:</span>
                          <span className="text-gray-100 text-sm font-mono">
                            {databaseDetails.dbuser}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Port:</span>
                          <span className="text-gray-100 text-sm font-mono">
                            {databaseDetails.dbport}
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
                            {selectedPlan.name}
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
                          <span>Est. setup time: 3-5 minutes</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="text-amber-400 font-medium">Important: Database Deployment</h4>
                        <p className="text-amber-300/80 text-sm mt-1">
                          Your {selectedDbType} database will be deployed on a secure container. The deployment process may take a few minutes. You'll be redirected to the overview page once deployment starts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStage(3)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                      Back to Plans
                    </Button>
                    <Button
                      type="submit"
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
                          Deploy Database
                          <Rocket className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}