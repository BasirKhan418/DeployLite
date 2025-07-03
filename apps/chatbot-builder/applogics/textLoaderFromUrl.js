import fs from 'fs/promises';
import path from 'path';
import { TextLoader } from 'langchain/document_loaders/fs/text';

const textLoaderFromUrl = async (url) => {
  // Step 1: Download the text file
  const response = await fetch(url);
  const content = await response.text();

  // Step 2: Save it to a temporary file
  const tempPath = path.join('./temp', 'temp.txt');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, content);

  // Step 3: Load with TextLoader
  const loader = new TextLoader(tempPath);
  const docs = await loader.load();

  // Step 4: Clean up
  await fs.unlink(tempPath);

  return docs;
};

export { textLoaderFromUrl };
