"use client";

import type React from "react";
import { motion } from "framer-motion";

const Page: React.FC = () => {
  return (
    <div className="flex h-screen -mt-10 bg-gradient-to-br from-black via-black to-pink-900 text-gray-100 p-8">
      <div className="w-full max-w-8xl mx-auto flex rounded-2xl overflow-hidden  border-m relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-pink-600 opacity-10"></div>
        <div className="flex h-full w-full relative z-10">
          {/* Left Iframe Section */}
          <div className="w-1/2 p-6 flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[700px] rounded-lg overflow-hidden border border-pink-600 shadow-lg relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black to-pink-500 opacity-10"></div>
              <iframe
                src=""
                className="w-full h-full border-none relative z-10"
                title="Automation Preview Left"
              />
            </motion.div>
          </div>

          {/* Right Iframe Section */}
          <div className="w-1/2 p-6 flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[700px] rounded-lg overflow-hidden border border-pink-600 shadow-lg relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black to-pink-500 opacity-10"></div>
              <iframe
                src=""
                className="w-full h-full border-none relative z-10"
                title="Automation Preview Right"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
