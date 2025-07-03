import fs from 'fs/promises';
import path from 'path';
import WordExtractor from 'word-extractor';
import { Document } from 'langchain/document'; // Optional, for LangChain compatibility

const docLoaderFromUrl = async (url) => {
  // Step 1: Fetch the remote DOC file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Step 2: Save to a temporary local file
  const tempPath = path.join('./temp', 'temp.doc');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  // Step 3: Use word-extractor to read contents
  const extractor = new WordExtractor();
  const extracted = await extractor.extract(tempPath);

  // Step 4: Clean up the temporary file
  await fs.unlink(tempPath);

  // Step 5: Wrap in LangChain Document if needed
  const docs = [
    new Document({
      pageContent: extracted.getBody(),
      metadata: {},
    }),
  ];

  return docs;
};

export { docLoaderFromUrl };
