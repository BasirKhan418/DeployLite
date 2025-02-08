"use client"
import appScreen from "../assets/images/product.avif";
import Image from 'next/image';
import {motion , useScroll, useTransform} from 'framer-motion';
import { useEffect, useRef } from "react";
export const ProductShowcase = () => {
  const appImage = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"]

  });

const rotateX = useTransform(scrollYProgress, [0, 1], [15,0]);
const opacity = useTransform(scrollYProgress, [0, 1], [.3,1]);

  return (
    <div className="bg-black text-white bg-gradient-to-b from-black to-[#5D2CA8] py-[72px] sm:py-24 flex justify-center items-center" id="updates">
      <div className="container">
        <h2 className="text-center text-5xl font-bold tracking-tighter">Intituve interface</h2>
        <div className='max-w-xl mx-auto'>
        <p className="text-xl text-white/70 text-center mt-5 ">Deploy with ease. Our platform offers a simple, user-friendly interface that streamlines your development process, allowing you to focus on building while we handle deployment and scaling.</p>
        </div>
        <div className="flex justify-center">
        <motion.div
        style={{
          opacity: opacity,
          rotateX: rotateX,
          transformPerspective: "800px",

        }}
        >
        <img src={"/dash.png"}  ref={appImage} alt="app screen" className="mt-14 lg:h-[90vh] lg:w-[90vw] md:h-[90vh] md:w-[90vw] h-[50vh] w-[100vw] lg:object-contain object-cover md:object-contain" />
        </motion.div>
        </div>

      </div>

    </div>
  )
};
