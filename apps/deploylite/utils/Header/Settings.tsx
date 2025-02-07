"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Profile from "./SettingdComp/Profile"
import Account from "./SettingdComp/Account"
import Intregation from "./SettingdComp/Intregation"
import Aws from "./SettingdComp/Aws"
import Notification from "./SettingdComp/Notification"
import Biling from "./SettingdComp/Biling"
import { useAppSelector } from "@/lib/hook"

export default function Settings({tabname,name,visible}:{tabname:string,name:string,visible:boolean}) {
  const [activeTab, setActiveTab] = useState(tabname);
  const user = useAppSelector((state) => state.user.user)
  //PROFILE INTREGATION STARTS FROM HERE


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
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.img||""} alt="User" />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
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
                    <span className="capitalize">{tab=="aws"?"Customization":tab}</span>
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
           <Profile/>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Account/>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Intregation/>
            </TabsContent>

            <TabsContent value="aws" className="space-y-6">
              <Aws/>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Notification/>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
             <Biling/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}