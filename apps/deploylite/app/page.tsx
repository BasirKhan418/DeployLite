"use client"
import Script from 'next/script'
import Hero from '@/utils/Banners/Hero'

const page = () => {
  return (
    <>
   <Hero/>
   <Script 
     src="https://checkout.razorpay.com/v1/checkout.js" 
     strategy="lazyOnload"
   />
    </>
  )
}

export default page
