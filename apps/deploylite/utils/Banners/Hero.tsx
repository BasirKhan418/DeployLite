"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cloud, CheckCircle } from "lucide-react";

const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase = "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const buttonPrimary = "bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:bg-pink-700";
const buttonSecondary = "bg-gray-800 text-white shadow-md hover:bg-gray-700";
const glassCard = "rounded-2xl bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm border border-pink-500/20";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Hero() {
  const features = [
    "One-click deployments",
    "Automatic scaling",
    "Built-in CI/CD",
    "24/7 monitoring",
  ];

  const companies = [
    {
      name: "Acme Inc",
      logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b2c5714c-fae1-443b-92cf-7729524f82a5/dh68iec-c3b3df67-3152-439d-9ae0-f1e718386abe.jpg",
    },
    {
      name: "Globex",
      logo: "https://yt3.googleusercontent.com/UMGZZMPQkM3kGtyW4jNE1GtpSrydfNJdbG1UyWTp5zeqUYc6-rton70Imm7B11RulRRuK521NQ=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      name: "Hooli",
      logo: "https://study.com/cimages/multimages/16/untitled_design_454963738386560630025.png",
    },
    {
      name: "Pied Piper",
      logo: "https://logos-world.net/wp-content/uploads/2024/10/Vercel-Logo.jpg",
    },
    {
      name: "Umbrella",
      logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADh...",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10"></div>

      <div className="relative container mx-auto px-6 py-12 sm:px-8 lg:px-10 z-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Hero Content */}
          <motion.div
            className="max-w-xl"
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Deploy with ease using <span className={textGradient}>DeployLite</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-300">
              Streamline your deployment process and focus on what matters most - your code.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#"
                className={`${buttonBase} ${buttonPrimary}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className={`${buttonBase} ${buttonSecondary}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn more
              </motion.a>
            </div>
          </motion.div>

          {/* Feature Box */}
          <motion.div className="lg:ml-auto" initial="hidden" animate="visible" variants={fadeInUp}>
            <div className={glassCard}>
              <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

              <div className="flex items-center mb-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h2 className="ml-4 text-2xl font-bold">DeployLite Features</h2>
              </div>

              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-6 w-6 text-pink-500" />
                    <span className="text-lg">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Trusted Companies */}
        <motion.div className="mt-20 text-center" variants={fadeInUp} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold mb-8">Trusted by innovative companies worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 w-full max-w-[150px] h-20 flex items-center justify-center border border-pink-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <img src={company.logo} alt={company.name} className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
