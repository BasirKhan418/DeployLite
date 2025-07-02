"use client";

declare global {
  interface Window {
    ethereum?: any;
    Razorpay?: any;
  }
}

import { toast, Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ethers } from "ethers";
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

import {
  CreditCardIcon,
  DollarSignIcon,
  SettingsIcon,
  AlertTriangleIcon,
  FileTextIcon,
  RefreshCwIcon,
  WalletIcon,
  TrendingUpIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Loader2,
  Plus,
  Minus,
  Activity,
  Eye,
  EyeOff,
  Download,
  CopyIcon,
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
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import { add as addWallet } from "@/lib/features/wallet/Wallet";
import { add as addUser } from "@/lib/features/user/User";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  amount: number;
  description: string;
  type: 'credit' | 'debit';
  date: string;
  _id?: string;
}

interface WalletData {
  _id: string;
  userid: string;
  balance: number;
  transactions: Transaction[];
}

interface ProjectData {
  _id: string;
  name: string;
  planid: {
    name: string;
    pricephour: string;
    pricepmonth: string;
  };
  projectstatus: string;
  startdate: string;
  cpuusage?: string;
  memoryusage?: string;
}

export default function WalletComponent() {
  const user = useAppSelector((state) => state.user.user);
  const walletState = useAppSelector((state) => state.wallet.wallet);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cryptoConnected, setCryptoConnected] = useState(false);
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [cryptoBalance, setCryptoBalance] = useState("0");
  const [cryptoAmount, setCryptoAmount] = useState("");

  // Check for payment status in URL and show notifications
  useEffect(() => {
    const paymentStatus = searchParams?.get('payment');
    const amount = searchParams?.get('amount');

    if (paymentStatus === 'success' && amount) {
      toast.success(`Payment successful! ₹${amount} added to your wallet.`);
      
      // Clean up URL parameters after showing toast
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('payment');
          url.searchParams.delete('amount');
          url.searchParams.delete('order_id');
          window.history.replaceState({}, '', url.toString());
        }
      }, 1000);
    } else if (paymentStatus === 'failed') {
      toast.error('Payment verification failed. Please try again.');
    } else if (paymentStatus === 'error') {
      toast.error('Payment processing error. Please contact support.');
    }
  }, [searchParams]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      try {
        // Always fetch fresh data when component mounts
        await Promise.all([
          fetchUserAndWalletData(),
          fetchProjects()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch user and wallet data
  const fetchUserAndWalletData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/get/home', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Home API Response:', data);
      
      if (data.success && data.user && data.wallet) {
        // Update Redux store with fresh data
        dispatch(addUser(data.user));
        dispatch(addWallet(data.wallet));
        setWalletData(data.wallet);
        
        console.log('Wallet data updated:', data.wallet);
      } else {
        console.error('Failed to fetch user/wallet data:', data);
        if (!data.success) {
          // Only redirect to login if we're sure auth failed
          toast.error('Session expired. Please login again.');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user/wallet data:', error);
      toast.error('Error loading data. Please refresh the page.');
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch projects for analytics
  const fetchProjects = async () => {
    try {
      const [regularProjects, webbuilderProjects] = await Promise.all([
        fetch('/api/project/crud', { credentials: 'include' }),
        fetch('/api/project/wordpress', { credentials: 'include' })
      ]);

      const regularData = await regularProjects.json();
      const webbuilderData = await webbuilderProjects.json();

      const allProjects = [
        ...(regularData.success ? regularData.projectdata : []),
        ...(webbuilderData.success ? webbuilderData.projectdata : [])
      ];

      setProjects(allProjects);
      console.log('Projects fetched:', allProjects.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Load Razorpay script
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

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!addFundsAmount || Number(addFundsAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!user?.email) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const amount = Number(addFundsAmount);
      console.log('Initiating payment for amount:', amount);
      
      const data = { amount, email: user.email, name: user.name };

      const response = await fetch('/api/precheckout', {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Precheckout response:', result);

      if (result.success) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Razorpay SDK failed to load.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_KEY_ID,
          amount: result.order.amount,
          currency: "INR",
          name: "DeployLite",
          description: "Add funds to DeployLite Wallet",
          image: "/logo.png",
          order_id: result.order.id,
          callback_url: `${window.location.origin}/api/postcheckout`,
          prefill: { name: user.name, email: user.email },
          notes: { address: "DeployLite Corporate Office" },
          theme: { color: "#8B5CF6" },
          handler: function (response: any) {
            console.log('Payment successful:', response);
            toast.success("Payment successful! Your wallet will be updated shortly.");
            setAddFundsAmount("");
            
            // Fetch updated wallet data after successful payment
            setTimeout(() => {
              fetchUserAndWalletData();
            }, 2000);
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal dismissed');
              toast.info("Payment cancelled");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(result.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
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
      
      toast.success("MetaMask wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect MetaMask wallet");
    }
  };

  const handleSendCryptoPayment = async () => {
    if (!cryptoConnected) {
      toast.error("Connect your MetaMask wallet first!");
      return;
    }

    if (!cryptoAmount || Number(cryptoAmount) <= 0) {
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
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed!");
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    await Promise.all([
      fetchUserAndWalletData(),
      fetchProjects()
    ]);
    toast.success("Data refreshed successfully!");
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!walletData || !projects) return null;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = walletData.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const monthlySpent = monthlyTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyAdded = monthlyTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const activeProjects = projects.filter(p => p.projectstatus === 'live').length;
    
    const estimatedMonthlyCost = projects.reduce((sum, project) => {
      if (project.planid?.pricepmonth) {
        return sum + Number(project.planid.pricepmonth);
      }
      return sum;
    }, 0);

    return {
      monthlySpent,
      monthlyAdded,
      activeProjects,
      estimatedMonthlyCost,
      totalProjects: projects.length
    };
  };

  // Generate chart data
  const generateChartData = () => {
    if (!walletData) return null;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailySpend = last7Days.map(date => {
      const dayTransactions = walletData.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return (
          txDate.toDateString() === date.toDateString() &&
          tx.type === 'debit'
        );
      });
      return dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    });

    return {
      labels: last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Daily Spend (₹)',
          data: dailySpend,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const stats = calculateStats();
  const chartData = generateChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: { color: '#E5E7EB' }
      },
      title: { 
        display: true, 
        text: "Daily Spending Pattern",
        color: '#E5E7EB'
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(139, 92, 246, 0.2)" },
        ticks: { color: '#E5E7EB' }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(139, 92, 246, 0.2)" },
        ticks: { color: '#E5E7EB' }
      },
    },
  };

  // Show loading screen while initial data is being fetched
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-4 md:p-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Wallet
              </h1>
              <p className="text-gray-400 mt-2">Manage your DeployLite balance and transactions</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCwIcon className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 shadow-2xl">
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl">
                    <WalletIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2 text-gray-100">
                      DeployLite Balance
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Available funds for deployments and services
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <p className="text-5xl font-bold text-purple-400">
                    {balanceVisible ? `₹${walletData?.balance || 0}` : '₹****'}
                  </p>
                  <p className="text-gray-400 mt-2">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Spent</p>
                    <p className="text-2xl font-bold text-red-400">₹{stats.monthlySpent}</p>
                  </div>
                  <ArrowDownIcon className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Added</p>
                    <p className="text-2xl font-bold text-green-400">₹{stats.monthlyAdded}</p>
                  </div>
                  <ArrowUpIcon className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.activeProjects}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Est. Monthly Cost</p>
                    <p className="text-2xl font-bold text-orange-400">₹{stats.estimatedMonthlyCost}</p>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Funds Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          <Card className="lg:col-span-2 bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Add Funds
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add money to your DeployLite wallet for deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddFundsAmount(amount.toString())}
                      className="border-purple-500/30 hover:bg-purple-500/10"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter amount"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="bg-black/50 border-gray-700 text-white"
                    type="number"
                    min="1"
                  />
                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={loading || !addFundsAmount}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 min-w-[120px]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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

          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-gray-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-purple-500/30 hover:bg-purple-500/10"
                onClick={() => router.push('/settings')}
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-500/30 hover:bg-purple-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Statement
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-500/30 hover:bg-purple-500/10"
              >
                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                Usage Alerts
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid grid-cols-4 bg-gradient-to-r from-gray-900/50 to-black/50 border border-purple-500/20">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-500/20">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20">
                Projects
              </TabsTrigger>
              <TabsTrigger value="crypto" className="data-[state=active]:bg-purple-500/20">
                Crypto
              </TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100">Transaction History</CardTitle>
                  <CardDescription className="text-gray-400">
                    All your wallet transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {walletData?.transactions && walletData.transactions.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {walletData.transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((tx, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              tx.type === 'credit' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.type === 'credit' ? 
                                <ArrowUpIcon className="w-4 h-4" /> : 
                                <ArrowDownIcon className="w-4 h-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-gray-200">{tx.description}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(tx.date).toLocaleDateString()} at{' '}
                                {new Date(tx.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No transactions found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100">Spending Analytics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your spending patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData ? (
                    <div className="h-80">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-400">No data available for chart</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100">Project Costs</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly costs for your active projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                          <div>
                            <p className="font-medium text-gray-200">{project.name}</p>
                            <p className="text-sm text-gray-400">
                              {project.planid?.name || 'Unknown Plan'} • Status: {project.projectstatus}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-400">
                              ₹{project.planid?.pricepmonth || 0}/month
                            </p>
                            <p className="text-sm text-gray-400">
                              ₹{project.planid?.pricephour || 0}/hour
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No projects found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Crypto Tab */}
            <TabsContent value="crypto">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <WalletIcon className="w-5 h-5 text-purple-400" />
                    Crypto Wallet
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect your MetaMask wallet for crypto payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cryptoConnected ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 font-medium">Wallet Connected</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Address:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-200">
                                {cryptoWalletAddress.slice(0, 6)}...{cryptoWalletAddress.slice(-4)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(cryptoWalletAddress);
                                  toast.success("Address copied to clipboard");
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <CopyIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Balance:</span>
                            <span className="text-purple-400 font-medium">
                              {Number(cryptoBalance).toFixed(4)} ETH
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="cryptoAmount" className="text-gray-200">
                          Payment Amount (ETH)
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="cryptoAmount"
                            placeholder="0.001"
                            value={cryptoAmount}
                            onChange={(e) => setCryptoAmount(e.target.value)}
                            className="bg-black/50 border-gray-700 text-white"
                            type="number"
                            step="0.001"
                            min="0"
                          />
                          <Button
                            onClick={handleSendCryptoPayment}
                            disabled={!cryptoAmount || Number(cryptoAmount) <= 0}
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 min-w-[100px]"
                          >
                            Send ETH
                          </Button>
                        </div>
                        {cryptoAmount && Number(cryptoAmount) > 0 && (
                          <p className="text-sm text-gray-400">
                            ≈ ₹{(Number(cryptoAmount) * 150000).toFixed(2)} INR
                          </p>
                        )}
                      </div>

                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangleIcon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-amber-400 font-medium">Important Notice</h4>
                            <p className="text-amber-300/80 text-sm mt-1">
                              Crypto payments are sent directly to our wallet address. 
                              Please ensure you're sending from a compatible wallet and network.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-8">
                        <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-200 mb-2">
                          Connect MetaMask Wallet
                        </h3>
                        <p className="text-gray-400 mb-6">
                          Connect your MetaMask wallet to make crypto payments for DeployLite services
                        </p>
                        <Button
                          onClick={handleConnectCryptoWallet}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <WalletIcon className="w-4 h-4 mr-2" />
                          Connect MetaMask
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}