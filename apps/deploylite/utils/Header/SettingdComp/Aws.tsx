
"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"


const Aws = () => {
  return (
    <div>
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
    </div>
  )
}

export default Aws
