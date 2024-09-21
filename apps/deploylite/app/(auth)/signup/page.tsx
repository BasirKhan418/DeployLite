import React from 'react'
import SignupForm from '@/components/example/signup-form-demo'
import HackerBackground from '@/utils/background/HackerBackground'
const page = () => {
  return (
    <div className='flex justify-center items-center h-[100vh] bg-gradient-to-br from-gray-900 to-indigo-800'>
      <HackerBackground />
      <div className='absolute'>
      <SignupForm /> 
      </div>
     
    </div>
  )
}

export default page
