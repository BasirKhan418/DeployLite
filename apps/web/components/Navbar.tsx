"use client"
import { useState } from 'react';
import Image from 'next/image';
import LogoImage from '../assets/icons/logo.svg';
import MenuIcon from '../assets/icons/menu.svg';
import { IoClose } from "react-icons/io5";
import { motion } from 'framer-motion';
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link';
import { Scale } from 'lucide-react';
export const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="fixed w-full bg-gradient-to-r from-[#341c48] to-[#270349] text-white shadow-lg z-50">
      <motion.div className="container mx-auto px-6 py-4 flex items-center justify-between" initial={{x:-300,opacity:0}} whileInView={{x:0,opacity:1}} transition={{ease:"easeIn",duration:0.3}}>
        {/* Logo */}
        <Link href={"/"}>
        <div className="relative flex items-center space-x-2">
          <Image src={LogoImage} alt="Logo" className="h-10 w-10" />
          <span className="text-lg font-semibold hover:font-bold">DEPLOYLITE</span>
        </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6 items-center">
          <motion.a href="#about" className="text-opacity-80 hover:text-opacity-100 " whileHover={{scale:1.1}} whileTap={{scale:0.5}}>About</motion.a>
          <motion.a href="#feature" className="text-opacity-80 hover:text-opacity-100 " whileHover={{scale:1.1}} whileTap={{scale:0.5}}>Features</motion.a>
          <motion.a href="#updates" className="text-opacity-80 hover:text-opacity-100 " whileHover={{scale:1.1}} whileTap={{scale:0.5}}>Updates</motion.a>
          <motion.a href="#faq" className="text-opacity-80 hover:text-opacity-100 "  whileHover={{scale:1.1}} whileTap={{scale:0.5}}>FAQs</motion.a>
          <motion.a href="#pricing" className="text-opacity-80 hover:text-opacity-100 "  whileHover={{scale:1.1}} whileTap={{scale:0.5}}>Pricing</motion.a>
          <motion.button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-opacity-90  font-semibold" whileHover={{scale:1.1}} whileTap={{scale:0.5}} transition={{ease:"easeInOut",duration:0.2}} onClick={()=>{
            window.location.href="https://app.deploylite.tech/signup"
          }}>Get for free</motion.button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleSidebar} aria-label="Open sidebar" className="focus:outline-none">
            <RxHamburgerMenu className="h-8 w-8" />
          </button>
        </div>
      </motion.div>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={toggleSidebar}></div>
      )}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-[#341c48] to-[#270349] text-white transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">DeployLite Menu</span>
          <button onClick={toggleSidebar} aria-label="Close sidebar" className="focus:outline-none">
            <IoClose className="h-8 w-8" />
          </button>
        </div>
        <nav className="mt-8 flex flex-col space-y-4 px-6">
          <Link href="#about" className="text-white text-opacity-80 hover:text-opacity-100 transition" >About</Link>
          <a href="#feature" className="text-white text-opacity-80 hover:text-opacity-100 transition">Features</a>
          <a href="#updates" className="text-white text-opacity-80 hover:text-opacity-100 transition">Updates</a>
          <a href="#faq" className="text-white text-opacity-80 hover:text-opacity-100 transition">FAQs</a>
          <a href="#pricing" className="text-white text-opacity-80 hover:text-opacity-100 transition">Pricing</a>
          <button className="mt-4 bg-white text-black py-2 px-4 rounded-lg hover:bg-opacity-90 transition" onClick={()=>{
            window.location.href="https://app.deploylite.tech/signup"
          }}>Get for free</button>
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
