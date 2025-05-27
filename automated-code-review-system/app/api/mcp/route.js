import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a code review assistant. Provide helpful and constructive feedback.' },
        { role: 'user', content: prompt }
      ]
    });

    return NextResponse.json({ result: completion.choices[0]?.message?.content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'MCP review failed' }, { status: 500 });
  }
}
