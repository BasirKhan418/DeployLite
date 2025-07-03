"use client"
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Shield, Zap, CreditCard, Settings } from "lucide-react";

const faqData = [
  {
    category: "Getting Started",
    icon: Zap,
    color: "from-pink-500 to-purple-600",
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
        answer: "Our pricing is per seat, per month with unlimited projects. Team plans start at $25/month per user and include advanced collaboration tools, priority support, and enhanced security features."
      },
      {
        question: "Can I switch plans at any time?",
        answer: "Absolutely! Upgrade or downgrade your plan instantly. Changes are prorated automatically, and you'll only pay for what you use. Downgrades take effect at the next billing cycle."
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
        answer: "Security is our top priority. We use AES-256 encryption at rest and in transit, SOC 2 Type II certified infrastructure, regular security audits, and zero-trust architecture."
      },
      {
        question: "Are you compliant with GDPR and other regulations?",
        answer: "Yes, we're fully GDPR, CCPA, and HIPAA compliant. Our platform includes built-in data governance tools, audit logging, and data residency controls for international compliance."
      },
      {
        question: "What about backup and disaster recovery?",
        answer: "We maintain automated backups across multiple geographic regions with point-in-time recovery. Our 99.99% uptime SLA is backed by redundant infrastructure and 24/7 monitoring."
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
        answer: "Free tier includes community support and documentation. Paid plans get email support with <24hr response time. Pro and Enterprise plans include priority support with <1hr response."
      },
      {
        question: "Do you offer SLA guarantees?",
        answer: "Yes! We offer 99.9% uptime SLA for Pro plans and 99.99% for Enterprise plans. SLA breaches result in automatic service credits. Our average uptime exceeds 99.97%."
      },
      {
        question: "Can I integrate with my existing tools?",
        answer: "Absolutely! We offer native integrations with GitHub, GitLab, Bitbucket, Slack, Jira, Datadog, and 100+ other tools. Our REST API enables custom integrations with any platform."
      }
    ]
  }
];

const CategoryCard = ({ category, isActive, onClick, icon: Icon, color }) => (
  <motion.button
    className={`w-full p-4 rounded-xl text-left relative overflow-hidden group transition-all duration-300 ${
      isActive 
        ? 'bg-gray-800/60 border border-pink-500/30' 
        : 'bg-gray-900/50 border border-gray-800 hover:border-pink-500/20'
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
        <h3 className={`font-semibold transition-colors ${isActive ? 'text-pink-300' : 'text-white group-hover:text-pink-300'}`}>
          {category}
        </h3>
        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
          {category === "Getting Started" && "Setup & Configuration"}
          {category === "Pricing & Plans" && "Billing & Subscriptions"}
          {category === "Security & Compliance" && "Data Protection & Audits"}
          {category === "Platform & Support" && "Tools & Assistance"}
        </p>
      </div>
    </div>
    
    {isActive && (
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500 rounded-r-full"
        layoutId="activeIndicator"
        transition={{ duration: 0.3 }}
      />
    )}
  </motion.button>
);

const AccordionItem = ({ question, answer, index, isOpen, onToggle }) => (
  <motion.div 
    className="bg-gray-900/50 border border-gray-800 rounded-xl mb-4 relative overflow-hidden group hover:border-gray-700 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.01, y: -2 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <motion.button
      className="w-full p-6 text-left flex items-center justify-between relative z-10"
      onClick={onToggle}
      whileTap={{ scale: 0.99 }}
    >
      <span className="text-lg font-semibold text-white pr-8 group-hover:text-pink-200 transition-all duration-300">
        {question}
      </span>
      <motion.div
        className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
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
            <div className="h-px bg-gradient-to-r from-pink-500 to-purple-500 mb-4 opacity-30"></div>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
    <div className="bg-gray-950 py-20" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 text-purple-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our platform, pricing, security, and more.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  <p className="text-gray-400">{currentCategory.questions.length} questions</p>
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
      </div>
    </div>
  );
}