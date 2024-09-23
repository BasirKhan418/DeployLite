"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Toaster,toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function Login() {
  const router = useRouter()
  //all aplication states
  const [form,setForm] = useState({
    email:"",
    password:""
  })
  const [loading,setLoading] = useState(false)
  //handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const res = await fetch('/api/auth/login',{
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
      setTimeout(()=>{
       window.open("/","_self");
      },2000)
    }
    else{
      toast.error(result.message)
    }

  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <Toaster position="top-right"/>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to DeployLite
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to your account to get started with DeployLite and start deploying your application.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="basir@deploylite.tech" type="email" onChange={handleChange} value={form.email}/>
        </LabelInputContainer>
        <div className="flex justify-end absolute right-10 mb-8">
          <Link href="/forgot" className="text-sm text-neutral-700 dark:text-neutral-300 hover:underline">Forgot password?</Link>
        </div>
        <LabelInputContainer className="mb-4 ">
        
          <Label htmlFor="password">Password</Label>
          
          <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={form.password}/>
        </LabelInputContainer>
        
      

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
         {loading ? <LoginLoader/> : <ButtonText/>}
          <BottomGradient />
        </button>
        <div className="flex justify-center items-center mt-4">
          <span className="text-sm text-neutral-700 dark:text-neutral-300 ">Don’t have an account? <Link href="/signup" className="underline text-green-500 mx-1">Create an account</Link>
        </span>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
        
        <button
            className=" g-signin2 relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              data-onsuccess="onSignIn"
              type="button"
              onClick={()=>{
              let url  = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}&response_type=${"code"}&access_type=${"offline"}`
              window.open(url,"_self");

              }}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
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

const ButtonText = ()=>{
  return (
    <>Login &rarr;</>
  )
}