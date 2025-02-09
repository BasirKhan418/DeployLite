"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "@/lib/hook";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ImprovedPlatformWallet() {
  const user = useAppSelector((state) => state.user.user);
  const wallet = useAppSelector((state) => state.wallet.wallet);

  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [cryptoConnected, setCryptoConnected] = useState(false);
  const [cryptoBalance, setCryptoBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Platform Usage",
      amount: 50,
      date: "2023-09-15",
      time: "14:30",
    },
    {
      id: 2,
      type: "Add Funds",
      amount: 100,
      date: "2023-09-14",
      time: "09:15",
    },
    {
      id: 3,
      type: "Service Upgrade",
      amount: 80,
      date: "2023-09-13",
      time: "18:45",
    },
  ]);

  const router = useRouter();

  const midnightIST = new Date();
  midnightIST.setHours(24, 0, 0, 0);
  const date = midnightIST.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  async function handleConnectCryptoWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0] || "";
      setCryptoWalletAddress(account);
      setCryptoConnected(true);

      const signer = await provider.getSigner();
      const balanceWei = await provider.getBalance(account);
      const balanceEth = ethers.formatEther(balanceWei);
      setCryptoBalance(balanceEth);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSendCryptoPayment() {
    if (!cryptoConnected) {
      toast.error("Connect your MetaMask wallet first!");
      return;
    }

    if (
      !cryptoAmount ||
      isNaN(Number(cryptoAmount)) ||
      Number(cryptoAmount) <= 0
    ) {
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

      // Convert ETH to INR for transaction history
      const convertedINR = getConvertedAmountInINR(Number(cryptoAmount));
      const newTx = {
        id: Date.now(),
        type: "Crypto Payment",
        amount: convertedINR,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setTransactions((prev) => [newTx, ...prev]);

      setCryptoAmount("");
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed! Check console for details.");
    }
  }

  function getConvertedAmountInINR(cryptoValue: number) {
    const conversionRate = 150000;
    return cryptoValue * conversionRate;
  }

  function handleDepositCrypto() {
    if (!cryptoAmount) return;

    const ethValue = Number.parseFloat(cryptoAmount);
    const convertedINR = getConvertedAmountInINR(ethValue);

    const newTx = {
      id: Date.now(),
      type: "Crypto Deposit",
      amount: convertedINR,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    setCryptoAmount("");
    alert(
      `Deposited ${cryptoAmount} ETH (~₹${convertedINR.toFixed(2)}) to your DeployLite balance!`
    );
  }

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

  const handleRazorpayPayment = async (e) => {
    setLoading(true);

    var amount =
      addFundsAmount || Number(prompt("Enter the amount to add funds"));

    const data = { amount, email: user.email, name: user.name };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/precheckout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const r = await response.json();
    setLoading(false);

    if (r.success) {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      var options = {
        key: process.env.NEXT_PUBLIC_KEY_ID,
        amount: r.order.amount,
        currency: "INR",
        name: `DeployLite`,
        description: `Add funds to DeployLite Wallet`,
        image: "/logo.png",
        order_id: r.order.id,
        callback_url: `${process.env.NEXT_PUBLIC_HOST}/api/postcheckout`,
        prefill: { name: user.name, email: user.email },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#FD0872" },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
      e.preventDefault();
    } else {
      toast.error("Error in Payment");
    }
  };

  function handleStripePayment() {
    toast.error(
      "Stripe Payment Gateway not implemented yet.Will be available soon..."
    );
  }

  function handleAddFundsInINR() {
    if (!addFundsAmount) return;
    const amt = Number.parseFloat(addFundsAmount);
    if (amt <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTx = {
      id: Date.now(),
      type: "Add Funds (INR)",
      amount: amt,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setAddFundsAmount("");
    alert(`Deposited ₹${amt.toFixed(2)} to your DeployLite balance!`);
  }

  const chartLabels = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const chartValues = [50, 100, 75, 140, 200, 90, 120];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Daily Spend (₹)",
        data: chartValues,
        borderColor: "#f472b6",
        backgroundColor: "rgba(244, 114, 182, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Usage Over Time" },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(244, 114, 182, 0.2)",
        },
      },
      y: {
        grid: {
          color: "rgba(244, 114, 182, 0.2)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-black via-black to-pink-900 text-gray-100 transition-colors duration-300 backdrop-filter backdrop-blur-lg`}
    >
      <Toaster position="top-right" />
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Row: Main Wallet + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Card */}
          <Card className="col-span-2 overflow-hidden bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
            <div className="bg-gradient-to-br from-pink-900 to-black p-6">
              <CardTitle className="text-2xl mb-2 text-pink-100">
                DeployLite Balance
              </CardTitle>
              <CardDescription className="text-pink-300">
                Available funds for your account
              </CardDescription>
              <p className="text-5xl font-bold mt-4 text-pink-400">
                ₹{wallet.balance}
              </p>
            </div>
            <CardFooter className="flex justify-between mt-4">
              {/* Razorpay / Stripe Payment */}
              <Button
                className="bg-pink-700 hover:bg-pink-600 text-white backdrop-filter backdrop-blur-sm"
                onClick={handleRazorpayPayment}
              >
                <DollarSignIcon className="mr-2 h-4 w-4" /> Pay (Razorpay)
              </Button>
              <Button
                className="bg-pink-800 hover:bg-pink-700 text-white"
                onClick={handleStripePayment}
              >
                <DollarSignIcon className="mr-2 h-4 w-4" /> Pay (Stripe)
              </Button>
              <Button
                className="bg-gray-800 hover:bg-gray-700 text-pink-100"
                onClick={() => {
                  router.push("/settings");
                }}
              >
                <SettingsIcon className="mr-2 h-4 w-4" /> Manage Account
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-pink-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-pink-700 hover:bg-pink-600 text-white">
                  <RefreshCwIcon className="mr-2 h-4 w-4" /> Auto-Recharge
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-pink-700 text-pink-300 hover:bg-pink-900"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" /> Download Invoices
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-pink-700 text-pink-300 hover:bg-pink-900"
                >
                  <AlertTriangleIcon className="mr-2 h-4 w-4" /> View Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row: Add Funds + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Add Funds (INR) */}
          <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-pink-100">Add Funds (INR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="amount" className="text-pink-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  placeholder="Enter amount in INR"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm text-pink-100 border-pink-700 placeholder-pink-400"
                />
                <Button
                  className="bg-pink-700 hover:bg-pink-600 text-white"
                  onClick={handleRazorpayPayment}
                >
                  <CreditCardIcon className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Summary */}
          <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-pink-100">Wallet Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-pink-300">Total Spent This Month:</span>
                  <span className="font-bold text-pink-100">₹0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-300">Remaining Budget:</span>
                  <span className="font-bold text-pink-100">
                    ₹{wallet.balance}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-300">Next Billing Date:</span>
                  <span className="font-bold text-pink-100">{date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm border border-pink-700">
            <TabsTrigger value="transactions" className="text-pink-100">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-pink-100">
              Billing
            </TabsTrigger>
            <TabsTrigger value="crypto" className="text-pink-100">
              Crypto
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-pink-100">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-100">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {transactions.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-4 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-pink-100">{tx.type}</p>
                        <p className="text-sm text-pink-300">
                          {tx.date} at {tx.time}
                        </p>
                      </div>
                      <p
                        className={`font-bold ${
                          tx.type.toLowerCase().includes("add") ||
                          tx.type.toLowerCase().includes("crypto")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type.toLowerCase().includes("add") ||
                        tx.type.toLowerCase().includes("crypto")
                          ? "+"
                          : "-"}
                        ₹{tx.amount.toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="text-pink-400 hover:text-pink-300"
                >
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-100">
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-300">Current Plan:</span>
                    <span className="font-bold text-pink-100">Pro Plan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-300">Billing Cycle:</span>
                    <span className="font-bold text-pink-100">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-300">Next Invoice Amount:</span>
                    <span className="font-bold text-pink-100">₹99.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-300">Payment Method:</span>
                    <span className="font-bold text-pink-100">
                      Visa ****1234
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="text-pink-400 hover:text-pink-300"
                >
                  Update Billing Info
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto">
            <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-100">
                  Blockchain Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cryptoConnected ? (
                    <>
                      <p className="text-sm text-pink-300">
                        Connected Wallet:{" "}
                        <span className="font-mono break-all text-xs text-pink-100">
                          {cryptoWalletAddress}
                        </span>
                      </p>
                      <p className="text-sm text-pink-300">
                        On-chain Balance:{" "}
                        <span className="text-pink-100">
                          {Number(cryptoBalance).toFixed(6)} ETH
                        </span>
                      </p>
                      <Label htmlFor="cryptoAmount" className="text-pink-300">
                        Enter Amount (ETH)
                      </Label>
                      <Input
                        id="cryptoAmount"
                        placeholder="e.g., 0.01"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm text-pink-100 border-pink-700 placeholder-pink-400"
                      />
                      <Button
                        className="bg-green-700 hover:bg-green-600 text-white"
                        onClick={handleSendCryptoPayment}
                      >
                        <DollarSignIcon className="mr-2 h-4 w-4" /> Pay with
                        MetaMask
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-pink-700 hover:bg-pink-600 text-white"
                      onClick={handleConnectCryptoWallet}
                    >
                      Connect to MetaMask
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab (Chart) */}
          <TabsContent value="analytics">
            <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-pink-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-100">Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}