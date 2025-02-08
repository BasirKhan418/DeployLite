"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Reusable styling
const textGradient =
  "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase =
  "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const glassCard =
  "rounded-2xl bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20";

// Hard-coded API key just for demo
const DEMO_API_KEY = "API-KEY-123456";

//
// The model data includes more detailed code snippets for each language.
//
const models = [
  {
    name: "DeepSeek",
    endpoints: [
      { method: "GET", url: "/api/deepseek/search" },
      { method: "POST", url: "/api/deepseek/query" },
    ],
    sdkCommands: [
      {
        title: "JavaScript (Node.js)",
        code: `// Install the DeepSeek SDK
// npm install deepseek-sdk

import { deepSeekClient } from 'deepseek-sdk';

async function runDeepSeek() {
  // Replace 'API-KEY-123456' with your real key
  const client = deepSeekClient("API-KEY-123456");
  
  const response = await client.query("Hello World");
  console.log("DeepSeek response:", response);
}

runDeepSeek();
`,
      },
      {
        title: "Python",
        code: `# Install the DeepSeek SDK
# pip install deepseek-sdk

from deepseek_sdk import DeepSeekClient

# Replace 'API-KEY-123456' with your real key
client = DeepSeekClient("API-KEY-123456")

response = client.query("Hello World")
print("DeepSeek response:", response)
`,
      },
      {
        title: "Java",
        code: `// Add this to your pom.xml or build.gradle, depending on your system:
// <dependency>
//   <groupId>com.deepseek</groupId>
//   <artifactId>deepseek-sdk</artifactId>
//   <version>1.0.0</version>
// </dependency>

// Sample usage:

DeepSeekClient client = new DeepSeekClient("API-KEY-123456");
String response = client.query("Hello World");
System.out.println("DeepSeek response: " + response);
`,
      },
    ],
  },
  {
    name: "Ollama",
    endpoints: [
      { method: "GET", url: "/api/ollama/chat" },
      { method: "POST", url: "/api/ollama/message" },
    ],
    sdkCommands: [
      {
        title: "JavaScript (Node.js)",
        code: `// npm install ollama-sdk
import { ollamaClient } from 'ollama-sdk';

async function runOllama() {
  const client = ollamaClient("API-KEY-123456");
  const chatResponse = await client.chat("Hello!");
  console.log("Ollama chat response:", chatResponse);
}

runOllama();
`,
      },
      {
        title: "Python",
        code: `# pip install ollama-sdk
from ollama_sdk import OllamaClient

client = OllamaClient("API-KEY-123456")
response = client.chat("Hello!")
print("Ollama chat response:", response)
`,
      },
      {
        title: "Java",
        code: `// Add to pom.xml or build.gradle
// <dependency>
//   <groupId>com.ollama</groupId>
//   <artifactId>ollama-sdk</artifactId>
//   <version>1.0.0</version>
// </dependency>

OllamaClient client = new OllamaClient("API-KEY-123456");
String response = client.chat("Hello!");
System.out.println("Ollama chat response: " + response);
`,
      },
    ],
  },
  {
    name: "Phi-4",
    endpoints: [
      { method: "GET", url: "/api/phi4/info" },
      { method: "POST", url: "/api/phi4/infer" },
    ],
    sdkCommands: [
      {
        title: "JavaScript (Node.js)",
        code: `// npm install phi4-sdk
import { phi4Client } from 'phi4-sdk';

async function runPhi4() {
  const client = phi4Client("API-KEY-123456");
  const info = await client.getInfo();
  console.log("Phi-4 info:", info);
}

runPhi4();
`,
      },
      {
        title: "Python",
        code: `# pip install phi4-sdk
from phi4_sdk import Phi4Client

client = Phi4Client("API-KEY-123456")
info = client.getInfo()
print("Phi-4 info:", info)
`,
      },
      {
        title: "Java",
        code: `// <dependency>
//   <groupId>com.phi4</groupId>
//   <artifactId>phi4-sdk</artifactId>
//   <version>1.0.0</version>
// </dependency>

Phi4Client client = new Phi4Client("API-KEY-123456");
String info = client.getInfo();
System.out.println("Phi-4 info: " + info);
`,
      },
    ],
  },
];

export default function APIMLDetailPage() {
  // We'll get the model name from the query string ?name=...
  const searchParams = useSearchParams();
  const modelName = searchParams.get("name"); // e.g. "DeepSeek"

  const [model, setModel] = useState(null);

  useEffect(() => {
    if (modelName) {
      const found = models.find((m) => m.name === modelName);
      setModel(found);
    }
  }, [modelName]);

  // Handle missing param or unknown model
  if (!modelName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl">No model selected.</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl">Model not found: {modelName}</p>
      </div>
    );
  }

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
            {modelName} Integration
          </h1>
          <p className="text-xl text-gray-300">
            Below you'll find your API Key, Endpoints, a quick Playground, and SDK usage examples.
          </p>
        </motion.div>

        <div className={glassCard}>
          {/* Show the API Key */}
          <h2 className="text-2xl font-bold mb-4 text-pink-500">Your API Key</h2>
          <p className="mb-6 text-lg font-mono">
            {DEMO_API_KEY}
          </p>

          {/* Endpoints */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">API Endpoints</h3>
            <ul className="space-y-2">
              {model.endpoints.map((endpoint, idx) => (
                <li key={idx} className="text-gray-300">
                  <span className="font-bold">{endpoint.method}</span> {endpoint.url}
                </li>
              ))}
            </ul>
          </div>

          {/* Playground */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Playground</h3>
            <p className="text-gray-300 mb-4">
              Test out {modelName} directly from your browser (in a real app, you'd implement interactive calls).
            </p>
            <div className="bg-gray-800 p-4 rounded text-gray-300">
              {/* Replace with your real interactive UI */}
              <p className="mb-2">Try calling the <strong>{model.endpoints[0]?.url}</strong> endpoint:</p>
              <pre className="bg-gray-700 p-2 rounded mb-2 text-sm whitespace-pre-wrap">
{`fetch('${model.endpoints[0]?.url}', {
  method: '${model.endpoints[0]?.method}',
  headers: { 'Authorization': 'Bearer ${DEMO_API_KEY}' }
})
.then(res => res.json())
.then(data => console.log(data));`}
              </pre>
              <p>This is just a placeholder. Build your own user-friendly playground here!</p>
            </div>
          </div>

       
          <div>
            <h3 className="text-xl font-bold mb-2">SDK Integration</h3>
            <div className="space-y-4">
              {model.sdkCommands.map((snippet, idx) => (
                <div key={idx}>
                  <h4 className="font-bold mb-1">{snippet.title}</h4>
                  <pre className="bg-gray-800 p-4 rounded whitespace-pre-wrap text-gray-100 text-sm">
                    {snippet.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link href="/mlmodel" className={`${buttonBase} bg-gray-800 text-white`}>
              Back to Main
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
