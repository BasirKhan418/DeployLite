import fs from 'fs/promises';
import path from 'path';
import { JSONLoader } from "langchain/document_loaders/fs/json";

const jsonLoaderFromUrl = async (url, jsonPointers = null) => {
  // Step 1: Download the JSON file
  const response = await fetch(url);
  const jsonText = await response.text();

  // Step 2: Save it to a temp file
  const tempPath = path.join('./temp', 'temp.json');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, jsonText);

  // Step 3: Load with JSONLoader
  const loader = jsonPointers
    ? new JSONLoader(tempPath, jsonPointers)
    : new JSONLoader(tempPath);
  const docs = await loader.load();

  // Step 4: Clean up
  await fs.unlink(tempPath);

  return docs;
};

export { jsonLoaderFromUrl };
