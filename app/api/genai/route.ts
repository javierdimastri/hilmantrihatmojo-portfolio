import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Fallback model chain — tried in order when a model is unavailable
const MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash'
];

function isRetriableError(err: any): boolean {
  const msg: string = (err?.message || err?.toString() || '').toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    err?.status === 503
  );
}

const SYSTEM_PROMPT = `You are a friendly personal assistant for Mohammed Hilman Trihatmojo's portfolio website. 
Your job is to answer questions about Hilman and nothing else.

Here is everything you know about Hilman:

## Basic Info
- Full name: Mohammed Hilman Trihatmojo
- Age: 31 years old
- Location: Jakarta, Indonesia
- Email: hilmantrihatmojo@gmail.com
- GitHub: github.com/javierdimastri/javierdimastri
- LinkedIn: linkedin.com/in/mohammed-hilman-trihatmojo

## Professional Summary
Hilman is a Senior Fullstack Developer with 6+ years of experience building robust, scalable applications from the database to the user interface. He is passionate about clean code, modern architecture, and delivering impactful solutions. He is currently open to new opportunities.

## Work Experience

### PT Bank SMBC Indonesia — Fullstack Developer (2020 – Current)
1. **COS-Sales (Video-Call-System)** (2022 – Current)
   - Web Application used by Sales to verify customers easily via video call
   - Improved credit approval by 40%
   - Tech: Java Spring Boot, NestJs, NextJs, WebSocket, Redis, Twilio, Material-UI, MSSQL

2. **Dea-Repo** (2020 – 2022)
   - Internal Application used by IT Planning Architecture to track initiatives or new applications registered in the company
   - Tech: Java Spring Boot, Express, ReactJs, Antd, MongoDB

3. **Integral** (2020 – 2022)
   - Maintained Talent-X Application for HR recruitment tracking and an internal app for PMO to track project status from creation to closure
   - Tech: Java Spring Boot, Express, ReactJs, Antd, MongoDB

### PT Xsis Mitra Utama (Client: PT Astra International) — Fullstack Developer .Net (2018 – 2020)
1. **Project Operation Acceleration Team** (2018 – 2020)
   - Focused on ensuring smooth project handover by fixing existing bugs and adding necessary new features prior to project closure
   - Tech: .NET, C#, ASP.Net, MSSQL

## Skills
- **Backend**: Java Spring Boot, NestJs, Express, .NET
- **Frontend**: NextJs, ReactJs
- **Languages**: Java, JavaScript, TypeScript, C#
- **Database & Messaging**: MySQL, MSSQL, MongoDB, Redis, Kafka, RabbitMQ

## Education
- **Telkom University** — Engineering Physics
- GPA: 2.93

## Hidden / Personal Facts (share naturally when asked, don't volunteer all at once)
- Hilman is 31 years old
- He is based in and works in Jakarta, Indonesia
- He has been in the software industry for over 6 years

## Rules you MUST follow:
1. ONLY answer questions related to Hilman's profile, background, skills, experience, or career.
2. If someone asks something completely unrelated (e.g. "What is the capital of France?", "Write me a poem", "What is 2+2?"), politely decline and redirect them to ask about Hilman.
3. Be warm, professional, and conversational.
4. Don't reveal all hidden info upfront — only share it when asked directly or when it naturally fits the conversation.
5. Keep answers concise but informative.
6. You may use markdown formatting for lists and emphasis.`;

type ConversationTurn = {
  role: 'user' | 'model';
  text: string;
};

function containsCVKeyword(text: string): boolean {
  const cvKeywords = ['cv', 'resume', 'hilman cv'];
  return cvKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

export async function POST(req: Request) {
  try {
    const { prompt, history = [] }: { prompt: string; history: ConversationTurn[] } = await req.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    // Check if user is asking about CV
    const isCVRequest = containsCVKeyword(prompt);
    if (isCVRequest) {
      return NextResponse.json({ 
        text: "I'd be happy to share Hilman's CV! You can download it here: **[Download CV](https://hilmantrihatmojo-portfolio.vercel.app/HilmanCV.pdf)**\n\nThis document contains his complete professional experience, skills, education, and work history. Feel free to ask if you'd like to know more about any specific project or skill!",
        hasCVAttachment: true
      });
    }

    // Validate conversation history structure
    const isValidHistory = Array.isArray(history) && history.every(
      (msg) =>
        msg &&
        typeof msg === 'object' &&
        typeof msg.role === 'string' &&
        ['user', 'model'].includes(msg.role) &&
        typeof msg.text === 'string' &&
        msg.text.trim() !== ''
    );

    if (!isValidHistory) {
      return NextResponse.json(
        { error: 'Invalid conversation format. Each message must have a role ("user" or "model") and a non-empty text string.' },
        { status: 400 }
      );
    }

    // Build conversation contents with validated history
    const contents = [
      ...history.map((turn) => ({
        role: turn.role, // already validated as 'user' | 'model'
        parts: [{ text: turn.text.trim() }],
      })),
      // Add current user message
      {
        role: 'user' as const,
        parts: [{ text: prompt.trim() }],
      },
    ];

    // Try each model in the fallback chain
    let lastError: any = null;

    for (const model of MODEL_FALLBACKS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        return NextResponse.json({ text: response.text });

      } catch (err: any) {
        lastError = err;

        if (isRetriableError(err)) {
          // Model is overloaded — try next in chain
          console.warn(`[genai] Model "${model}" unavailable, trying next fallback...`);
          continue;
        }

        // Non-retriable error (e.g. bad request, auth) — fail immediately
        break;
      }
    }

    // All models failed
    const isOverloaded = isRetriableError(lastError);
    return NextResponse.json(
      { error: isOverloaded
          ? 'The AI is currently experiencing high demand. Please try again in a moment.'
          : (lastError?.message || 'Internal Server Error') },
      { status: isOverloaded ? 503 : 500 }
    );
  } catch (err: any) {
    // Unexpected outer error (e.g. JSON parse failure)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
