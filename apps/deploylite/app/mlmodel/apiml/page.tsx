"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500";
const buttonBase = "inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium transition-all duration-200";
const glassCard = "rounded-2xl bg-gray-900/50 p-6 shadow-2xl backdrop-blur-sm border border-pink-500/20";

const API_ENDPOINT = "https://api.deploylite.tech/chat/llm";
const DEMO_API_KEY = " ya2Ui5gTxczbo0_dwNUKKyj86y0iQdYZ";

const defaultModel = {
  name: "ya2Ui5gTxczbo0_dwNUKKyj86y0iQdYZ",
  endpoints: [
    { method: "POST", url: API_ENDPOINT },
  ],
  apiCommands: [
    {
      title: "JavaScript (Node.js)",
      code: `// Using fetch API
const response = await fetch('${API_ENDPOINT}', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'Hello World',
    stream: false
  })
});

const data = await response.json();
console.log(data);

// For streaming:
const streamResponse = await fetch('${API_ENDPOINT}', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'Hello World',
    stream: true
  })
});

const reader = streamResponse.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}`
    },
    {
      title: "Python",
      code: `import requests

def call_llm(question: str = 'Hello World', api_key: str = 'YOUR_API_KEY'):
    url = '${API_ENDPOINT}'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'question': question,
        'stream': False
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error: {str(e)}')
        raise

def stream_llm(question: str = 'Hello World', api_key: str = 'YOUR_API_KEY'):
    url = '${API_ENDPOINT}'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'question': question,
        'stream': True
    }
    
    try:
        with requests.post(url, json=payload, headers=headers, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    print(line.decode('utf-8'))
    except requests.exceptions.RequestException as e:
        print(f'Error: {str(e)}')
        raise`
    },
    {
      title: "cURL",
      code: `# Regular request
curl -X POST ${API_ENDPOINT} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Hello World",
    "stream": false
  }'

# Streaming request
curl -X POST ${API_ENDPOINT} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Hello World",
    "stream": true
  }'`
    }
  ],
  status: 'not_accessed'
};

export default function APIMLDetailPage() {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("name") || "LLM API";
  const [model, setModel] = useState(defaultModel);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load access status from localStorage
    const storedStatus = localStorage.getItem('apiAccessStatus');
    if (storedStatus) {
      setModel(prev => ({ ...prev, status: storedStatus }));
    }
  }, []);

  const handleAccessConfirm = () => {
    const newStatus = 'accessed';
    localStorage.setItem('apiAccessStatus', newStatus);
    setModel(prev => ({ ...prev, status: newStatus }));
    setShowModal(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black text-white min-h-screen py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40 z-10" />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-10 z-20">
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm API Access</AlertDialogTitle>
              <AlertDialogDescription>
                Click confirm to access the API documentation and integration details. You'll be able to start using the API right away.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccessConfirm}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
              >
                Confirm Access
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${textGradient}`}>
            LLM API Integration
          </h1>
          <p className="text-xl text-gray-300">
            {model.status === 'accessed' 
              ? "Access your API key, endpoints, and implementation examples below."
              : "Click 'Access Now' to get started with our powerful LLM API."}
          </p>
        </motion.div>

        <div className={glassCard}>
          {model.status === 'accessed' ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-pink-500">Your API Key</h2>
                <p className="mb-6 text-lg font-mono bg-gray-800 p-4 rounded">
                  {DEMO_API_KEY}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">API Endpoints</h3>
                <ul className="space-y-2 bg-gray-800 p-4 rounded">
                  {model.endpoints.map((endpoint, idx) => (
                    <li key={idx} className="text-gray-300">
                      <span className="font-bold">{endpoint.method}</span> {endpoint.url}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Implementation Examples</h3>
                <div className="space-y-6">
                  {model.apiCommands.map((snippet, idx) => (
                    <div key={idx} className="bg-gray-800 p-4 rounded">
                      <h4 className="font-bold mb-2 text-pink-500">{snippet.title}</h4>
                      <pre className="whitespace-pre-wrap text-gray-300 text-sm overflow-x-auto">
                        {snippet.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-pink-500">Get Started with Our API</h2>
              <p className="text-gray-300 mb-4">
                Click the "Access Now" button below to view the API documentation and start integration.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {model.status === 'accessed' ? (
              <div className="flex gap-4">
                <Link 
                  href="/dashboard"
                  className={`${buttonBase} bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90`}
                >
                  Manage API
                </Link>
                <Link 
                  href="/mlmodel" 
                  className={`${buttonBase} bg-gray-800 text-white hover:bg-gray-700`}
                >
                  Back
                </Link>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className={`${buttonBase} bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90`}
                >
                  Access Now
                </button>
                <Link 
                  href="/mlmodel" 
                  className={`${buttonBase} bg-gray-800 text-white hover:bg-gray-700`}
                >
                  Back
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}