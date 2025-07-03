import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export async function ragWithOpenAI(query, k = 5) {
    console.log("🔍 Performing RAG with OpenAI for query:", query);
  const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-large",
  apiKey: process.env.OPENAI_API_KEY,
});

const retriever = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    url: process.env.QDRANT_URL,
    dimensions: 3072,
    collectionName: process.env.QDRANT_COLLECTION_NAME_openai,
  }
);


  const searchResult = await retriever.similaritySearch(query, k);

  console.log(`🔍 Found ${searchResult.length} relevant chunks for query: "${query}"`);
  const context = searchResult.map(doc => doc.pageContent).join("\n\n");

  const prompt = PromptTemplate.fromTemplate(`
You are a helpful and intelligent assistant with expert-level knowledge across technology, science, business, education, and general problem-solving. Use the following context to accurately and clearly answer the user's question.

If the answer is not directly in the context, reason based on your understanding, but do not hallucinate facts. Prefer clarity and accuracy over verbosity.

Context:
{context}

Question:
{question}

Answer:
  `);


  console.log("📝 Prompt constructed with context and question.",prompt);
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chain = prompt.pipe(llm);
  const response = await chain.invoke({ context, question: query });

  console.log("🧠 LLM Answer:", response);
  return response;
}
