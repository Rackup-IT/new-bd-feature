import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Simple AI improvement using a mock service for now
    // In production, you would use OpenAI, Claude, or another AI service
    const improvedText = await improveTextWithAI(text);

    return NextResponse.json({ improvedText });
  } catch (error) {
    console.error("AI improve error:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}

async function improveTextWithAI(text: string): Promise<string> {
  // Mock AI improvement - replace with actual AI service
  // You can replace this with actual AI service calls like:
  // - OpenAI GPT API
  // - Anthropic Claude API  
  // - Google Gemini API
  // - Or any other AI text improvement service

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For now, return a simple improvement
  let improved = text;
  
  // Basic improvements
  improved = improved.replace(/\bi\b/g, "I");
  improved = improved.replace(/\bim\b/g, "I'm");
  improved = improved.replace(/\bdont\b/g, "don't");
  improved = improved.replace(/\bcant\b/g, "can't");
  improved = improved.replace(/\bwont\b/g, "won't");
  improved = improved.replace(/\bits\b/g, "it's");
  improved = improved.replace(/\byour\b/g, "you're");
  improved = improved.replace(/\btheir\b/g, "they're");
  
  // Capitalize first letter of sentences
  improved = improved.replace(/(^|[.!?]\s+)([a-z])/g, (match, punct, letter) => {
    return punct + letter.toUpperCase();
  });

  return improved;
}
