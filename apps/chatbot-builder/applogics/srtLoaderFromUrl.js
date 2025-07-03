import fs from 'fs/promises';
import path from 'path';
import { SRTLoader } from '@langchain/community/document_loaders/fs/srt';

const srtLoaderFromUrl = async (url) => {
  // Step 1: Download the SRT file
  const response = await fetch(url);
  const text = await response.text();

  // Step 2: Save it to a temporary file
  const tempPath = path.join('./temp', 'temp.srt');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, text);

  // Step 3: Load the file using SRTLoader
  const loader = new SRTLoader(tempPath);
  const docs = await loader.load();

  // Step 4: Clean up
  await fs.unlink(tempPath);

  return docs;
};

export { srtLoaderFromUrl };
