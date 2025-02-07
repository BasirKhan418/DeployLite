"use client";
import React, { useEffect, useState } from "react";
import {Label }from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { cn } from "@/lib/utils";
import { Toaster,toast } from "sonner";
import { useRouter } from "next/navigation";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import { Suspense } from "react";
import { useAppSelector } from "@/lib/hook";
const user = useAppSelector((state) => state.user.user)
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
 function ResetComponent() {
const searchurl = useSearchParams()
  const router = useRouter()
  //all aplication states
  const [form,setForm] = useState({
   otp:"",
  })
  //useEffect for checkingn if user is authenticated or not

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
    if(form.otp==""){
      toast.error('Please enter the otp sent to your email.')
      setLoading(false)
      return
    }
    const res = await fetch('/api/auth/otp',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({otp:form.otp,token:searchurl.get('token')})  
    })
    const result = await res.json()
    setLoading(false)
    if(result.success){
      toast.success(result.message)
      setTimeout(()=>{
       window.open("/","_self")
      },2000)
    }
    else{
      toast.error(result.message)
    }

  };

  const handleResend = async() => {
  try{
    setLoading(true);
   let data = {email:user.email,status:"resend",name:user.name,phone:user.phone}
   let res = await fetch('/api/auth/resend',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
    let result = await res.json()
    setLoading(false);
    if(result.success){
      toast.success(result.message)
    }
    else{
      toast.error(result.message)
    }
  }
  catch(err){
    toast.error('Error occured while resending otp');
  }
  }
  return (
    <div className="flex justify-center items-center h-[100vh]">
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <Toaster position="top-right"/>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Enter your otp (one time password)
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Two factor authentication is enabled on your account. Please enter the otp sent to your email. For accessing your account.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
       
        <LabelInputContainer className="mb-4 ">
        
          <Label htmlFor="otp">OTP</Label>
          
          <Input id="otp" placeholder="XXXX" type="number" onChange={handleChange} value={form.otp}/>
        </LabelInputContainer>
        
        
      

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
         {loading ? <LoginLoader/> : <ButtonText/>}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
        
      
        </div>
      </form>
      <div className="m-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 ">Didn't get the otp? <a href="#" className="underline text-green-500 mx-1">Resend OTP</a>
      </p>
      </div>
      <div className="m-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 ">Didn't get the otp? <a href="#" className="underline text-green-500 mx-1">Send using Whatsapp</a>
      </p>
      </div>
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
const ButtonText = ()=>{
  return (
    <>Login Now&rarr;</>
  )
}