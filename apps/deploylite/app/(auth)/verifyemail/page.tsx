"use client"
import React, { useEffect ,useState} from 'react'
import { CheckCircle,Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoginLoader from '@/utils/Loaders/LoginLoader';
import { Suspense } from 'react';

const PageComponent = () => {
    const [loading, setLoading] = useState(false)
    const Search = useSearchParams()
    const router = useRouter()

    const SendEmail = async()=>{
        setLoading(true)
        let token = Search?.get('token')
        const res = await fetch('/api/auth/verify',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token,status:"resend"})
        })
        const result = await res.json()
        setLoading(false)
        if(result.success){
          toast.success(result.message) 
        }
        else{
            toast.error(result.message)
        }
    }

    const VerifyUser = async()=>{
        let token = Search?.get('token')
        setLoading(true)
        const res = await fetch('/api/auth/verify',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token,status:"verify"})
        })
        const result = await res.json()
        setLoading(false)
        console.log(result)
        if(result.success){
          toast.success(result.message+" "+"Redirecting to login page...")
          setTimeout(()=>{
            router.push('/login');
          },3000)
        }
        else{
            toast.error(result.message)
        }
    }

    useEffect(()=>{
        VerifyUser()
    },[])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <Mail className="text-indigo-600 w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Verify Your Email
              </h2>
              <p className="text-center text-gray-600 mb-6">
                We've sent a verification email to your inbox. Please click the link in the email to confirm your account.
              </p>
              <div className="bg-indigo-100 rounded-lg p-4 flex items-center mb-6">
                <CheckCircle className="text-indigo-600 w-6 h-6 mr-3 flex-shrink-0" />
                <p className="text-sm text-indigo-700">
                  A verification link has been sent to your email address.
                </p>
              </div>
              <button 
                className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out" 
                onClick={SendEmail}
              >
                {loading ? <LoginLoader/> : "Resend Email"}
              </button>
            </div>
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Didn't receive the email? Check your spam folder or <a href="mailto:support@deploylite.tech" className="text-indigo-600 hover:underline" target='_blank'>contact support</a>. <span className='font-semibold text-gray-600'>If verified please reload the page.</span>
              </p>
            </div>
          </div>
        </div>
    )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageComponent />
    </Suspense>
  );
}