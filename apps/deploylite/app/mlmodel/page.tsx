"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

// Shared styling
const textGradient =
  "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase =
  "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const buttonPrimary =
  "bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:bg-pink-700";
const glassCard =
  "rounded-2xl bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20";

// Define interface for model data
interface ModelData {
  name: string;
  logo: string;
  price?: string;
  description?: string;
  parameters?: string;
  repo?: string;
  features?: string[];
}

// Sample data
const models = [
  {
    name: "DeepSeek",
    logo: "https://miro.medium.com/v2/resize:fit:1200/1*tlUlwc-ABsXvhFjK3JpC9g.png",
    price: "$49/month",
    description: "Cutting-edge search capabilities for your ML solutions.",
    parameters: "120M",
    repo: "https://github.com/deepseek",
    features: ["Fast search", "Semantic understanding", "High precision"],
  },
  {
    name: "Ollama",
    logo: "https://miro.medium.com/v2/resize:fit:695/1*UnUo_KuVO3gVcrwPqiAzAg.png",
    price: "$79/month",
    description: "Robust conversational AI powered by advanced NLP.",
    parameters: "350M",
    repo: "https://github.com/ollama",
    features: ["Conversational AI", "Natural language processing", "Scalable"],
  },
  {
    name: "Phi-4",
    logo:
      "data:image/png;base64,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",
  },
];

export default function MLModelPage() {
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [showModal, setShowModal] = useState(false);

  // We'll use the Next.js 13 navigation hook to push a route
  const router = useRouter();

  const openModal = (model: ModelData) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedModel(null);
    setShowModal(false);
  };

  // Called when user clicks "Continue" in the modal
  const handleContinue = () => {
    if (selectedModel) {
      // Navigate to /mlmodel/apiml with a query param of name=theModelName
      router.push(`/mlmodel/apiml?name=${encodeURIComponent(selectedModel.name)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen py-12">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10" />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-10 z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${textGradient}`}>
            ML Models
          </h1>
          <p className="text-xl text-gray-300">
            Choose the perfect API key to integrate ML features into your application.
          </p>
        </motion.div>

        {/* Grid of models */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              className={glassCard}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={model.logo}
                  alt={model.name}
                  className="w-20 h-20 mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{model.name}</h2>
                <p className="text-gray-300 text-center mb-4">{model.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-pink-500">
                    {model.price}
                  </span>
                </div>
                <ul className="mb-6 space-y-1">
                  {model.features?.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal(model)}
                  className={`${buttonBase} ${buttonPrimary}`}
                >
                  Purchase Key <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for the selected model */}
      {showModal && selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20 w-80">
            <h2 className="text-2xl font-bold mb-4 text-pink-500">
              {selectedModel.name} Details
            </h2>
            <p className="mb-2 text-gray-300">
              <strong>Price:</strong> {selectedModel.price}
            </p>
            <p className="mb-2 text-gray-300">
              <strong>Parameters:</strong> {selectedModel.parameters}
            </p>
            <p className="mb-4 text-gray-300">
              <strong>Repo:</strong>{" "}
              <a
                href={selectedModel.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 underline"
              >
                {selectedModel.repo}
              </a>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className={`${buttonBase} bg-gray-800 text-white`}
              >
                Cancel
              </button>
              {/* Continue: go to /mlmodel/apiml?name=selectedModel.name */}
              <button
                onClick={handleContinue}
                className={`${buttonBase} ${buttonPrimary}`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
