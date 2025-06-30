"use client"
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Shield, Zap, CreditCard, Users, Settings, Globe } from "lucide-react";

const faqData = [
  {
    category: "Getting Started",
    icon: Zap,
    color: "from-blue-500 to-purple-600",
    questions: [
      {
        question: "How do I get started with DeployLite?",
        answer: "Getting started is simple! Sign up for a free account, connect your repository, and deploy your first application in under 5 minutes. Our setup wizard guides you through the entire process with zero configuration required."
      },
      {
        question: "What programming languages and frameworks do you support?",
        answer: "We support all major programming languages including Node.js, Python, Ruby, PHP, Go, Java, and .NET. Popular frameworks like React, Vue, Angular, Django, Laravel, and Rails are fully supported with automatic detection and optimization."
      },
      {
        question: "Do I need a credit card to start?",
        answer: "No credit card required! Start with our generous free tier that includes 100GB bandwidth, 3 projects, and community support. Upgrade anytime as your needs grow."
      }
    ]
  },
  {
    category: "Pricing & Plans",
    icon: CreditCard,
    color: "from-green-500 to-teal-600",
    questions: [
      {
        question: "What payment options are available?",
        answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, bank transfers, and cryptocurrency. Enterprise customers can also pay via invoice with NET-30 terms."
      },
      {
        question: "How is pricing structured for teams?",
        answer: "Our pricing is per seat, per month with unlimited projects. Team plans start at $25/month per user and include advanced collaboration tools, priority support, and enhanced security features. Volume discounts available for 10+ users."
      },
      {
        question: "Can I switch plans at any time?",
        answer: "Absolutely! Upgrade or downgrade your plan instantly. Changes are prorated automatically, and you'll only pay for what you use. Downgrades take effect at the next billing cycle to ensure uninterrupted service."
      }
    ]
  },
  {
    category: "Security & Compliance",
    icon: Shield,
    color: "from-red-500 to-pink-600",
    questions: [
      {
        question: "How do you ensure data security?",
        answer: "Security is our top priority. We use AES-256 encryption at rest and in transit, SOC 2 Type II certified infrastructure, regular security audits, and zero-trust architecture. All data is isolated per tenant with complete encryption."
      },
      {
        question: "Are you compliant with GDPR and other regulations?",
        answer: "Yes, we're fully GDPR, CCPA, and HIPAA compliant. Our platform includes built-in data governance tools, audit logging, right-to-delete functionality, and data residency controls for international compliance."
      },
      {
        question: "What about backup and disaster recovery?",
        answer: "We maintain automated backups across multiple geographic regions with point-in-time recovery. Our 99.99% uptime SLA is backed by redundant infrastructure, automatic failover, and 24/7 monitoring."
      }
    ]
  },
  {
    category: "Platform & Support",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    questions: [
      {
        question: "What kind of support do you provide?",
        answer: "Free tier includes community support and documentation. Paid plans get email support with <24hr response time. Pro and Enterprise plans include priority support with <1hr response, dedicated success managers, and optional phone support."
      },
      {
        question: "Do you offer SLA guarantees?",
        answer: "Yes! We offer 99.9% uptime SLA for Pro plans and 99.99% for Enterprise plans. SLA breaches result in automatic service credits. Our average uptime exceeds 99.97% across all regions."
      },
      {
        question: "Can I integrate with my existing tools?",
        answer: "Absolutely! We offer native integrations with GitHub, GitLab, Bitbucket, Slack, Jira, Datadog, and 100+ other tools. Our REST API and webhooks enable custom integrations with any platform."
      }
    ]
  }
];

const CategoryCard = ({ category, isActive, onClick, icon: Icon, color }) => (
  <motion.button
    className={`w-full p-4 rounded-xl text-left relative overflow-hidden group transition-all duration-300 ${
      isActive 
        ? 'card-pro border-pink-500/30' 
        : 'glass-pro border-white/10 hover:border-pink-500/20'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-all duration-300`}></div>
    
    <div className="relative z-10 flex items-center gap-3">
      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className={`font-semibold transition-colors ${isActive ? 'text-glow-pink' : 'text-white group-hover:text-glow-pink'}`}>
          {category}
        </h3>
        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
          {category === "Getting Started" && "Setup & Configuration"}
          {category === "Pricing & Plans" && "Billing & Subscriptions"}
          {category === "Security & Compliance" && "Data Protection & Audits"}
          {category === "Platform & Support" && "Tools & Assistance"}
        </p>
      </div>
    </div>
    
    {/* Active Indicator */}
    {isActive && (
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-cyan-500 rounded-r-full"
        layoutId="activeIndicator"
        transition={{ duration: 0.3 }}
      />
    )}
  </motion.button>
);

const AccordionItem = ({ question, answer, index, isOpen, onToggle }) => (
  <motion.div 
    className="card-pro mb-4 relative overflow-hidden group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.01, y: -2 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <motion.button
      className="w-full p-6 text-left flex items-center justify-between relative z-10"
      onClick={onToggle}
      whileTap={{ scale: 0.99 }}
    >
      <span className="text-lg font-semibold text-white pr-8 group-hover:text-glow-pink transition-all duration-300">
        {question}
      </span>
      <motion.div
        className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        {isOpen ? (
          <Minus className="w-4 h-4 text-white" />
        ) : (
          <Plus className="w-4 h-4 text-white" />
        )}
      </motion.div>
    </motion.button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 relative z-10">
            <div className="h-px bg-gradient-to-r from-pink-500 to-cyan-500 mb-4 opacity-30"></div>
            <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
  </motion.div>
);

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (questionIndex) => {
    setOpenItems(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const currentCategory = faqData[activeCategory];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="faq">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/5 to-black"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-purple-500/20 text-purple-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Frequently Asked </span>
            <span className="text-shimmer">Questions</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              Find answers to common questions about our platform, pricing, security, and more. 
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Category Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-400" />
              Categories
            </h3>
            {faqData.map((category, index) => (
              <CategoryCard
                key={category.category}
                category={category.category}
                icon={category.icon}
                color={category.color}
                isActive={activeCategory === index}
                onClick={() => setActiveCategory(index)}
              />
            ))}
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            key={activeCategory}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentCategory.color} rounded-xl flex items-center justify-center`}>
                  <currentCategory.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentCategory.category}</h3>
                  <p className="text-white/60">{currentCategory.questions.length} questions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentCategory.questions.map((faq, index) => (
                <AccordionItem
                  key={`${activeCategory}-${index}`}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                  isOpen={openItems[`${activeCategory}-${index}`]}
                  onToggle={() => toggleItem(`${activeCategory}-${index}`)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Support Section */}
        <motion.div
          className="mt-16 sm:mt-20 text-center card-pro p-8 sm:p-12 max-w-4xl mx-auto relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
              Still have questions?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto group-hover:text-white/90 transition-colors">
              Our support team is available 24/7 to help you with any questions or issues. 
              Get personalized assistance from our experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              
              <motion.button
                className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}