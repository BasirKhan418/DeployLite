"use client"
import HelixImage from '../assets/images/helix2.png'
import EmojiImage from '../assets/images/emojistar.png'
import Image from 'next/image';
import {toast,Toaster} from "react-hot-toast"
import { motion, useScroll, useTransform } from 'framer-motion';
import React,{useState,useRef} from "react"
export const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
const [input,setInput] = useState("")
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const handleChange=(e:any)=>{
 setInput(e.target.value);
  }
  //handle submit
  const handleSubmit=()=>{
    if(input==""){
        toast.error("Please Enter Your Email !")
        return;
    }
    toast.success("Redirecting to Login/Signup Page.")
    window.location.href=`https://app.deploylite.tech/signup?email=${input}`
  }
  return (
    <div className="bg-black text-white py-[72px] sm:py-24 flex justify-center items-center" ref={containerRef}>
    <Toaster
  position="bottom-left"
  reverseOrder={false}
/>
      <div className="container max-w-xl relative">
      <motion.div style={{translateY}}>
      <Image src={HelixImage} alt="helix" className="absolute top-6 left-[calc(100%+36px)]" />
      </motion.div>
      <motion.div style={{translateY}}>
       
      <Image src={EmojiImage} alt="emoji" className="absolute -top-[120px] right-[calc(100%+30px)]" />
      </motion.div>
       

        <h2 className="font-bold text-5xl sm:text-6xl tracking-tighter">Get Instant Access</h2>
        <p className="text-xl text-white/70  mt-5">Start deploying your web apps instantly with our easy-to-use platform. No setup required—just fast, reliable hosting at your fingertips. Sign up now!</p>
        <div className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row">
          <input type="email" placeholder="user@deploylite.tech" className="h-12 bg-white/20 rounded-lg px-5 font-medium placeholder:text-[#9CA3AF] sm:flex-1" onChange={handleChange}/>
          <motion.button className="bg-white text-black h-12 rounded-lg px-5 font-semibold" whileHover={{scale:1.1}} whileTap={{scale:0.8}} transition={{ease:"easeIn"}} onClick={handleSubmit}>Get access</motion.button>
        </div>
      </div>


    </div>
  )
};
