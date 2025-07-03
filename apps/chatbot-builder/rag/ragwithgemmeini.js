// ragwithgemini.js
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

/**
 * Safely replaces bad characters if needed (optional)
 */
function safeText(str) {
  if (!str) return "";
  return str.replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

/**
 * Main RAG function using Gemini-Pro + Qdrant + Google Embeddings
 */
export async function ragWithGemini(query, k = 5) {
  console.log("🔍 Performing RAG with Gemini for query:", query);
  console.log("🔑 GOOGLE_API_KEY loaded:", !!process.env.GOOGLE_API_KEY);
  console.log("📡 Qdrant URL:", process.env.QDRANT_URL);
  console.log("📁 Qdrant Collection:", process.env.QDRANT_COLLECTION_NAME_google);

  if (!process.env.GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is missing.");
  if (!process.env.QDRANT_URL) throw new Error("QDRANT_URL is missing.");
  if (!process.env.QDRANT_COLLECTION_NAME_google) throw new Error("QDRANT_COLLECTION_NAME_google is missing.");

  // 1. Generate Google Gemini Embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "models/embedding-001", // use "model" not "modelName"
    dimensions: 3072,
  });

  // 2. Connect to Qdrant collection
  const retriever = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION_NAME_google,
  });

  // 3. Similarity Search from vector DB
  const results = await retriever.similaritySearch(query, k);

  // 4. Format the retrieved documents
  const context = results
    .map((doc, index) => `Document ${index + 1}:\n${doc.pageContent}`)
    .join("\n\n");

  // 5. Initialize Gemini LLM with updated syntax
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash", // ✅ use `model`, not `modelName`
    temperature: 0.5,
    google_api_key: process.env.GOOGLE_API_KEY, // ✅ explicitly provide API key
  });

  // 6. Ask Gemini with context
  const response = await llm.invoke([
    {
      role: "system",
      content: "You are a helpful assistant with deep knowledge in tech and science. Only use the given context.",
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${safeText(query)}`,
    },
  ]);

  console.log("🧠 Gemini Answer:", response.content);
  return response.content;
}
