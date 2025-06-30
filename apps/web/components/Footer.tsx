"use client"
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone, 
  Rocket,
  Heart,
  ExternalLink,
  ArrowUp
} from 'lucide-react';

const FooterLink = ({ href, children, external = false }) => (
  <motion.a
    href={href}
    target={external ? "_blank" : "_self"}
    rel={external ? "noopener noreferrer" : ""}
    className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
    whileHover={{ x: 5 }}
  >
    {children}
    {external && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
  </motion.a>
);

const SocialLink = ({ icon: Icon, href, label, color = "from-pink-500 to-cyan-500" }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-xs text-white/60 whitespace-nowrap">{label}</span>
    </div>
  </motion.a>
);

const FooterSection = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <h3 className="text-white font-semibold mb-6 text-lg">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const BackToTop = () => (
  <motion.button
    className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg z-50 hover-lift-glow"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 2 }}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
  >
    <ArrowUp className="w-5 h-5 text-white" />
  </motion.button>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "/docs", external: true },
      { label: "API Reference", href: "/api", external: true },
      { label: "Integrations", href: "/integrations", external: true },
      { label: "Changelog", href: "/changelog", external: true }
    ],
    company: [
      { label: "About Us", href: "/about", external: true },
      { label: "Careers", href: "/careers", external: true },
      { label: "Blog", href: "/blog", external: true },
      { label: "Press Kit", href: "/press", external: true },
      { label: "Contact", href: "/contact", external: true },
      { label: "Partners", href: "/partners", external: true }
    ],
    support: [
      { label: "Help Center", href: "/help", external: true },
      { label: "FAQ", href: "#faq" },
      { label: "Community", href: "/community", external: true },
      { label: "Status Page", href: "/status", external: true },
      { label: "System Requirements", href: "/requirements", external: true },
      { label: "Contact Support", href: "mailto:support@deploylite.tech", external: true }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy", external: true },
      { label: "Terms of Service", href: "/terms", external: true },
      { label: "Cookie Policy", href: "/cookies", external: true },
      { label: "GDPR", href: "/gdpr", external: true },
      { label: "Security", href: "/security", external: true },
      { label: "Compliance", href: "/compliance", external: true }
    ]
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/deploylite", label: "GitHub", color: "from-gray-700 to-gray-900" },
    { icon: Twitter, href: "https://twitter.com/deploylite", label: "Twitter", color: "from-blue-400 to-blue-600" },
    { icon: Linkedin, href: "https://linkedin.com/company/deploylite", label: "LinkedIn", color: "from-blue-600 to-blue-800" },
    { icon: Youtube, href: "https://youtube.com/deploylite", label: "YouTube", color: "from-red-500 to-red-700" }
  ];

  return (
    <>
      <footer className="bg-black border-t border-white/10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/5 to-black"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
            
            {/* Company Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <motion.svg 
                    className="w-5 h-5 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                  </motion.svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient-pink">DeployLite</h3>
                  <p className="text-xs text-white/60">Cloud Platform</p>
                </div>
              </div>
              
              <p className="text-white/70 mb-6 leading-relaxed">
                The fastest way to deploy and scale your applications. 
                Join thousands of developers who trust DeployLite for their 
                mission-critical deployments.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-white/60">
                  <Mail className="w-4 h-4 text-pink-400" />
                  <a href="mailto:hello@deploylite.tech" className="hover:text-white transition-colors">
                    hello@deploylite.tech
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>San Francisco, CA & Remote</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <SocialLink
                    key={social.label}
                    icon={social.icon}
                    href={social.href}
                    label={social.label}
                    color={social.color}
                  />
                ))}
              </div>
            </motion.div>

            {/* Product Links */}
            <FooterSection title="Product" delay={0.1}>
              {footerLinks.product.map((link) => (
                <FooterLink key={link.label} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterSection>

            {/* Company Links */}
            <FooterSection title="Company" delay={0.2}>
              {footerLinks.company.map((link) => (
                <FooterLink key={link.label} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterSection>

            {/* Support Links */}
            <FooterSection title="Support" delay={0.3}>
              {footerLinks.support.map((link) => (
                <FooterLink key={link.label} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterSection>

            {/* Legal Links */}
            <FooterSection title="Legal" delay={0.4}>
              {footerLinks.legal.map((link) => (
                <FooterLink key={link.label} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterSection>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            className="card-pro p-8 mb-12 relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.01, y: -2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-glow-pink transition-all duration-300">
                Stay Updated
              </h3>
              <p className="text-white/60 mb-6 group-hover:text-white/80 transition-colors">
                Get the latest updates, tips, and insights delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 bg-white/5 border border-white/20 rounded-lg px-4 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50 transition-all duration-300"
                />
                <motion.button
                  className="btn-glow px-6 py-3 rounded-lg font-semibold whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 mb-4 sm:mb-0">
              <span>© {currentYear} DeployLite.tech</span>
              <span>•</span>
              <span>All rights reserved</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> for developers
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-white/60">
              <motion.a
                href="/sitemap.xml"
                className="hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Sitemap
              </motion.a>
              <motion.a
                href="/rss.xml"
                className="hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                RSS
              </motion.a>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">All systems operational</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
};