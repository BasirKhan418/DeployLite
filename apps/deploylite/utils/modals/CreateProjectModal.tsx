"use client"

import { useState } from "react"
import { PlusIcon, GitBranchIcon, StarIcon, XIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const mockRepos = [
  { id: 1, name: "awesome-project", fullName: "user/awesome-project", description: "An awesome project", stars: 120 },
  { id: 2, name: "cool-app", fullName: "user/cool-app", description: "A cool application", stars: 89 },
  { id: 3, name: "useful-tool", fullName: "user/useful-tool", description: "A very useful tool", stars: 56 },
  { id: 4, name: "amazing-lib", fullName: "user/amazing-lib", description: "An amazing library", stars: 234 },
  { id: 5, name: "great-framework", fullName: "user/great-framework", description: "A great framework", stars: 567 },
  { id: 6, name: "innovative-solution", fullName: "user/innovative-solution", description: "An innovative solution", stars: 789 },
  { id: 7, name: "powerful-toolkit", fullName: "user/powerful-toolkit", description: "A powerful development toolkit", stars: 432 },
  { id: 8, name: "efficient-algorithm", fullName: "user/efficient-algorithm", description: "An efficient algorithm implementation", stars: 321 },
]

const pricingPlans = [
  { id: 1, name: "Basic", cpu: "1 vCPU", ram: "2GB RAM", storage: "20GB SSD", hourly: 15, daily: 360, monthly: 10800 },
  { id: 2, name: "Standard", cpu: "2 vCPU", ram: "4GB RAM", storage: "40GB SSD", hourly: 30, daily: 720, monthly: 21600 },
  { id: 3, name: "Premium", cpu: "4 vCPU", ram: "8GB RAM", storage: "80GB SSD", hourly: 60, daily: 1440, monthly: 43200 },
  { id: 4, name: "Enterprise", cpu: "8 vCPU", ram: "16GB RAM", storage: "160GB SSD", hourly: 120, daily: 2880, monthly: 86400 },
]

export default function CreateProjectModal({open,setOpen,type}:{open:boolean,setOpen:Function,type:string}) {
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }])
  const [selectedRepo, setSelectedRepo] = useState<typeof mockRepos[0] | null>(null)
  const [repoSearch, setRepoSearch] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<string>("1")

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }])
  }

  const updateEnvVar = (index: number, key: string, value: string) => {
    const newEnvVars = [...envVars]
    newEnvVars[index] = { ...newEnvVars[index], [key]: value }
    setEnvVars(newEnvVars)
  }

  const filteredRepos = mockRepos.filter(repo =>
    repo.fullName.toLowerCase().includes(repoSearch.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-[700px] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create a New Project</DialogTitle>
              <DialogDescription>Deploy your project in just a few steps</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name" className="text-sm font-medium">Project Name</Label>
                <Input id="project-name" placeholder="my-awesome-project" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">GitHub Repository</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedRepo ? selectedRepo.fullName : "Select a repository"}
                      <GitBranchIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Card>
                      <CardHeader className="px-2 py-3">
                        <Input
                          placeholder="Search repositories..."
                          value={repoSearch}
                          onChange={(e) => setRepoSearch(e.target.value)}
                          className="h-8"
                        />
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[200px]">
                          {filteredRepos.map(repo => (
                            <div
                              key={repo.id}
                              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-secondary"
                              onClick={() => {
                                setSelectedRepo(repo)
                                setRepoSearch("")
                              }}
                            >
                              <div>
                                <p className="font-medium">{repo.fullName}</p>
                                <p className="text-sm text-gray-500">{repo.description}</p>
                              </div>
                              <div className="flex items-center space-x-1 text-sm">
                                <StarIcon className="w-4 h-4" />
                                <span>{repo.stars}</span>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="framework" className="text-sm font-medium">Framework</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Pricing Plan</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-2 gap-4">
                  {pricingPlans.map((plan) => (
                    <Label
                      key={plan.id}
                      htmlFor={`plan-${plan.id}`}
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
                        selectedPlan === plan.id.toString() ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                      <div className="text-center">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.cpu}</p>
                        <p className="text-sm text-muted-foreground">{plan.ram}</p>
                        <p className="text-sm text-muted-foreground">{plan.storage}</p>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-2xl font-bold">₹{plan.monthly}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="build-command" className="text-sm font-medium">Build Command</Label>
                <Input id="build-command" placeholder="npm run build" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Environment Variables</Label>
                {envVars.map((envVar, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="KEY"
                      value={envVar.key}
                      onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="VALUE"
                      value={envVar.value}
                      onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addEnvVar}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Variable
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-sm font-medium">Branch</Label>
                <Select>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">main</SelectItem>
                    <SelectItem value="develop">develop</SelectItem>
                    <SelectItem value="feature">feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full">Create Project</Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}