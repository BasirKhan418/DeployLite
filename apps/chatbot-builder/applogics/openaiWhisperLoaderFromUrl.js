import fs from 'fs/promises';
import path from 'path';
import { OpenAIWhisperAudio } from '@langchain/community/document_loaders/fs/openai_whisper_audio';

const openaiWhisperLoaderFromUrl = async (url) => {
  // Step 1: Fetch remote audio file
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download audio from URL: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  // Step 2: Save to a temporary file
  const tempPath = path.join('./temp', 'temp_audio.mp3');
  await fs.mkdir('./temp', { recursive: true });
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  // Step 3: Load with OpenAI Whisper
  const loader = new OpenAIWhisperAudio(tempPath, {
    transcriptionCreateParams: {
      language: 'en',
    },
  });
  const docs = await loader.load();

  // Step 4: Clean up temp file
  await fs.unlink(tempPath);

  return docs;
};

export { openaiWhisperLoaderFromUrl };
