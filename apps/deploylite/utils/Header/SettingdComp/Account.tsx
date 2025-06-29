import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hook"
import { useAppDispatch } from "@/lib/hook"
import { add } from "@/lib/features/user/User"
import { toast } from "sonner"
import LoginLoader from "@/utils/Loaders/LoginLoader"

const Account = () => {
    const router = useRouter()
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value,
        });
    };

    const twoFactorChange = async (checked: boolean) => {
        try {
            const res = await fetch('/api/settings/account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ twofactor: checked })
            })
            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                dispatch(add(result.user))
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleSubmit = async () => {
        if (form.currentPassword === "" || form.newPassword === "" || form.confirmPassword === "") {
            toast.error('Please fill all fields')
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            toast.error('New password and confirm password do not match')
            return;
        }
        setLoading(true)
        try {
            const res = await fetch('/api/settings/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword: form.currentPassword, password: form.newPassword })
            })
            const result = await res.json()
            setLoading(false)
            if (result.success) {
                toast.success(result.message)
                setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            setLoading(false)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                    Update your account settings. Set your preferred language and timezone.
                </p>
            </div>
            <Separator />
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={form.newPassword} onChange={handleChange}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                </div>
                <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <LoginLoader/> : "Change Password"}
                </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                    </div>
                </div>
                <Switch 
                    id="twoFactor" 
                    checked={user?.twofactor || false} 
                    onCheckedChange={twoFactorChange} 
                />
            </div>
        </div>
    )
}

export default Account