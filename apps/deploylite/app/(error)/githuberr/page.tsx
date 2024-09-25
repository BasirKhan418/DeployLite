"use client"
import React from 'react';
import { AlertOctagon, Github, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
const AuthErrorPage = () => {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-500 p-6 text-white flex justify-center">
          <Github className="w-16 h-16" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <AlertOctagon className="text-red-500 w-12 h-12 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Authentication Failed</h2>
          </div>
          <p className="text-gray-600 text-center mb-6">
            We encountered an error while trying to authenticate your GitHub account.
          </p>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error Details:</p>
            <p>Unable to connect to GitHub servers. Please check your internet connection and try again.</p>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center" onClick={()=>{
                router.push("/intregation");
            }}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out" onClick={()=>{
                window.open("mailto:support@deploylite.tech");
            }}>
              Contact Support
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500 text-center">
            If the problem persists, please contact support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;