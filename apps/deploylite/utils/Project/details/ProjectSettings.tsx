"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {  Globe, Zap, CreditCard, Users, Clock, Shield, AlertTriangle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ProjectSettings() {
  const [assignedDomain, setAssignedDomain] = useState('myproject.webplatform.com')
  const [customDomain, setCustomDomain] = useState('')
  const [plan, setPlan] = useState('pro')
  const [envVars, setEnvVars] = useState([
    { key: 'API_KEY', value: '********' },
    { key: 'DATABASE_URL', value: 'postgres://user:pass@host:5432/db' }
  ])
  const deployments = [
    { id: 1, status: 'success', version: 'v1.2.3', date: '2023-10-20', author: 'John Doe' },
    { id: 2, status: 'failed', version: 'v1.2.2', date: '2023-10-19', author: 'Jane Smith' },
    { id: 3, status: 'success', version: 'v1.2.1', date: '2023-10-18', author: 'John Doe' },
  ]

  const handleAddCustomDomain = () => {
    alert(`Custom domain ${customDomain} added!`)
    setCustomDomain('')
  }

  const handleUpdateEnvVar = (index: number, key: string, value: string) => {
    const updatedEnvVars = [...envVars]
    updatedEnvVars[index] = { key, value }
    setEnvVars(updatedEnvVars)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Settings</h1>
        <Badge variant="outline" className="text-sm">
          Status: <span className="text-green-500 font-semibold">Active</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
            <Progress value={66} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 TB</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
            <Progress value={80} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
            <Progress value={45} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{plan}</div>
            <p className="text-xs text-muted-foreground">Next billing cycle: 15 days</p>
            <Progress value={50} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="env">Environment</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Manage your project&apos;s domain names</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assigned-domain">Assigned Domain</Label>
                <Input 
                  id="assigned-domain" 
                  value={assignedDomain} 
                  onChange={(e) => setAssignedDomain(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Add Custom Domain</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="custom-domain" 
                    value={customDomain} 
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="example.com"
                  />
                  <Button onClick={handleAddCustomDomain}>Add</Button>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-semibold mb-2">Active Domains</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>{assignedDomain}</span>
                    <Badge>Primary</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>custom-domain.com</span>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plan</CardTitle>
              <CardDescription>View and update your current plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Plan Details</h4>
                <ul className="space-y-1">
                  <li className="text-sm">• 100 GB Bandwidth</li>
                  <li className="text-sm">• 5 Custom Domains</li>
                  <li className="text-sm">• Unlimited Deployments</li>
                  <li className="text-sm">• 24/7 Support</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Usage</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bandwidth</span>
                      <span>60 GB / 100 GB</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Custom Domains</span>
                      <span>2 / 5</span>
                    </div>
                    <Progress value={40} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="env">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Manage your project's environment variables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {envVars.map((env, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input 
                      value={env.key} 
                      onChange={(e) => handleUpdateEnvVar(index, e.target.value, env.value)}
                      placeholder="KEY"
                    />
                    <Input 
                      value={env.value} 
                      onChange={(e) => handleUpdateEnvVar(index, env.key, e.target.value)}
                      placeholder="VALUE"
                      type="password"
                    />
                    <Button variant="outline" size="icon">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setEnvVars([...envVars, { key: '', value: '' }])}>
                Add Variable
              </Button>
              <Button variant="outline">
                Import from .env
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="deployments">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
              <CardDescription>View and manage your project deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your recent deployments</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployments.map((deployment) => (
                    <TableRow key={deployment.id}>
                      <TableCell>
                        <Badge variant={deployment.status === 'success' ? 'default' : 'destructive'}>
                          {deployment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{deployment.version}</TableCell>
                      <TableCell>{deployment.date}</TableCell>
                      <TableCell>{deployment.author}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Rollback</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Deploy New Version</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive project updates via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deployment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about deployment status changes</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your project's security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>API Tokens</Label>
                <Button variant="outline" className="w-full">Manage API Tokens</Button>
              </div>
              <div className="space-y-2">
                <Label>IP Whitelist</Label>
                <Input placeholder="Enter IP address" />
                <Button variant="outline" className="w-full">Add IP to Whitelist</Button>
              </div>
              <div className="space-y-2">
                <Label>Security Log</Label>
                <div className="h-[100px] overflow-y-auto border rounded p-2">
                  <p className="text-sm">2023-10-21 09:15 - Login attempt from unknown IP</p>
                  <p className="text-sm">2023-10-20 14:30 - Password changed</p>
                  <p className="text-sm">2023-10-19 11:45 - New API token generated</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Run Security Audit</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <div className="mt-4 h-[60px]">
              {/* Placeholder for uptime graph */}
              <div className="bg-primary/10 w-full h-full rounded-md"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89ms</div>
            <p className="text-xs text-muted-foreground">Average over last hour</p>
            <div className="mt-4">
              <Slider defaultValue={[89]} max={500} step={1} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Certificate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Valid</div>
            <p className="text-xs text-muted-foreground">Expires in 45 days</p>
            <Button variant="outline" className="w-full mt-4">Renew Certificate</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}