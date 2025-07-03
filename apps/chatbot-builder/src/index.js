import express from 'express';
import 'dotenv/config'
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
const app = express();
app.get('/', async(req, res) => {
    // const filepath = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf"
    // const docs = await pdfLoader(filepath);
    // console.log(docs);

    // const file = "https://cdn.wsform.com/wp-content/uploads/2020/06/industry.csv";
    // const docs = await csvLoader(file);
    // console.log(docs);

    //  const data = "https://calibre-ebook.com/downloads/demos/demo.docx"

    //  const docs = await docxLoaderFromUrl(data);
    //  console.log(docs);

    // const data = "https://www.sample-videos.com/doc/Sample-doc-file-100kb.doc";
    // const docs = await docLoaderFromUrl(data);
    // console.log(docs);
//   const data = "https://jsonplaceholder.typicode.com/todos/1";
//     const docs = await jsonLoaderFromUrl(data);
//     console.log(docs);

// const data = "https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx";

// const docs = await pptxLoaderFromUrl(data);
// console.log(docs);

// const data = "https://www.filesampleshub.com/download/document/txt/sample1.txt";

// const docs = await textLoaderFromUrl(data);
// const data = "https://download.samplelib.com/mp3/sample-3s.mp3";

//     const docs = await openaiWhisperLoaderFromUrl(data);
//     console.log(docs);

// const data = "https://youtu.be/0CmtDk-joT4?si=japXSq9kXcGyR7Zu";
//     const docs = await transcribeYouTubeVideo(data);
//     console.log(docs);
//     // const data = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-audio-file.mp3";
//     // const docs = await openaiWhisperLoaderFromUrl(data);
//     //
// console.log(docs);

const data = "https://www.wikipedia.org/";
    const docs = await webLoaderFromUrl(data);
    console.log(docs);

    res.send('Welcome to the Chatbot Builder!. This is a simple chatbot builder application.');
})
app.listen(5080,()=>{
    console.log("Chatbot Builder is running on port 5080");
})