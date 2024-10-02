"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, ArrowRight, Check } from "lucide-react"

const webBuilders = [
  { name: "WordPress", icon: "/wordpress-icon.svg", category: "CMS" },
  { name: "PrestaShop", icon: "/prestashop-icon.svg", category: "E-commerce" },
  { name: "Drupal", icon: "/drupal-icon.svg", category: "CMS" },
  { name: "Joomla", icon: "/joomla-icon.svg", category: "CMS" },
  { name: "Magento", icon: "/magento-icon.svg", category: "E-commerce" },
  { name: "Shopify", icon: "/shopify-icon.svg", category: "E-commerce" },
  { name: "Wix", icon: "/wix-icon.svg", category: "Website Builder" },
  { name: "Squarespace", icon: "/squarespace-icon.svg", category: "Website Builder" },
]

const projectTemplates = [
  { name: "Blank Project", description: "Start from scratch" },
  { name: "Blog", description: "Perfect for content creators" },
  { name: "E-commerce Store", description: "Set up your online shop" },
  { name: "Portfolio", description: "Showcase your work" },
  { name: "Corporate Website", description: "Professional business site" },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$9.99",
    features: ["1 Website", "5GB Storage", "50GB Bandwidth", "Basic Support"],
  },
  {
    name: "Pro",
    price: "$24.99",
    features: ["5 Websites", "20GB Storage", "200GB Bandwidth", "Priority Support", "Custom Domain"],
  },
  {
    name: "Business",
    price: "$49.99",
    features: ["Unlimited Websites", "100GB Storage", "1TB Bandwidth", "24/7 Support", "Custom Domain", "SSL Certificate"],
  },
]

export default function CreateWebBuilder({open,setOpen}:{open:boolean,setOpen:(open:boolean)=>void}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [selectedBuilder, setSelectedBuilder] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [domain, setDomain] = useState("")
  const [sslEnabled, setSSLEnabled] = useState(true)
  const [performanceLevel, setPerformanceLevel] = useState("standard")
  const [selectedPlan, setSelectedPlan] = useState("")

  const filteredBuilders = webBuilders.filter((builder) =>
    builder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle project creation logic here
    console.log("Creating project:", {
      projectName,
      projectDescription,
      selectedBuilder,
      selectedTemplate,
      domain,
      sslEnabled,
      performanceLevel,
      selectedPlan,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
     
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]  ">
        <ScrollArea className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
          <DialogDescription>
            Set up your new web project in just a few steps.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step < currentStep
                    ? "text-primary"
                    : step === currentStep
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {step}
                </div>
                <span className="hidden sm:inline">
                  {step === 1 ? "Project Details" : step === 2 ? "Choose Builder" : step === 3 ? "Configuration" : "Select Plan"}
                </span>
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-name" className="text-right">
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Project Template</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectTemplates.map((template) => (
                    <Button
                      key={template.name}
                      variant={selectedTemplate === template.name ? "default" : "outline"}
                      className="h-auto flex flex-col items-start justify-start p-4 space-y-2"
                      onClick={() => setSelectedTemplate(template.name)}
                    >
                      <span className="font-semibold">{template.name}</span>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Web Builder</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4 pr-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredBuilders.map((builder) => (
                    <Button
                      key={builder.name}
                      variant={selectedBuilder === builder.name ? "default" : "outline"}
                      className="h-auto flex-col items-center justify-center p-4 space-y-2"
                      onClick={() => setSelectedBuilder(builder.name)}
                    >
                      <img src={builder.icon} alt={builder.name} className="h-12 w-12" />
                      <span className="text-xs font-semibold">{builder.name}</span>
                      <span className="text-xs text-muted-foreground">{builder.category}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  <div className="col-span-3 flex">
                    <Input
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="rounded-r-none"
                      placeholder="yourdomain"
                    />
                    <Select
                      value=".com"
                      onValueChange={() => {}}
                    >
                      <SelectTrigger className="w-[100px] rounded-l-none">
                        <SelectValue placeholder=".com" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=".com">.com</SelectItem>
                        <SelectItem value=".net">.net</SelectItem>
                        <SelectItem value=".org">.org</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ssl" className="text-right">
                    SSL Certificate
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="ssl"
                      checked={sslEnabled}
                      onCheckedChange={setSSLEnabled}
                    />
                    <Label htmlFor="ssl">Enable HTTPS</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="performance" className="text-right">
                    Performance
                  </Label>
                  <Select
                    value={performanceLevel}
                    onValueChange={setPerformanceLevel}
                  >
                    <SelectTrigger className="w-full col-span-3">
                      <SelectValue placeholder="Select performance level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="enhanced">Enhanced</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Label>Select a Pricing Plan</Label>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingPlans.map((plan) => (
                    <div key={plan.name} className="relative">
                      <RadioGroupItem
                        value={plan.name}
                        id={plan.name}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={plan.name}
                        className={`flex flex-col h-full p-4 rounded-lg border-2 ${
                          selectedPlan === plan.name
                            ? "border-primary"
                            : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-lg">{plan.name}</span>
                        <span className="text-2xl font-extrabold my-2">{plan.price}</span>
                        <span className="text-sm text-muted-foreground mb-4">per month</span>
                        <ul className="text-sm space-y-2 flex-grow">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Project Summary</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Name:</strong> {projectName || "Not set"}</li>
              <li><strong>Template:</strong> {selectedTemplate || "Not selected"}</li>
              <li><strong>Web Builder:</strong> {selectedBuilder || "Not selected"}</li>
              <li><strong>Domain:</strong> {domain ? `${domain}.com` : "Not set"}</li>
              <li><strong>SSL:</strong> {sslEnabled ? "Enabled" : "Disabled"}</li>
              <li><strong>Performance:</strong> {performanceLevel.charAt(0).toUpperCase() + performanceLevel.slice(1)}</li>
              <li><strong>Plan:</strong> {selectedPlan || "Not selected"}</li>
            </ul>
          </div>

          <DialogFooter className="flex justify-between items-center">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNextStep} disabled={currentStep === 1 && !projectName}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" >
                Create Project
              </Button>
            )}
          </DialogFooter>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}