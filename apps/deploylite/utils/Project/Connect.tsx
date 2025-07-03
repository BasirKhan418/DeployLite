"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Rocket, Lock, RefreshCw, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Connect() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
      <div className="absolute  bg-black"></div>
      <div className="relative z-10">
        

        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
              Connect with GitHub
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Supercharge your deployment workflow with GitHub integration
            </p>
            <Link href={"/intregation"}>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-100 py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Github className="mr-2 h-5 w-5" />
              Connect with GitHub
              <ChevronRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-transparent hover:bg-opacity-20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl mb-2 text-indigo-300">
                  <Rocket className="mr-2" />
                  Faster Deployments
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Automate your workflow and deploy with a single push
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">
                  By connecting your GitHub account, you can trigger deployments automatically when you push to your repository. This streamlines your workflow and saves you valuable time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-transparent hover:bg-opacity-20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl mb-2 text-indigo-300">
                  <Lock className="mr-2" />
                  Secure Integration
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your code stays safe with our secure GitHub integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">
                  We use industry-standard OAuth protocols to ensure your GitHub account and code remain secure. We only request the permissions necessary for deployment.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-transparent hover:bg-opacity-20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl mb-2 text-indigo-300">
                  <RefreshCw className="mr-2" />
                  Seamless Synchronization
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Keep your deployments in sync with your GitHub repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">
                  Our platform stays in constant sync with your GitHub repositories. Any changes you make are reflected in your deployments, ensuring your live site is always up-to-date with your latest code.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transform rotate-3 scale-105 z-0"></div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="Dashboard mockup"
                className="rounded-lg shadow-2xl relative z-10"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-indigo-300">Powerful Dashboard</h2>
              <p className="text-gray-200">
                Our intuitive dashboard gives you full control over your deployments. Monitor your sites, view logs, and manage your GitHub integrations all in one place.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight className="text-indigo-400 mr-2" />
                  <span>Real-time deployment status</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="text-indigo-400 mr-2" />
                  <span>Detailed performance metrics</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="text-indigo-400 mr-2" />
                  <span>Easy rollback functionality</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Trusted by developers worldwide</h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-full p-4 hover:bg-opacity-20 transition-all duration-300">
                  <Image
                    src={`/placeholder.svg?height=50&width=120&text=Logo${i}`}
                    width={120}
                    height={50}
                    alt={`Company logo ${i}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}