import React, { useEffect } from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'
import { useAppSelector } from '@/lib/hook'
import { Toaster,toast } from 'sonner'
import LoginLoader from '@/utils/Loaders/LoginLoader'
import { useAppDispatch } from '@/lib/hook'
import { add } from '@/lib/features/user/User'
import { useRouter } from 'next/navigation'

const Profile = () => {
    const { theme, setTheme } = useTheme()
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    
    //theme onchange
    const themeChange = (e:any) => {
        setTheme(theme=='dark'?'light':'dark')
    }
    
    //profile states
    const [form, setForm] = useState({
        username: '',
        name: '',
        email: '',
        bio: '',
        phone: '',  
    })
    
    //handle form change
    const handleChange = (e:any) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
    }
    
    //load the intial data in the form
    useEffect(()=>{
     setForm({
        username: user?.username||"",
        name: user?.name||"",
        email: user?.email||"",
        bio: user?.bio||"",
        phone: user?.phone||"",
     })
    },[user])
    
    //handle submit 
    const handleSubmit = async() => {
        if(form.username==''||form.name==''||form.email==''){
            toast.error('Please fill all the required fields. Name, Username and Email are required.')
            return
        }
        setLoading(true)
        const res = await fetch('/api/settings/profile',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        const result = await res.json()
        setLoading(false)
        if(result.success){
            toast.success(result.message)
            setForm({
                username: '',
                name: '',
                email: '',
                bio: '',
                phone: '',
            })
            dispatch(add(result.user))
        }
        else{
            toast.error(result.message)
            console.log(result)
            if(result.login&&!result.login){
             setTimeout(()=>{
                router.push('/login')
             },1000)
            }
        }
    }

    return (
        <div>
            <Toaster position="top-right" />
             <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.img} alt="User" />
                          <AvatarFallback>{user && user.name && user.name[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={()=>{
                            toast.error('This feature is not available for your account yet. Start deploying your projects to unlock this feature.')
                        }}>Change Avatar</Button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="username">User Name</Label>
                          <Input id="username" placeholder="John@123" value={form.username} readOnly/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="John" value={form.name} onChange={handleChange}/>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@example.com" value={form.email} readOnly/>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="number" placeholder="+91 XXXXXXXXX" value={form.phone} onChange={handleChange}/>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" placeholder="Tell us about yourself" value={form.bio} onChange={handleChange}/>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSubmit}>
                        {loading ? <LoginLoader /> : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>Manage your app preferences and experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="darkMode">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Adjust the appearance of the app</p>
                        </div>
                        <Switch id="darkMode"
                         checked={theme=='dark'?true:false}
                         onCheckedChange={themeChange}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Language</Label>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Coming Soon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
        </div>
    )
}

export default Profile