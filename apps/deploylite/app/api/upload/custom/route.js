// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ChatbotBuilder from '../../../../../models/ChatbotBuilder';


// Method 1: Direct upload to S3
export async function POST(request) {
  try {
    const data = await request.json();

    let findchatbot = await ChatbotBuilder.findOne({_id:data.id});

    if (!findchatbot) {
      return NextResponse.json({ error: 'Chatbot not found' , status: 404 ,fileUrl});
    }

    // Update the chatbot with the new knowledge base file URL
    await ChatbotBuilder.updateOne(
      { _id: data.id},
        { $push: { knowledgebase: data.file } }
    );

    //fetch and train the chatbot with the new knowledge base file
    try{
       
    const response = await fetch(`http://${findchatbot.url}:5080/loaders/train`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: data.url,
            storeType:data.provider,
        }),
    });
    console.log('Training response status:', response);
    const data2 = await response.json();

    console.log('Training response:', data2);

  if(response.ok) {
    console.log('Chatbot trained successfully:', data2);
    return NextResponse.json({ message: 'Chatbot trained successfully', url:data.url,success:true });
  }
    
    return NextResponse.json({ error: 'Failed to train chatbot', details: data,success:false });
}
catch (error) {
    console.error('Error training chatbot:', error);
    return NextResponse.json({ error: 'Failed to train chatbot' ,success:false});
}
   
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' ,success:false})
    ;
  }
}