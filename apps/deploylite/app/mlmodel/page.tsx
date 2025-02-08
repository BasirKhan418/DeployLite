"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const textGradient =
  "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase =
  "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const buttonPrimary =
  "bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:bg-pink-700";
const glassCard =
  "rounded-2xl bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20";

// Sample ML Models data with pricing and features
const models = [
  {
    name: "DeepSeek",
    logo: "https://miro.medium.com/v2/resize:fit:1200/1*tlUlwc-ABsXvhFjK3JpC9g.png", // update with your logo path or URL
    price: "$49/month",
    description: "Cutting-edge search capabilities for your ML solutions.",
    features: ["Fast search", "Semantic understanding", "High precision"],
  },
  {
    name: "Ollama",
    logo: "https://miro.medium.com/v2/resize:fit:695/1*UnUo_KuVO3gVcrwPqiAzAg.png",
    price: "$79/month",
    description: "Robust conversational AI powered by advanced NLP.",
    features: ["Conversational AI", "Natural language processing", "Scalable"],
  },
  {
    name: "Gemini",
    logo: "https://media.aidigitalx.com/2023/12/Googles-Gemini-AI-1200x675.webp",
    price: "$99/month",
    description: "Unlock powerful ML features with blazing speed and reliability.",
    features: ["Next-gen ML", "Real-time analytics", "Seamless integration"],
  },
];

export default function MLModelsPricingPage() {
  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen py-12">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10" />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-10 z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${textGradient}`}>
            ML Models API Keys
          </h1>
          <p className="text-xl text-gray-300">
            Choose the perfect API key to integrate state-of-the-art ML features into
            your application.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              className={glassCard}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={model.logo}
                  alt={model.name}
                  className="w-20 h-20 mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{model.name}</h2>
                <p className="text-gray-300 text-center mb-4">
                  {model.description}
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-pink-500">
                    {model.price}
                  </span>
                </div>
                <ul className="mb-6 space-y-1">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400">
                      • {feature}
                    </li>
                  ))}
                </ul>
               
                  <a  href={`/purchase/${model.name.toLowerCase()}`} className={`${buttonBase} ${buttonPrimary}`}>
                    Get API Key <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
