"use client"
import React from 'react';
import { CheckCircle, Github } from 'lucide-react';

const AuthSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-500 p-6 text-white flex justify-center">
          <Github className="w-16 h-16" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="text-green-500 w-12 h-12 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Authentication Successful</h2>
          </div>
          <p className="text-gray-600 text-center mb-6">
            You have successfully connected your GitHub account.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              You can now use GitHub features in your application.
            </p>
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" onClick={()=>{
            window.open("/intregation","_self");
          }}>
            Continue 
          </button>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500 text-center">
            If you have any issues, please contact support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;