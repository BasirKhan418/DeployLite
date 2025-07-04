import { NextResponse,NextRequest } from "next/server";
import ChatbotBuilder from "../../../../../../models/ChatbotBuilder";


export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        console.log("Fetching chatbot details for ID:", id);

        if (!id) {
            return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
        }

        const chatbot = await ChatbotBuilder.findById(id);

        

        if (!chatbot) {
            return NextResponse.json({success:false, error: "Chatbots not found" });
        }

        return NextResponse.json({success:true,data:chatbot, message: "Chatbot details fetched successfully" });

    } catch (error) {
        console.error("Error fetching chatbot details:", error);
        return NextResponse.json({ error: "Internal Server Error" ,success:false})
    }
}