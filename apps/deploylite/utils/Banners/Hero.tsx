"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  PieChart,
  Activity,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppSelector } from "@/lib/hook";

const textGradient =
  "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase =
  "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const buttonPrimary =
  "bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:bg-pink-700";
const glassCard =
  "rounded-2xl bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const frameworks = [
  {
    name: "React",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    name: "Vue",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg",
  },
  {
    name: "Angular",
    logo: "https://angular.io/assets/images/logos/angular/angular.svg",
  },
  {
    name: "Next.js",
    logo:
      "https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png",
  },
  {
    name: "Svelte",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg",
  },
];

export default function DashboardHero() {
  // Get the user (assumed to be stored in Redux)
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  // Framework filter state (for demo purposes)
  const [selectedFramework, setSelectedFramework] = useState("All");

  // Deployment stats state (graph data, totals)
  const [deploymentStats, setDeploymentStats] = useState({
    chartData: [
      { name: "Jan", deployments: 400 },
      { name: "Feb", deployments: 300 },
      { name: "Mar", deployments: 500 },
      { name: "Apr", deployments: 280 },
      { name: "May", deployments: 590 },
      { name: "Jun", deployments: 800 },
    ],
    totalDeployments: 2870,
    activeProjects: 143,
  });

  // Build stats state (for donut charts)
  const [buildStats, setBuildStats] = useState({
    successfulBuildPercentage: 75,
    failedBuildPercentage: 25,
  });

  // Fetch deployment stats (graph data)
  useEffect(() => {
    async function fetchGraphData() {
      if (!user) return;
      try {
        const res = await fetch(`/api/deployment/stats?id=${user._id}`);
        const data = await res.json();
        if (data.success) {
          setDeploymentStats({
            chartData: data.chartData,
            totalDeployments: data.totalDeployments,
            activeProjects: data.activeProjects,
          });
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching deployment stats");
      }
    }

    async function fetchBuildStats() {
      if (!user) return;
      try {
        const res = await fetch(`/api/build/stats?id=${user._id}`);
        const data = await res.json();
        if (data.success) {
          setBuildStats({
            successfulBuildPercentage: data.successfulBuildPercentage,
            failedBuildPercentage: 100 - data.successfulBuildPercentage,
          });
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching build stats");
      }
    }

    fetchGraphData();
    fetchBuildStats();
  }, [user]);

  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10"></div>

      <div className="relative container mx-auto px-6 py-12 sm:px-8 lg:px-10 z-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Dashboard Header */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-3xl font-bold mb-4">
              Welcome to your{" "}
              <span className={textGradient}>DeployLite Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Monitor your deployments and project performance at a glance.
            </p>
          </motion.div>

          {/* Deployment Stats */}
          <motion.div
            className={glassCard}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BarChart2 className="mr-2 text-pink-500" /> Total Deployments
            </h2>
            <p className="text-4xl font-bold text-pink-500">
              {deploymentStats.totalDeployments.toLocaleString()}
            </p>
          </motion.div>

          {/* Active Projects */}
          <motion.div
            className={glassCard}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Activity className="mr-2 text-pink-500" /> Active Projects
            </h2>
            <p className="text-4xl font-bold text-pink-500">
              {deploymentStats.activeProjects}
            </p>
          </motion.div>

          {/* Framework Filter */}
          <motion.div
            className={glassCard}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Filter className="mr-2 text-pink-500" /> Framework Filter
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFramework("All")}
                className={`${buttonBase} ${
                  selectedFramework === "All"
                    ? buttonPrimary
                    : "bg-gray-800 text-white"
                }`}
              >
                All
              </button>
              {frameworks.map((fw) => (
                <button
                  key={fw.name}
                  onClick={() => setSelectedFramework(fw.name)}
                  className={`${buttonBase} ${
                    selectedFramework === fw.name
                      ? buttonPrimary
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <img
                    src={fw.logo || "/placeholder.svg"}
                    alt={fw.name}
                    className="w-5 h-5 mr-2"
                  />
                  {fw.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Deployment Trends Chart */}
          <motion.div
            className={`${glassCard} lg:col-span-2`}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <PieChart className="mr-2 text-pink-500" /> Deployment Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deploymentStats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="deployments"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className={glassCard}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <motion.button
                onClick={() =>
                  router.push("/project/createproject/app-platform")
                }
                className={`${buttonBase} ${buttonPrimary} w-full`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Deployment{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => router.push("/project/app-platform")}
                className={`${buttonBase} bg-gray-800 text-white w-full`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Projects
              </motion.button>
            </div>
          </motion.div>

          {/* Successful Builds Card */}
          <motion.div
            className="rounded-2xl bg-green-900/50 p-4 shadow-2xl backdrop-blur-sm border border-green-500/20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Successful Builds
            </h2>
            <div className="flex flex-col items-center">
              <RePieChart width={80} height={80}>
                <Pie
                  data={[
                    {
                      name: "Success",
                      value: buildStats.successfulBuildPercentage,
                    },
                    {
                      name: "Remaining",
                      value: 100 - buildStats.successfulBuildPercentage,
                    },
                  ]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={25}
                  outerRadius={35}
                  stroke="none"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#374151" />
                </Pie>
              </RePieChart>
              <span className="mt-2 text-xl font-bold text-green-500">
                {buildStats.successfulBuildPercentage}%
              </span>
            </div>
          </motion.div>

          {/* Failed Builds Card */}
          <motion.div
            className="rounded-2xl bg-red-900/50 p-4 shadow-2xl backdrop-blur-sm border border-red-500/20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Failed Builds
            </h2>
            <div className="flex flex-col items-center">
              <RePieChart width={80} height={80}>
                <Pie
                  data={[
                    {
                      name: "Failure",
                      value: buildStats.failedBuildPercentage,
                    },
                    {
                      name: "Remaining",
                      value: 100 - buildStats.failedBuildPercentage,
                    },
                  ]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={25}
                  outerRadius={35}
                  stroke="none"
                >
                  <Cell fill="#EF4444" />
                  <Cell fill="#374151" />
                </Pie>
              </RePieChart>
              <span className="mt-2 text-xl font-bold text-red-500">
                {buildStats.failedBuildPercentage}%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
