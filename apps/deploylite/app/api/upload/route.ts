// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ChatbotBuilder from '../../../../models/ChatbotBuilder';
// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Method 1: Direct upload to S3
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.KNOWLEDGE_BASE_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the S3 URL
    const fileUrl = `http://${process.env.KNOWLEDGE_BASE_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    let findchatbot = await ChatbotBuilder.findOne({_id:formData.get('id')});

    if (!findchatbot) {
      return NextResponse.json({ error: 'Chatbot not found' , status: 404 ,fileUrl});
    }

    // Update the chatbot with the new knowledge base file URL
    await ChatbotBuilder.updateOne(
      { _id: formData.get('id') },
        { $push: { knowledgebase: fileUrl } }
    );

    //fetch and train the chatbot with the new knowledge base file
    try{
        console.log('Training chatbot with new knowledge base file:', fileUrl);
        console.log('Chatbot URL:', findchatbot.url);
        console.log('Store Type:', formData.get('storeType'));
    const response = await fetch(`http://${findchatbot.url}:5080/loaders/train`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: fileUrl,
            storeType:formData.get('storeType')
        }),
    });
    console.log('Training response status:', response);
    const data = await response.json();

    console.log('Training response:', data);

  if(response.ok) {
    console.log('Chatbot trained successfully:', data);
    return NextResponse.json({ message: 'Chatbot trained successfully', fileUrl,success:true });
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

// Method 2: Generate presigned URL for client-side upload
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const fileType = searchParams.get('fileType');
    
    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'fileName and fileType are required' }, { status: 400 });
    }

    const key = `${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.KNOWLEDGE_BASE_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return NextResponse.json({ 
      signedUrl,
      key,
      fileUrl: `https://${process.env.KNOWLEDGE_BASE_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
  }
}