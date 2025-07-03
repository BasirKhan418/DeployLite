import youtubedl from 'youtube-dl-exec';
import { OpenAIWhisperAudio } from '@langchain/community/document_loaders/fs/openai_whisper_audio';
import fs from 'fs/promises';

const transcribeYouTubeVideo = async (youtubeUrl) => {
  try {
    console.log("🎬 Downloading YouTube audio...");

    // Download best audio to temp_audio.mp3
    await youtubedl(youtubeUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: 'temp_audio.%(ext)s',
    });

    console.log("🔊 Audio downloaded. Transcribing...");

    const loader = new OpenAIWhisperAudio('temp_audio.mp3', {
      transcriptionCreateParams: {
        language: 'en',
      },
    });

    const docs = await loader.load();

    // Optional: cleanup
    await fs.unlink('temp_audio.mp3');

    console.log("✅ Transcription complete.");
    return docs[0].pageContent;

  } catch (err) {
    console.error("❌ Transcription failed:", err.message);
    throw err;
  }
};

export { transcribeYouTubeVideo };
