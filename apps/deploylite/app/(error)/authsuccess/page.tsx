"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, User, Lock, Mail, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
const AuthSuccessPage = () => {
    const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [title, setTitle] = useState('');
  const [description,setDescription] = useState('')
  const [color,setColor] =useState("");
  function getCookie(name:string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    //@ts-ignore
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
let username ;
let email;
  useEffect(() => {
    const reason = getCookie("reason")
    username = getCookie("username")
    email = getCookie("email");
    setTimeout(() => setShowContent(true), 300);
    if(reason=="login"){
      setTitle("Welcome back!")
      setDescription("You have successfully logged into your account.")
      setColor("indigo")
    }
    else{
        setTitle("Account Created")
        setDescription("Your new account has been successfully set up.")
        setColor("emerald")
    }
  }, []);

  const reasons = {
    login: {
      title: 'Welcome back!',
      description: 'You have successfully logged into your account.',
      icon: <Lock className="w-6 h-6" />,
      color: 'indigo'
    },
    create: {
      title: 'Account Created',
      description: 'Your new account has been successfully set up.',
      icon: <User className="w-6 h-6" />,
      color: 'emerald'
    },
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className={`w-full max-w-md transform transition-all duration-500 shadow-lg ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <CardHeader className="text-center pb-2">
          <div className={`mx-auto mb-6 text-${color}-600 font-bold text-4xl flex items-center justify-center space-x-2`}>
            <Rocket className={`w-10 h-10 ${showContent ? 'animate-bounce' : ''}`} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-500">
              DeployLite
            </span>
          </div>
          <CardTitle className={`text-3xl font-bold mb-2 text-${color}-600`}>{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-${color}-100 flex items-center justify-center ${showContent ? 'animate-pulse' : ''}`}>
            <CheckCircle className={`w-12 h-12 text-${color}-500`} />
          </div>
          <Alert className="mb-4 bg-gradient-to-r from-indigo-50 to-emerald-50 border-none">
            <AlertDescription className="text-left">
              <p className="font-semibold mb-2 text-gray-700">Account Details:</p>
              <div className="flex items-center mb-1 text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Username: {username}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {/* @ts-ignore */}
                <span>Email: {email?.replace("%40","@")}</span>
              </div>
            </AlertDescription>
          </Alert>
          <p className="text-gray-600">Your account is now active. Get ready to deploy with ease!</p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button className={`w-full bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:scale-105`}
          onClick={() => router.push('/')}>
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthSuccessPage;