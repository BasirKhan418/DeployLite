"use client";
import React, { useEffect, useState } from "react";
import {Label }from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetComponent() {
  const searchurl = useSearchParams()
  const router = useRouter()
  const [form,setForm] = useState({
    confirmPassword:"",
    password:""
  })
  const [loading,setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(form.password === "" || form.confirmPassword === ""){
        toast.error('Please fill all fields')  
        return;
    }
    if(form.password !== form.confirmPassword){
        toast.error('Passwords and confirm password do not match')
        return;
    }
    if(!searchurl || searchurl.get('token') === null){
        toast.error('Invalid token')
        return;
    }
    setLoading(true)
    const res = await fetch('/api/auth/reset',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status:"reset",password:form.password,token:searchurl.get('token')})  
    })
    const result = await res.json()
    setLoading(false)
    if(result.success){
      toast.success(result.message)
      setTimeout(()=>{
       router.push('/login')
      },3000)
    }
    else{
      toast.error(result.message)
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Reset your password
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4 ">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={form.password}/>
          </LabelInputContainer>
          
          <LabelInputContainer className="mb-4 ">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="••••••••" type="password" onChange={handleChange} value={form.confirmPassword}/>
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {loading ? <LoginLoader/> : "Reset Now →"}
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetComponent />
    </Suspense>
  );
}