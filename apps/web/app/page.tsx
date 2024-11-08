import React from 'react'
import { Hero } from 'components/Hero'
import { LogoTicker } from 'components/LogoTicker'
import { Banner } from 'components/Banner'
import { Features } from 'components/Features'
import { ProductShowcase } from 'components/ProductShowcase'
const page = () => {
  return (
    <>
      <Hero />
      
      <LogoTicker />
      <Features />
      <ProductShowcase/>
    </>
  )
}

export default page
