"use client"
import React from 'react'
import SignupForm from '@/components/example/signup-form-demo'
const page = () => {

  return (
    <div className='flex justify-center items-center h-[110vh] bg-gradient-to-br from-gray-900 to-indigo-800'>
      <div className='absolute'>
      <SignupForm /> 
      </div>
     
    </div>
  )
}

export default page
