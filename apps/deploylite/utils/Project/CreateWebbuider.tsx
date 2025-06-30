"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GitBranch, GitFork, Rocket, Server, Cloud, Zap, Shield, Users, Code, Globe, ChevronRight, Check, X, AlertTriangle, Terminal, Coffee, DollarSign, Layout } from 'lucide-react'
import Image from 'next/image'

export default function CreateWebbuilder() {
  const [stage, setStage] = useState(1)
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    repo: '',
    buildCommand: '',
    envVariables: ''
  })
  const [selectedPlan, setSelectedPlan] = useState('hobby')
  const [selectedBuilder, setSelectedBuilder] = useState('')

  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value })
  }

  

  const handleCreateProject = () => {
    // Handle project creation here
    console.log('Project Details:', projectDetails)
    console.log('Selected Plan:', selectedPlan)
    console.log('Selected Builder:', selectedBuilder)
    alert('Project created successfully!')
  }

  const webBuilders = [
    { name: 'WordPress', logo: '/placeholder.svg?height=40&width=40' },
    { name: 'Joomla', logo: '/placeholder.svg?height=40&width=40' },
    { name: 'PrestaShop', logo: '/placeholder.svg?height=40&width=40' },
    { name: 'Drupal', logo: '/placeholder.svg?height=40&width=40' },
    { name: 'Shopify', logo: '/placeholder.svg?height=40&width=40' },
  ]

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-300 sm:text-5xl md:text-6xl">
            Create Your Website From<span className="text-blue-600">Web Builder</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create your website with ease. Start building the future of the web today.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-300">New Project Setup</CardTitle>
            <CardDescription>Follow the steps below to create your new project</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={`stage-${stage}`} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stage-1" onClick={() => setStage(1)} disabled={stage < 1}>Project Details</TabsTrigger>
                <TabsTrigger value="stage-2" onClick={() => setStage(2)} disabled={stage < 2}>Web Builder</TabsTrigger>
                <TabsTrigger value="stage-3" onClick={() => setStage(3)} disabled={stage < 3}>Select Plan</TabsTrigger>
                <TabsTrigger value="stage-4" onClick={() => setStage(4)} disabled={stage < 4}>Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stage-1">
                <div className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      name="name"
                      value={projectDetails.name}
                      onChange={handleProjectDetailsChange}
                      placeholder="My Awesome Project"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github-repo">GitHub Repository</Label>
                    <Select name="repo" onValueChange={(value) => setProjectDetails({ ...projectDetails, repo: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a repository" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repo1">user/repo1</SelectItem>
                        <SelectItem value="repo2">user/repo2</SelectItem>
                        <SelectItem value="repo3">user/repo3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="build-command">Build Command</Label>
                    <Input
                      id="build-command"
                      name="buildCommand"
                      value={projectDetails.buildCommand}
                      onChange={handleProjectDetailsChange}
                      placeholder="npm run build"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="env-variables">Environment Variables</Label>
                    <Textarea
                      id="env-variables"
                      name="envVariables"
                      value={projectDetails.envVariables}
                      onChange={handleProjectDetailsChange}
                      placeholder="KEY=value"
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={() => setStage(2)} className="w-full">
                    Next: Choose Web Builder <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="stage-2">
                <div className="space-y-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Choose Your Web Builder</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {webBuilders.map((builder) => (
                      <Card
                        key={builder.name}
                        className={`cursor-pointer transition-all ${
                          selectedBuilder === builder.name ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedBuilder(builder.name)}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <img src={builder.logo} alt={`${builder.name} logo`} className="w-16 h-16 mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300">{builder.name}</h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage(1)}>
                      <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                      Back
                    </Button>
                    <Button onClick={() => setStage(3)} disabled={!selectedBuilder}>
                      Next: Select Plan <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stage-3">
              <div className="space-y-6 mt-6">
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className={`relative flex flex-col p-6 bg-white border border-gray-200 dark:bg-black dark:border-gray-700  rounded-lg shadow-sm ${selectedPlan === 'hobby' ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
                        <RadioGroupItem value="hobby" id="hobby" className="sr-only" />
                        <Label htmlFor="hobby" className="font-semibold flex items-center">
                          <Cloud className="h-5 w-5 mr-2 text-blue-500" />
                          Hobby
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">Perfect for side projects</p>
                        <p className="mt-4 text-sm font-semibold">$0/month</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-green-500" /> 1 concurrent build</li>
                          <li className="flex items-center"><Globe className="h-4 w-4 mr-2 text-green-500" /> Automatic HTTPS</li>
                        </ul>
                      </div>
                      <div className={`relative flex flex-col p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${selectedPlan === 'pro' ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
                        <RadioGroupItem value="pro" id="pro" className="sr-only" />
                        <Label htmlFor="pro" className="font-semibold flex items-center">
                          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
                          Pro
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">For growing businesses</p>
                        <p className="mt-4 text-sm font-semibold">$20/month</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-green-500" /> 5 concurrent builds</li>
                          <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Advanced security</li>
                          <li className="flex items-center"><Users className="h-4 w-4 mr-2 text-green-500" /> Team collaboration</li>
                        </ul>
                      </div>
                      <div className={`relative flex flex-col p-6 bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-lg shadow-sm ${selectedPlan === 'enterprise' ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
                        <RadioGroupItem value="enterprise" id="enterprise" className="sr-only" />
                        <Label htmlFor="enterprise" className="font-semibold flex items-center">
                          <Server className="h-5 w-5 mr-2 text-blue-500" />
                          Enterprise
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">For large-scale applications</p>
                        <p className="mt-4 text-sm font-semibold">Contact us</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                          <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-green-500" /> Unlimited builds</li>
                          <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Advanced security</li>
                          <li className="flex items-center"><Code className="h-4 w-4 mr-2 text-green-500" /> Custom integrations</li>
                        </ul>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage(1)}>Back</Button>
                    <Button onClick={() => setStage(4)}>
                      Next: Review <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stage-4">
                <div className="space-y-6 mt-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">Review Your Project</h3>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="col-span-2">
                        <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Rocket className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Project Name</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-gray-300">{projectDetails.name || 'Untitled Project'}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-blue-500 border-blue-500">
                            {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Repository</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <GitFork className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">{projectDetails.repo || 'Not specified'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 ">Build Command</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Terminal className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">{projectDetails.buildCommand || 'Default'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-2">
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment Variables</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                              <pre className="text-xs text-gray-600 whitespace-pre-wrap dark:text-gray-300">
                                {projectDetails.envVariables || 'No environment variables set'}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-2">
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Web Builder</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Layout className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">Not selected</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Plan Details: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Automatic HTTPS</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Unlimited Websites</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Continuous Deployment</span>
                        </div>
                        <div className="flex items-center">
                          {selectedPlan === 'hobby' ? (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          ) : (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-300">Custom Domains</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-yellow-800">Before you deploy</h5>
                          <p className="mt-1 text-sm text-yellow-700">
                            Make sure you have committed all your changes and pushed them to your repository.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <Coffee className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Estimated build time: <span className="font-semibold">2-3 minutes</span></p>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-6 w-6 text-gray-400 mr-2 dark:text-gray-300" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Estimated monthly cost: <span className="font-semibold">$0.00</span></p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage(3)}>
                      <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                      Back to Plans
                    </Button>
                    <Button onClick={handleCreateProject} className="bg-green-600 hover:bg-green-700">
                      Create Project
                      <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Platform Overview</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <GitFork className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+6 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deployments</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <p className="text-xs text-muted-foreground">+15 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">+0.1% from last quarter</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-black shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Deployment Features</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative group bg-white dark:bg-gray-900 rounded p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <Cloud className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Cloud Hosting
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Deploy your projects to our reliable cloud infrastructure for maximum uptime and scalability.
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>

              <div className="relative group bg-white dark:bg-gray-900 rounded  p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Instant Deployments
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Push your code and see it live in seconds with our automated deployment pipeline.
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>

              <div className="relative group bg-white dark:bg-gray-900 rounded  p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Advanced Security
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Protect your applications with our built-in security features and SSL certificates.
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">Trusted by developers worldwide</h2>
          <div className="mt-8 flex justify-center space-x-6">
            <Image height={50} width={50} src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple" />
            <Image height={50} width={50} src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage" />
            <Image height={50} width={50} src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit" />
            <Image height={50} width={50} src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Transistor" />
            <Image height={50} width={50} src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg" alt="Workcation" />
          </div>
        </div>
      </div>
    </div>
  )
}