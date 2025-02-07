"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  CreditCardIcon,
  HistoryIcon,
  PieChartIcon,
  SunIcon,
  MoonIcon,
  DollarSignIcon,
  SettingsIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  RefreshCwIcon
} from 'lucide-react'
import { useAppSelector } from '@/lib/hook'
import { useRouter } from 'next/navigation'
export default function ImprovedPlatformWallet() {
  const wallet = useAppSelector(state => state.wallet.wallet)
  const [addFundsAmount, setAddFundsAmount] = useState('')
  const midnightIST = new Date();
  midnightIST.setHours(24, 0, 0, 0); // Set time to midnight (12:00 AM)
  let date = midnightIST.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  const router = useRouter()
  return (
    <div className={`min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-2 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 p-6">
              <CardTitle className="text-2xl mb-2">DeployLite Balance</CardTitle>
              <CardDescription>Available funds for your account</CardDescription>
              <p className="text-5xl font-bold mt-4 text-green-600 dark:text-green-400">₹{wallet.balance}</p>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white">
                <DollarSignIcon className="mr-2 h-4 w-4" /> Add Funds
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" onClick={()=>{
                router.push("/settings")
              }}>
                <SettingsIcon className="mr-2 h-4 w-4" /> Manage Account
              </Button>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <RefreshCwIcon className="mr-2 h-4 w-4" /> Auto-Recharge
                </Button>
                <Button variant="outline" className="w-full dark:border-gray-600 dark:hover:bg-gray-700">
                  <FileTextIcon className="mr-2 h-4 w-4" /> Download Invoices
                </Button>
                <Button variant="outline" className="w-full dark:border-gray-600 dark:hover:bg-gray-700">
                  <AlertTriangleIcon className="mr-2 h-4 w-4" /> View Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <Button  className="bg-green-600 hover:bg-green-700 text-white">
                  <CreditCardIcon className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Wallet Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Spent This Month:</span>
                  <span className="font-bold">₹0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Remaining Budget:</span>
                  <span className="font-bold">₹{wallet.balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Next Billing Date:</span>
                  <span className="font-bold">{date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[{ id: 1, type: 'Platform Usage', amount: 50, date: '2023-09-15', time: '14:30' }, 
                    { id: 2, type: 'Add Funds', amount: 100, date: '2023-09-14', time: '09:15' }, 
                    { id: 3, type: 'Service Upgrade', amount: 80, date: '2023-09-13', time: '18:45' }
                  ].map((transaction) => (
                    <li key={transaction.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div>
                        <p className="font-semibold">{transaction.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.date} at {transaction.time}
                        </p>
                      </div>
                      <p className={`font-bold ${transaction.type === 'Add Funds' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'Add Funds' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">View All Transactions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Plan:</span>
                    <span className="font-bold">Pro Plan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Billing Cycle:</span>
                    <span className="font-bold">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next Invoice Amount:</span>
                    <span className="font-bold">$99.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Method:</span>
                    <span className="font-bold">Visa ****1234</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Update Billing Info</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
