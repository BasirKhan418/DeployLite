"use client"
import React, { useEffect } from 'react';
import { tailspin } from 'ldrs';

export default function LoginLoader() {
  useEffect(() => {
    tailspin.register();
  }, []);

return(
    <span className="ml-2 flex justify-center items-center"><l-tailspin
    size="30"
    stroke="4"
    speed="1" 
    color="white" 
  ></l-tailspin></span>
)
}
