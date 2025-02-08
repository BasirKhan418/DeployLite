"use client"
import React, { useEffect } from 'react'
import Hero from '@/utils/Banners/Hero'

const page = () => {
  return (
    <>
   <Hero/>
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  )
}

export default page
