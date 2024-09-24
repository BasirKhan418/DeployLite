"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
const Account = () => {
  return (
    <div>
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
    </div>
  )
}

export default Account
