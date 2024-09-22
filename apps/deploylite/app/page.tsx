
import React, { useEffect } from 'react'
import Hero from '@/utils/Banners/Hero'
import CheckAuth from '@/actions/CheckAuth'
import { redirect } from 'next/navigation'
const page = () => {
  const result = CheckAuth()
  if(!result){
  redirect('/login')
  }
  return (
    <>
    <Hero/>
    </>
  )
}

export default page
