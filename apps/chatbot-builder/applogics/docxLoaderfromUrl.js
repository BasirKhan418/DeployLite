import fs from 'fs/promises';
import path from 'path';
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

const docxLoaderFromUrl = async (url) => {
  // Step 1: Fetch the file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Step 2: Save to temporary local file
  const tempPath = path.join('./temp', 'temp.docx');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  // Step 3: Use DocxLoader
  const loader = new DocxLoader(tempPath);
  const docs = await loader.load();

  // Step 4: Clean up
  await fs.unlink(tempPath);

  return docs;
};
export { docxLoaderFromUrl };
