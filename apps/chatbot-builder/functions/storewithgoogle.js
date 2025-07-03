import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

export async function storeWithGemini(splitDocs) {
    try{
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    dimensions: 768,
    modelName: "models/embedding-001", // Gemini embedding model
  });

   const vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
    url: process.env.QDRANT_URL ,
    collectionName:process.env.QDRANT_COLLECTION_NAME_google
  });
  console.log("✅ Documents embedded and stored with Gemini.");
  return true;

}
catch(err){
    console.error("❌ Error storing documents with Gemini:", err.message);
    return false;
}
}
