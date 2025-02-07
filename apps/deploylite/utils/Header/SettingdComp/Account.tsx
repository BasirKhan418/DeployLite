"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import LoginLoader from "@/utils/Loaders/LoginLoader"
import { Toaster,toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hook"
import { useAppDispatch } from "@/lib/hook"
import { add } from "@/lib/features/user/User"
const Account = () => {
    const [showcontent, setshowcontent] = useState(false)
    const[loading, setLoading] = useState(false)
    const user = useAppSelector(state => state.user.user);
    const router = useRouter()
    const dispatch = useAppDispatch()
    //states of update security settings
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    //handle form change
    const handleChange = (e:any) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
    }
    //handle submit
    const handleSubmit = async() => {
        if(form.currentPassword==''||form.newPassword==''||form.confirmPassword==''){
            toast.error('Please fill all the required fields. Current Password, New Password and Confirm Password are required.')
            return
        }
        if(form.newPassword!=form.confirmPassword){
            toast.error('New Password and Confirm Password do not match.')
            return
        }
        //api call to update the password
        setLoading(true)
        const res = await fetch('/api/settings/account',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password:form.confirmPassword,currentPassword:form.currentPassword})
        })
        const result = await res.json() 
        setLoading(false)
        if(result.success){
            toast.success(result.message)
            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
        }
        else{
            toast.error(result.message)
            if(result.login&&!result.login){
                setTimeout(()=>{
                    router.push('/login')
                },1000)
            }
        }   

    }
    //const onchecked chnege
    const twoFactorChange = async() => {
      if(user.is0auth){
        toast.error('Two-Factor Authentication is not allowed for OAuth users. If you have signed up with Google or Github you cannot enable two-factor authentication.It is only for password based login.');
        return
      }
        setLoading(true)
        const res = await fetch('/api/settings/account',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({twofactor:!user.twofactor})
        })
        const result = await res.json()
        setLoading(false)
        if(result.success){
            toast.success(result.message)
            dispatch(add(result.user))  
        }
        else{
            toast.error(result.message)
            if(result.login&&!result.login){
                setTimeout(()=>{
                    router.push('/login')
                },1000)
            }
        }
    }

  return (
    <div>
        <Toaster position="top-right"/>
      <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={form.newPassword} onChange={handleChange}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactor" defaultChecked={user.twofactor||false} onCheckedChange={twoFactorChange} />
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                  onClick={handleSubmit}
                  >{loading?<LoginLoader/>:<ButtonText/>}</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage devices that are logged into your account. Feature is underdevelppement will be coming soon click the button below to see the demo (this is demo only not your actual devices)</CardDescription>

                </CardHeader>
                <Button onClick={()=>setshowcontent(!showcontent)} className="mx-4 mb-4">{showcontent?"Hide Devices":"Show Devices"}</Button>
               { showcontent&&<CardContent className="space-y-4">
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
                </CardContent>}
              </Card>
    </div>
  )
}

export default Account
const ButtonText = () => {
    return (
        <div>
            <p>Update Security Settings</p>
        </div>
    )
}
