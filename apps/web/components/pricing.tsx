'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

interface PricingPlan {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: 'primary' | 'secondary' | 'outline'
}

const plans: PricingPlan[] = [
  {
    name: "Pro",
    description: "Ideal for startup & growing businesses.",
    monthlyPrice: 45,
    yearlyPrice: 40,
    features: [
      '20GB bandwidth.',
      '150GB per month.',
      'Advanced CDN with image optimization.',
      'SSL certificates for all domains.',
      'Full analytics dashboard.',
      'Community support',
      'SSL certificates included',
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: 'outline'
  },
  {
    name: "Starter",
    description: "Perfect for side Projects.",
    monthlyPrice: 25,
    yearlyPrice: 20,
    popular: true,
    features: [
      '5GB bandwidth',
      '50GB per month',
      'CDN (Content DElivery network) included.',
      'Automated SSL certificates.',
      'Community Support.',
      'Advanced analytics',
      'CI/CD integrations',
      'Staging environments',
    ],
    buttonText: "Get Started as a beginner.",
    buttonVariant: 'primary'
  },
  {
    name: "Enterprise",
    description: "For larger teams with high performance needs. Secure and scalable.",
    monthlyPrice: 60,
    yearlyPrice: 50,
    features: [
      '100GB bandwidth',
      'Unlimited Projects',
      'Dedicated infrastructure',
      'Custom SLAs',
      '24/7 support',
      'Enterprise integrations',
      'Advanced security features',
      'White-label options',
      'Priority builds',
      'Custom onboarding',
    ],
    buttonText: "Contact Sales",
    buttonVariant: 'secondary'
  }
]

interface PricingTabProps {
  yearly: boolean
  popular?: boolean
  planName: string
  price: {
    monthly: number
    yearly: number
  }
  planDescription: string
  features: string[]
  buttonText: string
  buttonVariant: 'primary' | 'secondary' | 'outline'
  index: number
}

function PricingTab(props: PricingTabProps) {
  const currentPrice = props.yearly ? props.price.yearly : props.price.monthly
  const savings = props.price.monthly > 0 ? Math.round(((props.price.monthly - props.price.yearly) / props.price.monthly) * 100) : 0

  const getButtonStyles = () => {
    switch (props.buttonVariant) {
      case 'primary':
        return 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg'
      case 'secondary':
        return 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
      case 'outline':
        return 'bg-transparent hover:bg-gray-900/50 text-white border border-gray-700 hover:border-pink-500'
      default:
        return 'bg-pink-500 hover:bg-pink-600 text-white'
    }
  }

  return (
    <motion.div 
      className="relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: props.index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className={`relative flex flex-col h-full p-8 rounded-2xl border transition-all duration-200 ${
        props.popular 
          ? 'bg-gray-900/80 border-pink-500 ring-1 ring-pink-500/20 shadow-lg shadow-pink-500/10' 
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70'
      }`}>
        {props.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 mr-1" />
              Most Popular
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="text-gray-300 font-semibold mb-2">{props.planName}</div>
          <div className="flex items-baseline mb-4">
            <span className="text-gray-400 text-2xl font-bold">$</span>
            <span className="text-white text-5xl font-bold">{currentPrice}</span>
            <span className="text-gray-400 font-medium ml-2">/month</span>
          </div>
          
          {props.yearly && props.price.monthly > 0 && savings > 0 && (
            <div className="mb-4">
              <span className="inline-flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Save {savings}% annually
              </span>
            </div>
          )}
          
          <div className="text-gray-300 text-sm mb-6 leading-relaxed">{props.planDescription}</div>
          
          <motion.button 
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-150 ${getButtonStyles()}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {props.buttonText}
          </motion.button>
        </div>

        <div className="flex-1">
          <div className="text-white font-semibold mb-4">Everything included:</div>
          <ul className="space-y-3">
            {props.features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true)

  return (
    <div className="bg-gray-950 py-20" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Choose Your Plan
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Choose the plan that best fits your needs. Whether you're just starting out or running a large-scale project, we have options tailored to your requirements.
          </motion.p>

          {/* Pricing toggle */}
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative flex w-full max-w-xs p-1 bg-gray-900 border border-gray-800 rounded-lg">
              <motion.span 
                className="absolute inset-y-1 w-1/2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md shadow-sm"
                animate={{ x: isAnnual ? 0 : "100%" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <button 
                className={`relative flex-1 text-sm font-medium h-10 rounded-md transition-colors duration-150 ease-in-out ${
                  isAnnual ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`} 
                onClick={() => setIsAnnual(true)}
              >
                Yearly
                <span className={`ml-2 text-xs ${isAnnual ? 'text-pink-200' : 'text-gray-500'}`}>
                  (-20%)
                </span>
              </button>
              <button 
                className={`relative flex-1 text-sm font-medium h-10 rounded-md transition-colors duration-150 ease-in-out ${
                  isAnnual ? 'text-gray-400 hover:text-gray-300' : 'text-white'
                }`} 
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <PricingTab
              key={plan.name}
              yearly={isAnnual}
              popular={plan.popular}
              planName={plan.name}
              price={{ yearly: plan.yearlyPrice, monthly: plan.monthlyPrice }}
              planDescription={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              index={index}
            />
          ))}
        </div>

        {/* Enterprise contact section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need something custom?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer custom enterprise solutions with dedicated support, custom integrations, SLAs, and tailored pricing for teams with specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Enterprise Sales
              </motion.button>
              <motion.button 
                className="text-gray-300 hover:text-white font-medium transition-colors duration-150"
                whileHover={{ x: 5 }}
              >
                Schedule a Demo →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}