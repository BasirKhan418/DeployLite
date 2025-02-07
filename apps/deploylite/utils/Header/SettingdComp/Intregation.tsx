"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hook"
import { Toaster,toast } from "sonner"
import { useAppDispatch } from "@/lib/hook"
import { add } from "@/lib/features/user/User"
import { FaGitlab } from "react-icons/fa";
import { FaDocker } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaAws } from "react-icons/fa6";
const Intregation = () => {
  const user = useAppSelector((state) => state.user.user)
  const [alertopen,setAlertOpen] = useState(false);
  const dispatch = useAppDispatch();
  //disconnecting github account
  const disconnectGithub = async ()=>{
try{
const data = await fetch("/api/auth/removegithub");
const res = await data.json();
console.log(res);
if(res.success){
  toast.success(res.message);
  dispatch(add(res.data))
  setAlertOpen(false);
}
else{
  toast.error(res.message);
  if(res.data!=null){
    dispatch(add(res.data));
  }
}
}
catch(err){

  toast.error("Something Went wrong please try again after sometime !")
}
  }
  return (
    <div>
      <Toaster position="top-right"/>
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
                        {!user.connectgithub&&<p className="text-sm text-muted-foreground">Connect Now</p>}
                        {user.connectgithub&&<p className="text-sm text-muted-foreground">Connected , User : {user.githubid}</p>}
                      </div>
                    </div>
                    {!user.connectgithub&&<Button onClick={()=>{
                   const clientId = process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID;
                   const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GIT_HUB_REDIRECT_URI||"");
                   const state = encodeURIComponent(process.env.NEXT_PUBLIC_STATE||"");
                   
                   window.open(
                     `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo%20repo_deployment%20write:repo_hook%20codespace&state=${state}`,
                     "_self"
                   );
                   
                    }}>Connect</Button>}
                    {user.connectgithub&&<Button variant={"outline"}>Connected</Button>}
                   
                  </div>
                 
                  <div className="flex justify-between w-full">
                 
                  {user.connectgithub&&<Button className="mx-4"
                  onClick={()=>{
                    const clientId = process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID;
                    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GIT_HUB_REDIRECT_URI||"");
                    const state = encodeURIComponent(process.env.NEXT_PUBLIC_STATE||"");
                    
                    window.open(
                      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo%20repo_deployment%20write:repo_hook%20codespace&state=${state}`,
                      "_self"
                    );
                    
                     }}
                  >Reconnect</Button>}
                  {user.connectgithub&&<Button className="" onClick={()=>{
                    setAlertOpen(true);
                  }}>Disconnect</Button>}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FaGitlab className="w-8 h-8" />
                      <div>
                        <p className="font-medium">GitLab</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button onClick={()=>{
                      toast.info("We are currently working hard to bring this feature to you as soon as possible. Stay tuned for updates")
                    }}>Connect</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FaDocker className="w-8 h-8" />
                      <div>
                        <p className="font-medium">Docker Hub</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button onClick={()=>{
                      toast.error("We are currently working hard to bring this feature to you as soon as possible. Stay tuned for updates")
                    }}>Connect</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FaAws className="w-8 h-8" />
                      <div>
                        <p className="font-medium">AWS ECR (Elastic Container Registry)</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button onClick={()=>{
                      toast.info("We are currently working hard to bring this feature to you as soon as possible. Stay tuned for updates")
                    }}>Connect</Button>
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
              <AlertDialog open={alertopen}>

<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
    Warning: This action cannot be undone. <span className="font-semibold text-red-500">Disconnecting your GitHub account will permanently revoke DeployLite's access to your repositories. This will halt all ongoing deployments and prevent future deployments from being triggered.</span> Be sure to confirm that no critical deployments are in progress, as any active processes will be interrupted.
Are you sure you want to proceed?
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel onClick={()=>{
   
   setAlertOpen(false)
    }}>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={()=>{
     disconnectGithub()
    }}>Continue</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default Intregation
