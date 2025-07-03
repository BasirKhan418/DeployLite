import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import fs from "fs/promises";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { fileURLToPath } from 'url';
import path from "path";
//pdf loader
const pdfLoader = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  const loader = new WebPDFLoader(blob);
  const docs = await loader.load();
  return docs;
};

//csv loaders
const csvLoader = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const filePath = "./temp.csv";

  await fs.writeFile(filePath, text); // write to disk

  const loader = new CSVLoader(filePath);
  const docs = await loader.load();

  await fs.unlink(filePath); // clean up
  return docs;
};


export { pdfLoader,csvLoader };
