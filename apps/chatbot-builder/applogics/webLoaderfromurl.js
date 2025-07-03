// applogics/webLoaderFromUrl.js
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const webLoaderFromUrl = async (url) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  return docs;
};

export { webLoaderFromUrl };
