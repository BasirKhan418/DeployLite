"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Settings({tabname,name,visible}:{tabname:string,name:string,visible:boolean}) {
  const [activeTab, setActiveTab] = useState(tabname);

  const TabIcon = ({ tab }:any) => {
    const icons = {
      profile: User,
      account: Key,
      integrations: Globe,
      aws: Cloud,
      notifications: Bell,
      billing: CreditCard,
    }
    //@ts-ignore
    const Icon = icons[tab]
    return <Icon className="w-4 h-4 mr-2" />
  }

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{name||"Settings"}</h1>
        <Avatar className="h-10 w-32">
          <AvatarImage src="#" alt="User" />
          <AvatarFallback>Basir85</AvatarFallback>
        </Avatar>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue={tabname||"profile"} className="space-y-6" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
            { visible&&(<TabsList className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6">
                {["profile", "account", "integrations", "aws", "notifications", "billing"].map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="flex items-center">
                    <TabIcon tab={tab} />
                    <span className="capitalize">{tab}</span>
                  </TabsTrigger>
                ))}
              </TabsList>)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="sm:hidden">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TabIcon tab={activeTab} />
                      <span className="capitalize">{activeTab}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["profile", "account", "integrations", "aws", "notifications", "billing"].map((tab) => (
                    <DropdownMenuItem key={tab} onSelect={() => setActiveTab(tab)}>
                      <TabIcon tab={tab} />
                      <span className="capitalize">{tab}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your app preferences and experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Adjust the appearance of the app</p>
                    </div>
                    <Switch id="darkMode" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Language</Label>
                      <p className="text-sm text-muted-foreground">Select your preferred language</p>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactor" />
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Security Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage devices that are logged into your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">MacBook Pro</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">iPhone 12</p>
                        <p className="text-sm text-muted-foreground">Last active: 5 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage your connected accounts and services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Github className="w-8 h-8" />
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Disconnect</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Globe className="w-8 h-8" />
                      <div>
                        <p className="font-medium">GitLab</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Zap className="w-8 h-8" />
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for external integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">Last used: 3 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground">Last used: 1 hour ago</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Create New API Key</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="aws" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AWS Integration</CardTitle>
                  <CardDescription>Connect and manage your AWS services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Cloud className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">AWS Account</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Disconnect</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="awsRegion">AWS Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger id="awsRegion">
                        <SelectValue placeholder="Select AWS Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awsAccessKey">AWS Access Key ID</Label>
                    <Input id="awsAccessKey" placeholder="Enter your AWS Access Key ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awsSecretKey">AWS Secret Access Key</Label>
                    <Input id="awsSecretKey" type="password" placeholder="Enter your AWS Secret Access Key" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save AWS Configuration</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AWS Services</CardTitle>
                  <CardDescription>Manage AWS services integrated with your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Amazon S3</p>
                      <p className="text-sm text-muted-foreground">File storage service</p>
                    </div>
                    <Switch id="s3Service" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Amazon EC2</p>
                      <p className="text-sm text-muted-foreground">Compute service</p>
                    </div>
                    <Switch id="ec2Service" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Amazon RDS</p>
                      <p className="text-sm text-muted-foreground">Relational database service</p>
                    </div>
                    <Switch id="rdsService" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deploymentNotifications">Deployment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts for deployment status changes</p>
                    </div>
                    <Switch id="deploymentNotifications" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="buildFailures">Build Failure Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when builds fail</p>
                    </div>
                    <Switch id="buildFailures" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="securityAlerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive important security notifications</p>
                    </div>
                    <Switch id="securityAlerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Slack Notifications</Label>
                      <p className="text-sm text-muted-foreground">Connected to #deployments channel</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan: Pro</p>
                      <p className="text-sm text-muted-foreground">$29/month, billed monthly</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="billingEmail">Billing Email</Label>
                    <Input id="billingEmail" type="email" placeholder="billing@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="**** **** **** 1234" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Billing Information</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet</CardTitle>
                  <CardDescription>Manage your wallet balance and transactions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Balance</p>
                      <p className="text-2xl font-bold">$250.00</p>
                    </div>
                    <Button>
                      <Wallet className="mr-2 h-4 w-4" />
                      Recharge Wallet
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recent Transactions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Jul 15, 2023</TableCell>
                          <TableCell>Wallet Recharge</TableCell>
                          <TableCell className="text-right">+$100.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jul 10, 2023</TableCell>
                          <TableCell>Monthly Subscription</TableCell>
                          <TableCell className="text-right">-$29.99</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jul 1, 2023</TableCell>
                          <TableCell>Wallet Recharge</TableCell>
                          <TableCell className="text-right">+$200.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View All Transactions</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your recent invoices and payment history.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Jul 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jun 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Download All Invoices</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}