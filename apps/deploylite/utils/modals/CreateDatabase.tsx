"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Database, Server, HardDrive } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,DialogFooter } from "@/components/ui/dialog"
const databases = [
  { id: "mysql", name: "MySQL", icon: Database, description: "Relational database management system" },
  { id: "postgresql", name: "PostgreSQL", icon: Database, description: "Object-relational database system" },
  { id: "mongodb", name: "MongoDB", icon: HardDrive, description: "Document-oriented NoSQL database" },
]

const pricingPlans = [
  { id: "basic", name: "Basic", price: "$9", storage: "5GB", features: ["1 Database", "Daily Backups", "24/7 Support"] },
  { id: "pro", name: "Pro", price: "$29", storage: "20GB", features: ["5 Databases", "Hourly Backups", "Priority Support", "Advanced Security"] },
  { id: "enterprise", name: "Enterprise", price: "$99", storage: "100GB", features: ["Unlimited Databases", "Real-time Backups", "Dedicated Support", "Custom Solutions"] },
]

export default function CreateDatabase({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
  const [step, setStep] = useState(1)
  const [dbType, setDbType] = useState("")
  const [plan, setPlan] = useState("")
  const [dbName, setDbName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ dbType, plan, dbName })
    // Handle form submission here
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
       
            
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]  ">
            <DialogHeader>
                <DialogTitle>Create a new database</DialogTitle>
                <DialogDescription>Choose a database type, plan, and provide a name for your database</DialogDescription>
            </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Select Database Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databases.map((db) => (
                <Card 
                  key={db.id} 
                  className={`cursor-pointer transition-all transform hover:scale-105 ${dbType === db.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                  onClick={() => setDbType(db.id)}
                >
                  <CardHeader className="flex flex-col items-center space-y-1">
                    <div className={`p-3 rounded-full ${dbType === db.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <db.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{db.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{db.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dbType === db.id ? 'border-primary bg-primary' : 'border-muted'}`}>
                      {dbType === db.id && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Choose a Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingPlans.map((pricingPlan) => (
                <Card 
                  key={pricingPlan.id} 
                  className={`cursor-pointer transition-all transform hover:scale-105 ${plan === pricingPlan.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                  onClick={() => setPlan(pricingPlan.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">{pricingPlan.name}</CardTitle>
                    <CardDescription className="text-3xl font-bold text-center">{pricingPlan.price}<span className="text-sm font-normal">/month</span></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center mb-4">{pricingPlan.storage} Storage</p>
                    <ul className="space-y-2">
                      {pricingPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === pricingPlan.id ? 'border-primary bg-primary' : 'border-muted'}`}>
                      {plan === pricingPlan.id && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Database Details</CardTitle>
              <CardDescription className="text-center">Provide a name for your new database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter database name" 
                    value={dbName} 
                    onChange={(e) => setDbName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-2">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`w-3 h-3 rounded-full ${s === step ? 'bg-primary' : 'bg-muted'}`}
              initial={false}
              animate={{
                scale: s === step ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
        <div className="flex space-x-4">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="w-32"
            >
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button 
              type="button" 
              onClick={() => setStep(step + 1)} 
              disabled={step === 1 && !dbType || step === 2 && !plan}
              className="w-32"
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={!dbName}
              className="w-32"
            >
              Create
            </Button>
          )}
        </div>
      </div>
    </form>
    </DialogContent>
    </Dialog>
  )
}