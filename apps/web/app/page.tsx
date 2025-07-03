"use client"
import React from 'react'
import { Hero } from '@/components/Hero'
import { LogoTicker } from '@/components/LogoTicker'
import { Features } from '@/components/Features'
import FeaturesSection from '@/components/FeatureSection'
import  TechnologiesSection  from '@/components/TechnologiesSection'
import { ProductShowcase } from '@/components/Product'
import Faqs from '@/components/FAQs'
import  PricingTable  from '@/components/pricing'
import { CallToAction } from '@/components/Calltoaction'

const page = () => {
  return (
    <div className='bg-gray-950 min-h-screen'>
      <Hero />
      <LogoTicker />
      <Features />
      <FeaturesSection/>
      <TechnologiesSection />
      <ProductShowcase/>
      <Faqs/>
      <PricingTable />
      <CallToAction/>
    </div>
  )
}

export default page