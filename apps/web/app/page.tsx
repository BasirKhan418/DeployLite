"use client"
import React,{useEffect} from 'react'
import { Hero } from 'components/Hero'
import { LogoTicker } from 'components/LogoTicker'
import { Banner } from 'components/Banner'
import { Features } from 'components/Features'
import FeaturesSection from 'components/FeatureSection'
import { ProductShowcase } from 'components/Product'
import Faqs from 'components/FAQs'
import { Pricing } from 'components/Pricingdemo'
import { CallToAction } from 'components/Calltoaction'
const page = () => {
  return (
    <div className='bg-black overflow-hidden'>
     
      <Hero />
      
      <LogoTicker />
      <Features />
    <FeaturesSection/>
    <ProductShowcase/>
    <Faqs/>
    <Pricing/>
    <CallToAction/>
  
     
     
      
      
    </div>
  )
}

export default page
