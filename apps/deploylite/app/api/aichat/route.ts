import { NextResponse,NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const data2 = await request.json();
        // Simulate API call to chatbot with provider selection
      const response = await fetch(`http://${data2.url}:5080/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: data2.inputMessage.trim(),
          type: data2.aiProvider,
        })
      });

      const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: data.error || "Failed to fetch response from AI provider", success: false });
        }
        return NextResponse.json({ data: data.data, success: true });
    }
    catch(err){
        console.error("Error in POST /api/aichat:", err);
        return NextResponse.json({ error: "Internal Server Error" ,success:true});
    }
}