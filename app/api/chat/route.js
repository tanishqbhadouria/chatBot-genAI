import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = "You are an AI assistant on a professional blog website for doctors to share thoughts, insights, and experiences in the medical field. Your goal is to assist users in navigating the website, finding relevant blog posts, suggesting topics based on user interest, and answering questions related to the content. Ensure your responses are clear, concise, and professional, keeping in mind the audience consists of medical professionals.If a user asks for medical advice, always remind them that this platform is for informational purposes only, and encourage them to consult a healthcare provider for specific concerns. Guide users in locating content, using the search function, or exploring trending topics, and offer personalized recommendations based on their queries or interests."


export async function POST(req) {
  try {
    const data = await req.json();

    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });

    
    const chat = model.startChat({ history: [...data] });

  
    const result = await chat.sendMessage(data[0].parts[0].text);

    const responseText =  result.response.text();
    // console.log('responseText:', responseText);
    return new NextResponse(responseText);

  } catch (error) {
    console.error('Error processing request:', error);
    return  new NextResponse('Internal Server Error', { status: 500 });
  }
}
