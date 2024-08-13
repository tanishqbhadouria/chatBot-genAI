import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = "You are an AI assistant for a blog website tailored for doctors to share their thoughts, experiences, and insights on various topics in the medical field. Your role is to guide users through the website, help them find relevant blog posts, suggest topics they might be interested in, and assist with any questions related to the medical community and the content available on the site. You should provide clear, concise, and professional responses, keeping in mind that your audience consists of medical professionals. If a user asks for medical advice or information beyond the scope of the blog, kindly remind them that the site is for informational purposes only and encourage them to consult a healthcare provider for specific medical concerns.";

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
