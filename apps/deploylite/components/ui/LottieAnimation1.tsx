"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@/public/chatbot.json";

const LottieAnimation1 = ({ width = 300, height = 300 }) => {
  return (
    <div style={{ width, height }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieAnimation1;
