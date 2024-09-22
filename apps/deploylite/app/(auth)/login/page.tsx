"use client"
import React, { useEffect } from "react";
import Login from "@/components/example/login";


const page = () => {
  
  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-br from-gray-900 to-indigo-800">
      <div className="absolute">
      <Login />
      </div>
    </div>
  );
};

export default page;
