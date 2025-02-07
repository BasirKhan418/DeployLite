"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Zap, Shield, CheckCircle } from "lucide-react";
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            className="max-w-xl lg:max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Deploy with ease using{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                DeployLite
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-300">
              Streamline your deployment process and focus on what matters most
              - your code. DeployLite handles the rest.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-medium text-blue-600 shadow-md hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-5 py-3 text-base font-medium text-white shadow-md hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
              >
                Learn more
              </a>
            </div>
            <motion.div
              className="mt-8 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="font-bold text-lg">🎉 Special Offer!</p>
              <p className="text-white">
                We've credited 500 Rs to your account for testing our platform.
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            className="lg:ml-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
              <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0"></div>
              <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0"></div>
              <div className="flex items-center mb-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
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
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  >
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
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
                logo: "/placeholder.svg?height=40&width=120",
              },
              { name: "Globex", logo: "/placeholder.svg?height=40&width=120" },
              { name: "Hooli", logo: "/placeholder.svg?height=40&width=120" },
              {
                name: "Pied Piper",
                logo: "/placeholder.svg?height=40&width=120",
              },
              {
                name: "Umbrella",
                logo: "/placeholder.svg?height=40&width=120",
              },
            ].map((company, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full max-w-[150px] h-20 flex items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,255,255,0.2)",
                }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain"
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-900/30 py-12 shadow-2xl backdrop-blur-sm">
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
