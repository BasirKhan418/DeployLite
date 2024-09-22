import React from 'react'
import SignupForm from '@/components/example/signup-form-demo'
import CheckAuth from '@/actions/CheckAuth'
import { redirect } from 'next/navigation'
const page = () => {
  const result = CheckAuth()
  if(result){
  redirect('/')
  }
  return (
    <div className='flex justify-center items-center h-[100vh] bg-gradient-to-br from-gray-900 to-indigo-800'>
      <div className='absolute'>
      <SignupForm /> 
      </div>
     
    </div>
  )
}

export default page
