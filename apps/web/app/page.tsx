"use client"
import React, { useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { LogoTicker } from '@/components/LogoTicker'
import { Features } from '@/components/Features'
import FeaturesSection from '@/components/FeatureSection'
import { ProductShowcase } from '@/components/Product'
import Faqs from '@/components/FAQs'
import { Pricing } from '@/components/pricing'
import { CallToAction } from '@/components/Calltoaction'

const page = () => {
  // Add scroll reveal animation
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all scroll-reveal elements
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className='bg-black overflow-hidden relative'>
      {/* Background Grid */}
      <div className="fixed inset-0 grid-glow opacity-30 pointer-events-none"></div>
      
      {/* Particle Background */}
      <div className="particles-container fixed inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        
        <div className="scroll-reveal">
          <LogoTicker />
        </div>
        
        <div className="scroll-reveal">
          <Features />
        </div>
        
        <div className="scroll-reveal">
          <FeaturesSection />
        </div>
        
        <div className="scroll-reveal">
          <ProductShowcase />
        </div>
        
        <div className="scroll-reveal">
          <Faqs />
        </div>
        
        <div className="scroll-reveal">
          <Pricing />
        </div>
        
        <div className="scroll-reveal">
          <CallToAction />
        </div>
      </div>

      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora opacity-5"></div>
        <div className="aurora opacity-5" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  )
}

export default page