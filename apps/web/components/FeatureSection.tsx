"use client";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Zap,
  DollarSign,
  Cloud,
  Route,
  HelpCircle,
  Settings,
  Heart
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Built for developers",
      description: "Developer-first platform with intuitive tools and APIs.",
      icon: <Terminal className="w-6 h-6" />,
    },
    {
      title: "Ease of use",
      description: "Deploy with one click. Simple as that.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Competitive pricing",
      description: "Best market rates. No hidden fees. Free to start.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "99.9% Uptime",
      description: "Enterprise-grade reliability you can trust.",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      title: "Scalable architecture",
      description: "Auto-scale from zero to millions of users.",
      icon: <Route className="w-6 h-6" />,
    },
    {
      title: "24/7 Support",
      description: "Expert help when you need it most.",
      icon: <HelpCircle className="w-6 h-6" />,
    },
    {
      title: "Money-back guarantee",
      description: "30-day refund if you're not satisfied.",
      icon: <Settings className="w-6 h-6" />,
    },
    {
      title: "And much more",
      description: "CI/CD, databases, analytics, and everything else.",
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-gray-950 py-20" id="feature">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose DeployLite?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to deploy, scale, and manage your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-800",
        (index === 0 || index === 4) && "lg:border-l border-gray-800",
        index < 4 && "lg:border-b border-gray-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-800/50 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-800/50 to-transparent pointer-events-none" />
      )}
      
      <div className="mb-4 relative z-10 px-10 text-gray-400">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-700 group-hover/feature:bg-pink-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 max-w-xs relative z-10 px-10 leading-relaxed">
        {description}
      </p>
    </div>
  );
};