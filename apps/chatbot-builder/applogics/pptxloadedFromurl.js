import fs from 'fs/promises';
import path from 'path';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';

const pptxLoaderFromUrl = async (url) => {
  // Step 1: Fetch the remote PPTX file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Step 2: Save to temporary local file
  const tempPath = path.join('./temp', 'temp.pptx');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  // Step 3: Load with PPTXLoader
  const loader = new PPTXLoader(tempPath);
  const docs = await loader.load();

  // Step 4: Clean up the temp file
  await fs.unlink(tempPath);

  return docs;
};

export { pptxLoaderFromUrl };
