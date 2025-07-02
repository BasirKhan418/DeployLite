"use client";

declare global {
  interface Window {
    ethereum?: any;
    Razorpay?: any;
  }
}

import { toast, Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import {
  CreditCardIcon,
  DollarSignIcon,
  SettingsIcon,
  AlertTriangleIcon,
  FileTextIcon,
  RefreshCwIcon,
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Users,
  Target,
  Zap,
  Loader2,
  Download,
  Eye,
  EyeOff,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  ExternalLink,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import { add as addWallet } from "@/lib/features/wallet/Wallet";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
};

interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  type: "credit" | "debit";
  date: string;
  category?: string;
  status?: string;
}

interface WalletData {
  userid: string;
  balance: number;
  transactions: Transaction[];
}

interface ProjectData {
  name: string;
  planid: {
    name: string;
    pricepmonth: string;
    pricephour: string;
  };
  projectstatus: string;
  startdate: string;
}

export default function Wallet() {
  const user = useAppSelector((state) => state.user.user);
  const walletStore = useAppSelector((state) => state.wallet.wallet);
  const dispatch = useAppDispatch();
  
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [cryptoConnected, setCryptoConnected] = useState(false);
  const [cryptoBalance, setCryptoBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    avgPerDay: 0,
    estimatedMonthly: 0,
    activeProjects: 0,
    lastTransaction: null as Transaction | null
  });

  const router = useRouter();

  // Fetch wallet data and projects
  const fetchWalletData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch wallet data
      const walletRes = await fetch('/api/get/home');
      const walletData = await walletRes.json();
      
      if (walletData.success && walletData.wallet) {
        setWallet(walletData.wallet);
        dispatch(addWallet(walletData.wallet));
      }

      // Fetch projects data
      const projectsRes = await fetch('/api/project/crud');
      const projectsData = await projectsRes.json();
      
      if (projectsData.success && projectsData.projectdata) {
        setProjects(projectsData.projectdata);
      }

      // Calculate stats
      calculateStats(walletData.wallet, projectsData.projectdata || []);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics
  const calculateStats = (walletData: WalletData, projectsData: ProjectData[]) => {
    if (!walletData?.transactions) return;

    const transactions = walletData.transactions;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate monthly spending
    const thisMonthSpending = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'debit' && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate total spending
    const totalSpent = transactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate daily average
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const avgPerDay = thisMonthSpending / now.getDate();

    // Estimate monthly cost based on active projects
    const activeProjects = projectsData.filter(p => p.projectstatus === 'live').length;
    const estimatedMonthly = projectsData
      .filter(p => p.projectstatus === 'live')
      .reduce((sum, p) => {
        const monthlyPrice = parseFloat(p.planid?.pricepmonth || '0');
        return sum + monthlyPrice;
      }, 0);

    // Get last transaction
    const lastTransaction = transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0] || null;

    setStats({
      totalSpent,
      thisMonth: thisMonthSpending,
      avgPerDay,
      estimatedMonthly,
      activeProjects,
      lastTransaction
    });
  };

  useEffect(() => {
    if (user?.email) {
      fetchWalletData();
    }
  }, [user]);

  // Generate chart data
  const generateChartData = () => {
    if (!wallet?.transactions) return { labels: [], datasets: [] };

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dailySpending = last7Days.map(date => {
      const daySpending = wallet.transactions
        .filter(tx => {
          const txDate = new Date(tx.date);
          return tx.type === 'debit' && 
                 txDate.toDateString() === date.toDateString();
        })
        .reduce((sum, tx) => sum + tx.amount, 0);
      return daySpending;
    });

    return {
      labels: last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Daily Spending (₹)',
          data: dailySpending,
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Generate spending categories chart
  const generateCategoriesChart = () => {
    if (!wallet?.transactions) return { labels: [], datasets: [] };

    const categories = wallet.transactions
      .filter(tx => tx.type === 'debit')
      .reduce((acc, tx) => {
        const category = tx.category || 'Other';
        acc[category] = (acc[category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  // Razorpay payment handler
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!addFundsAmount || parseFloat(addFundsAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    const amount = parseFloat(addFundsAmount);
    const data = { amount, email: user.email, name: user.name };

    try {
      const response = await fetch(`/api/precheckout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const r = await response.json();
      setLoading(false);

      if (r.success) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Razorpay SDK failed to load.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_KEY_ID,
          amount: r.order.amount,
          currency: "INR",
          name: "DeployLite",
          description: "Add funds to DeployLite Wallet",
          image: "/logo.png",
          order_id: r.order.id,
          callback_url: `/api/postcheckout`,
          prefill: { name: user.name, email: user.email },
          notes: { address: "DeployLite Platform" },
          theme: { color: "#9333ea" },
          handler: function(response: any) {
            toast.success("Payment successful! Funds added to wallet.");
            setAddFundsAmount("");
            fetchWalletData();
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        toast.error("Error in Payment");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed");
    }
  };

  // Crypto wallet functions
  const handleConnectCryptoWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0] || "";
      setCryptoWalletAddress(account);
      setCryptoConnected(true);

      const balanceWei = await provider.getBalance(account);
      const balanceEth = ethers.formatEther(balanceWei);
      setCryptoBalance(balanceEth);
      toast.success("MetaMask connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect MetaMask");
    }
  };

  const handleSendCryptoPayment = async () => {
    if (!cryptoConnected) {
      toast.error("Connect your MetaMask wallet first!");
      return;
    }

    if (!cryptoAmount || isNaN(Number(cryptoAmount)) || Number(cryptoAmount) <= 0) {
      toast.error("Enter a valid ETH amount!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0xeDe6eC29Fb53e32310e0960D35099aE9428700ff",
        value: ethers.parseEther(cryptoAmount),
      });

      toast.success("Transaction sent! Waiting for confirmation...");
      await tx.wait();
      toast.success(`Transaction confirmed! Hash: ${tx.hash}`);
      setCryptoAmount("");
      
      // Refresh wallet data
      fetchWalletData();
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(147, 51, 234, 0.1)' },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(147, 51, 234, 0.1)' },
        ticks: { color: '#9ca3af' },
        beginAtZero: true,
      },
    },
  };

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
        variants={stagger}
        className="max-w-7xl mx-auto p-6"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                <WalletIcon className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Wallet
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your DeployLite balance and transactions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchWalletData}
                disabled={refreshing}
                variant="outline"
                className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
              >
                <RefreshCwIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Balance Card */}
        <motion.div variants={fadeIn} className="mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Available Balance</p>
                  <div className="flex items-center gap-3 mt-2">
                    {balanceVisible ? (
                      <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ₹{wallet?.balance?.toLocaleString() || '0'}
                      </h2>
                    ) : (
                      <h2 className="text-5xl font-bold text-gray-400">••••••</h2>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="text-gray-400 hover:text-purple-400"
                    >
                      {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Activity className="w-4 h-4" />
                    Last updated: {wallet ? formatTime(new Date().toISOString()) : '--:--'}
                  </div>
                  {stats.lastTransaction && (
                    <div className={`flex items-center gap-2 text-sm ${
                      stats.lastTransaction.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stats.lastTransaction.type === 'credit' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                      Last: ₹{stats.lastTransaction.amount}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { 
                    label: "This Month", 
                    value: `₹${stats.thisMonth.toLocaleString()}`, 
                    icon: Calendar, 
                    color: "text-purple-400",
                    change: stats.thisMonth > 0 ? "spending" : "no activity"
                  },
                  { 
                    label: "Daily Average", 
                    value: `₹${Math.round(stats.avgPerDay).toLocaleString()}`, 
                    icon: TrendingUp, 
                    color: "text-blue-400",
                    change: "per day"
                  },
                  { 
                    label: "Active Projects", 
                    value: stats.activeProjects.toString(), 
                    icon: Zap, 
                    color: "text-emerald-400",
                    change: "running"
                  },
                  { 
                    label: "Est. Monthly", 
                    value: `₹${Math.round(stats.estimatedMonthly).toLocaleString()}`, 
                    icon: Target, 
                    color: "text-orange-400",
                    change: "projects cost"
                  },
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-black/30 border border-gray-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-gray-300 text-sm font-medium">{stat.label}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-100">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Funds Section */}
        <motion.div variants={fadeIn} className="mb-8">
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-purple-400" />
                Add Funds
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add money to your DeployLite wallet using Razorpay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="amount" className="text-gray-300 mb-2 block">
                    Amount (INR)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={loading || !addFundsAmount}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Add Funds
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={fadeIn}>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-4 mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-1">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="crypto" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300">
                Crypto
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300">
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wallet?.transactions && wallet.transactions.length > 0 ? (
                    <div className="space-y-3">
                      {wallet.transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((tx, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-black/30 border border-gray-700/30 hover:border-purple-500/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${
                                tx.type === 'credit' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {tx.type === 'credit' ? (
                                  <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                  <ArrowDownLeft className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-200">{tx.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(tx.date)}
                                  <Clock className="w-3 h-3 ml-2" />
                                  {formatTime(tx.date)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-lg ${
                                tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                              </p>
                              <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                {tx.type === 'credit' ? 'Credit' : 'Debit'}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No transactions found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Chart */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <LineChart className="w-5 h-5 text-purple-400" />
                      Daily Spending Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Line data={generateChartData()} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Categories Chart */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      Spending Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      {generateCategoriesChart().labels.length > 0 ? (
                        <Doughnut 
                          data={generateCategoriesChart()} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: { color: '#9ca3af' }
                              }
                            }
                          }} 
                        />
                      ) : (
                        <div className="text-center">
                          <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No spending data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Statistics */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Monthly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        ₹{stats.thisMonth.toLocaleString()}
                      </div>
                      <p className="text-gray-300 text-sm">This Month</p>
                      <p className="text-gray-500 text-xs mt-1">Total spent</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        ₹{Math.round(stats.avgPerDay).toLocaleString()}
                      </div>
                      <p className="text-gray-300 text-sm">Daily Average</p>
                      <p className="text-gray-500 text-xs mt-1">Per day spending</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">
                        {stats.activeProjects}
                      </div>
                      <p className="text-gray-300 text-sm">Active Projects</p>
                      <p className="text-gray-500 text-xs mt-1">Running services</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10">
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        ₹{Math.round(stats.estimatedMonthly).toLocaleString()}
                      </div>
                      <p className="text-gray-300 text-sm">Estimated Cost</p>
                      <p className="text-gray-500 text-xs mt-1">Monthly projection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-6">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <WalletIcon className="w-5 h-5 text-purple-400" />
                    Crypto Payments
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Pay with Ethereum using MetaMask
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cryptoConnected ? (
                    <>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-emerald-400 font-medium">Wallet Connected</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          Address: <code className="text-xs bg-black/30 px-2 py-1 rounded">{cryptoWalletAddress.slice(0, 6)}...{cryptoWalletAddress.slice(-4)}</code>
                        </p>
                        <p className="text-sm text-gray-300">
                          Balance: <span className="text-emerald-400 font-medium">{Number(cryptoBalance).toFixed(6)} ETH</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cryptoAmount" className="text-gray-300 mb-2 block">
                            Amount (ETH)
                          </Label>
                          <Input
                            id="cryptoAmount"
                            type="number"
                            step="0.0001"
                            placeholder="0.01"
                            value={cryptoAmount}
                            onChange={(e) => setCryptoAmount(e.target.value)}
                            className="bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500/50"
                          />
                          {cryptoAmount && (
                            <p className="text-xs text-gray-400 mt-1">
                              ≈ ₹{(parseFloat(cryptoAmount) * 150000).toLocaleString()} INR
                            </p>
                          )}
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={handleSendCryptoPayment}
                            disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0}
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Send Payment
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Connect MetaMask</h3>
                      <p className="text-gray-400 mb-6">Connect your MetaMask wallet to pay with Ethereum</p>
                      <Button
                        onClick={handleConnectCryptoWallet}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8"
                      >
                        <WalletIcon className="w-4 h-4 mr-2" />
                        Connect MetaMask
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Project Costs
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Billing information for your active projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-black/30 border border-gray-700/30 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              project.projectstatus === 'live' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : project.projectstatus === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-200">{project.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                  {project.planid?.name || 'Unknown Plan'}
                                </Badge>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  project.projectstatus === 'live' 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : project.projectstatus === 'failed'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {project.projectstatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-200">
                              ₹{project.planid?.pricepmonth || '0'}/month
                            </p>
                            <p className="text-sm text-gray-400">
                              ₹{project.planid?.pricephour || '0'}/hour
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Total Cost Summary */}
                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-400 font-medium">Total Estimated Monthly Cost</p>
                            <p className="text-gray-400 text-sm">Based on active projects</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                              ₹{Math.round(stats.estimatedMonthly).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">per month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No projects found</p>
                      <Button
                        onClick={() => router.push('/project')}
                        className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                      >
                        Create Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div variants={fadeIn} className="mt-8">
          <Card className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push('/project')}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-blue-500/20 text-left transition-all duration-300"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">Create Project</div>
                      <div className="text-sm text-gray-400">Deploy new services</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push('/settings')}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <SettingsIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">Account Settings</div>
                      <div className="text-sm text-gray-400">Manage your account</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={fetchWalletData}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300"
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                      <RefreshCwIcon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">Refresh Data</div>
                      <div className="text-sm text-gray-400">Update wallet balance</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}