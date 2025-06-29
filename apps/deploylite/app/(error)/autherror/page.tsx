import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';

const AuthErrorPage = async () => {
    const cook = await cookies();
    let msg = cook.get("msg");
    let message = msg?.value;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8 flex justify-center items-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-inner flex items-center justify-center">
            {/* Placeholder for your actual logo */}
            <svg className="w-16 h-16 sm:w-24 sm:h-24 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 6a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Authentication Failed</h2>
          </div>
          <p className="text-gray-600 mb-8 text-lg">{"An error occurred during authentication"}{" "}{message}</p>
          <a
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center no-underline"
            href='/login'
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </a>
        </div>
      </div>
      <p className="mt-8 text-gray-600 text-sm">
        If you continue to experience issues, please contact support.
      </p>
    </div>
  );
};

export default AuthErrorPage;