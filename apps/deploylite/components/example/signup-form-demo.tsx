"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useState } from "react";
import Head from "next/head";
import LoginLoader from "@/utils/Loaders/LoginLoader";

export default function SignupForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(form.firstname === "" || form.lastname === "" || form.email === "" || form.password === "" || form.confirmPassword === ""){
      toast.error('Please fill all fields')  
      return;
    }
    if(form.password !== form.confirmPassword){
      toast.error('Passwords and confirm password do not match')
      return;
    }
    
    const data = {name:form.firstname+" "+form.lastname,email:form.email.toLowerCase(),password:form.password}
    setLoading(true)
    const res = await fetch('/api/auth/signup',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
    })
    const result = await res.json()
    setLoading(false)
    
    if(result.success){
      toast.success(result.message)
      setTimeout(()=>{
        router.push('/verifyemail?token='+result.token);
      },3000)
      setForm({
       firstname: "",
       lastname: "",
       email: "",
       password: "",
       confirmPassword: "",
     })
   }
   else if(!result.verify){
     toast.error(result.message)
     setTimeout(()=>{
       router.push('/verifyemail?token='+result.token);
     },3000)
   }
   else{
     toast.error(result.message)
   }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to DeployLite
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create an account to get started with DeployLite and start deploying your application.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="John" type="text" onChange={handleChange} value={form.firstname} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Doe" type="text" onChange={handleChange} value={form.lastname}/>
          </LabelInputContainer>
        </div>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="john@deploylite.tech" type="email" onChange={handleChange} value={form.email} />
        </LabelInputContainer>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={form.password}/>
        </LabelInputContainer>
        
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Your confirmation password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            onChange={handleChange} 
            value={form.confirmPassword}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? <LoginLoader /> : "Sign up →"}
          <BottomGradient />
        </button>
        
        <div className="flex justify-center items-center mt-4">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Already have an account? 
            <Link href="/login" className="underline text-green-500 mx-1">Login Now</Link>
          </span>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={()=>{
              let url  = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}&response_type=code&access_type=offline`
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