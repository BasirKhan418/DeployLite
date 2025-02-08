import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return(
    <footer className='py-5 bg-black text-white/60 border-t border-white/20 flex justify-center items-center'>
    <div className="container">
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className="text-center"> 2024 Deploylite.tech All rights are reserved</div>
        <ul className='flex justify-center gap-2.5'>
          <li><FaXTwitter/></li>
          <li><FaLinkedin/></li>
          <li><FaInstagram/></li>
          <li><FaYoutube /></li>
        </ul>
      </div>

    </div>
    </footer>
  )
};
