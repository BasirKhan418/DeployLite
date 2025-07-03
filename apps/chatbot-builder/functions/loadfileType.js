
import { pdfLoader } from '../applogics/Loaders.js';
import { csvLoader } from '../applogics/Loaders.js';
import { docxLoaderFromUrl } from '../applogics/docxLoaderfromUrl.js';
import { docLoaderFromUrl } from '../applogics/docLoaderFromUrl.js';
import { jsonLoaderFromUrl } from '../applogics/jsonloadedfromUrl.js';
import { pptxLoaderFromUrl } from '../applogics/pptxloadedFromurl.js';
import { srtLoaderFromUrl } from '../applogics/srtLoaderFromUrl.js';
import { textLoaderFromUrl } from '../applogics/textLoaderFromUrl.js';
import { transcribeYouTubeVideo } from '../applogics/transcribeYoutubeVideo.js';
import { openaiWhisperLoaderFromUrl } from '../applogics/openaiWhisperLoaderFromUrl.js';
import { webLoaderFromUrl } from '../applogics/webLoaderfromurl.js';
const loadFileByType=async(url)=> {
  const lowerUrl = url.toLowerCase();

  try {
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return await transcribeYouTubeVideo(url);
    }

    if (lowerUrl.startsWith('http') && !lowerUrl.includes('.')) {
      return await webLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.pdf')) {
      return await pdfLoader(url);
    }

    if (lowerUrl.endsWith('.csv')) {
      return await csvLoader(url);
    }

    if (lowerUrl.endsWith('.json')) {
      return await jsonLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.docx')) {
      return await docxLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.doc')) {
      return await docLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.pptx')) {
      return await pptxLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.srt')) {
      return await srtLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.txt')) {
      return await textLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.mp3') || lowerUrl.endsWith('.wav') || lowerUrl.endsWith('.m4a')) {
      return await openaiWhisperLoaderFromUrl(url);
    }

    if (lowerUrl.endsWith('.html') || lowerUrl.endsWith('.htm')) {
      return await webLoaderFromUrl(url);
    }
    else{
        return await webLoaderFromUrl(url);
    }

  } catch (error) {
    console.error('Error while loading file:', error);
    throw error;
  }
}
export { loadFileByType };