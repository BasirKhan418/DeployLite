import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

export async function storeWithOpenAI(splitDocs) {
    try{
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-large",
    apiKey: process.env.OPENAI_API_KEY, // or directly put the key if you're not using .env
    // dimensions: 1024, // optional
  });

  const vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
    url: process.env.QDRANT_URL ,
    dimensions: 3072,
    collectionName:process.env.QDRANT_COLLECTION_NAME_openai 
  });

  console.log("✅ Documents embedded and stored with OpenAI.");
  return true;
}
catch(err){
    console.error("❌ Error storing documents with OpenAI:", err.message);
    return false;
    
}
}
