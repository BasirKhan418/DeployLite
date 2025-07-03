"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useId } from "react"

const features = [
  {
    title: "Enterprise Security",
    description: "Bank-grade security with SSL certificates, DDoS protection, and compliance standards. Your data is protected always."
  },
  {
    title: "Real-time Analytics",
    description: "Monitor performance, track usage, and gain insights with comprehensive analytics and reporting tools."
  },
  {
    title: "Lightning Fast",
    description: "Deploy in seconds with our optimized build pipeline and global CDN distribution for maximum speed."
  },
  {
    title: "24/7 Support",
    description: "Get expert help when you need it with our dedicated support team and comprehensive documentation."
  }
]

export const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5])

  return (
    <div className="bg-gray-950 py-20" id="product" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Intuitive Dashboard
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Monitor, manage, and deploy your applications with our clean, user-friendly interface designed for developers.
          </motion.p>
        </div>

        {/* Dashboard mockup */}
        <motion.div 
          className="relative max-w-6xl mx-auto mb-20"
          style={{ y, opacity }}
        >
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                  app.deploylite.tech
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-950">
              <img 
                src="/dash.png" 
                alt="DeployLite Dashboard" 
                className="w-full h-auto rounded-lg opacity-90"
              />
            </div>
          </div>
        </motion.div>

        {/* Aceternity Style Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ 
  title, 
  description, 
  index 
}: { 
  title: string
  description: string
  index: number 
}) => {
  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-900/50 to-gray-950/80 border border-gray-800 p-6 rounded-3xl overflow-hidden hover:border-gray-700 transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Grid size={20} />
      
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl"></div>
      
      <div className="relative z-20">
        <p className="text-lg font-bold text-white mb-4 group-hover:text-pink-200 transition-colors duration-300">
          {title}
        </p>
        <p className="text-gray-400 text-sm font-normal leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
    </motion.div>
  )
}

const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-gray-800/20 to-gray-900/20 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-pink-500/5 stroke-pink-500/10"
        />
      </div>
    </div>
  );
};

function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}