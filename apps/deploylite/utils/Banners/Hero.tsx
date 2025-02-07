"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cloud, Zap, Shield, CheckCircle } from "lucide-react";

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10"></div>

      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8 z-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            className="max-w-xl lg:max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Deploy with ease using{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                DeployLite
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-300">
              Streamline your deployment process and focus on what matters most
              - your code. DeployLite handles the rest.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-base font-medium text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-gray-800 px-5 py-3 text-base font-medium text-white shadow-md hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn more
              </motion.a>
            </div>
            <motion.div
              className="mt-8 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm border border-pink-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="font-bold text-lg">🎉 Special Offer!</p>
              <p className="text-gray-300">
                We've credited 500 Rs to your account for testing our platform.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:ml-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative rounded-2xl bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm border border-pink-500/20">
              <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

              <div className="flex items-center mb-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h2 className="ml-4 text-2xl font-bold">DeployLite Features</h2>
              </div>

              <ul className="space-y-6">
                {[
                  "One-click deployments",
                  "Automatic scaling",
                  "Built-in CI/CD",
                  "24/7 monitoring",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    whileHover={{ x: 10 }}
                  >
                    <CheckCircle className="h-6 w-6 text-pink-500" />
                    <span className="text-lg">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-center text-2xl font-bold mb-8">
            Trusted by innovative companies worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {[
              {
                name: "Acme Inc",
                logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b2c5714c-fae1-443b-92cf-7729524f82a5/dh68iec-c3b3df67-3152-439d-9ae0-f1e718386abe.jpg/v1/fill/w_1192,h_670,q_70,strp/4000_wb___acme_corporation_by_angleford07_dh68iec-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiJcL2ZcL2IyYzU3MTRjLWZhZTEtNDQzYi05MmNmLTc3Mjk1MjRmODJhNVwvZGg2OGllYy1jM2IzZGY2Ny0zMTUyLTQzOWQtOWFlMC1mMWU3MTgzODZhYmUuanBnIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.TRAxXyZG2Ojr5_2DTIbxJB2S8A5yjjNekLI5tk7_U5Q",
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
                logo: "data:image/png;base64,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",
              },
            ].map((company, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 w-full max-w-[150px] h-20 flex items-center justify-center border border-pink-500/20"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(236,72,153,0.3)",
                }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 py-12 shadow-2xl backdrop-blur-sm border border-pink-500/20">
            <div className="relative mx-auto max-w-2xl px-4 text-center">
              <figure>
                <blockquote className="mt-6 text-xl font-semibold text-white sm:text-2xl sm:leading-8">
                  <p>
                    "DeployLite has revolutionized our deployment process. It's
                    fast, reliable, and incredibly easy to use. Our team's
                    productivity has skyrocketed since we started using it."
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-base text-gray-300">
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="mt-1">CTO of TechCorp</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
