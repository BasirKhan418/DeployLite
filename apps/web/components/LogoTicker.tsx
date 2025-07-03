"use client"
import { motion } from 'framer-motion'

const companies = [
  { 
    name: "Microsoft", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  { 
    name: "Google", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
  },
  { 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
  },
  { 
    name: "GitHub", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" 
  },
  { 
    name: "Docker", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" 
  },
  { 
    name: "Kubernetes", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" 
  },
  { 
    name: "React", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
  },
  { 
    name: "Node.js", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" 
  },
  { 
    name: "Python", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
  },
  { 
    name: "TypeScript", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" 
  },
]

export const LogoTicker = () => {
  return (
    <div className="bg-gray-950 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-lg text-gray-400 font-medium">
            Trusted by developers at leading companies
          </h2>
        </motion.div>

        <div className="relative">
          {/* Gradient overlays for seamless effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Infinite scrolling logos */}
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex items-center justify-center min-w-max">
              {companies.map((company, index) => (
                <div key={`set1-${index}`} className="mx-8 flex-shrink-0 group">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 w-auto opacity-40 hover:opacity-70 transition-all duration-300 filter grayscale hover:grayscale-0 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback for broken images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Second set for seamless loop */}
            <div className="flex items-center justify-center min-w-max">
              {companies.map((company, index) => (
                <div key={`set2-${index}`} className="mx-8 flex-shrink-0 group">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 w-auto opacity-40 hover:opacity-70 transition-all duration-300 filter grayscale hover:grayscale-0 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback for broken images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 18s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}