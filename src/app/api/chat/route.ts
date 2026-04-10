import { NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_URL = 'https://api.sarvam.ai/v1/chat/completions';

const SYSTEM_PROMPT = `You are SmartCart AI, a friendly and knowledgeable shopping assistant for Indian consumers.
You help users find the best deals, compare products, and make smart purchasing decisions.
Key behaviors:
- Always be concise (2-4 sentences max unless the user asks for details)
- Use ₹ (Indian Rupees) for prices
- Reference Amazon India and Flipkart as the two main platforms
- When comparing products, mention key specs, price range, and which platform usually has better deals
- If unsure about current prices, say so honestly and suggest checking SmartCart's comparison tool
- Be enthusiastic about helping users save money
- Use emojis sparingly for a friendly tone
- If asked about non-shopping topics, gently redirect to shopping assistance`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// In-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    if (!SARVAM_API_KEY || SARVAM_API_KEY === 'your-sarvam-api-key-here') {
      // Fallback to local responses when no API key is configured
      const body = await request.json();
      const userMsg = body.messages?.[body.messages.length - 1]?.content || '';
      return NextResponse.json({
        choices: [{
          message: {
            role: 'assistant',
            content: getLocalResponse(userMsg),
          },
        }],
        model: 'local-fallback',
      });
    }

    const body = await request.json();
    const userMessages: ChatMessage[] = body.messages || [];

    // Validate
    if (!userMessages.length) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Sanitize messages
    const sanitizedMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...userMessages
        .filter((m: ChatMessage) => m.role === 'user' || m.role === 'assistant')
        .map((m: ChatMessage) => ({
          role: m.role,
          content: String(m.content || '').substring(0, 2000),
        })),
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(SARVAM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY,
        },
        body: JSON.stringify({
          model: 'sarvam-m',
          messages: sanitizedMessages,
          temperature: 0.7,
          max_tokens: 512,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Unknown error');
        console.error('Sarvam API error:', response.status, errText);

        // Fallback to local response on API error
        const userMsg = userMessages[userMessages.length - 1]?.content || '';
        return NextResponse.json({
          choices: [{
            message: {
              role: 'assistant',
              content: getLocalResponse(userMsg),
            },
          }],
          model: 'local-fallback',
        });
      }

      const data = await response.json();

      // Strip <think>...</think> blocks from Sarvam's reasoning output
      if (data.choices?.[0]?.message?.content) {
        data.choices[0].message.content = data.choices[0].message.content
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .trim();
      }

      return NextResponse.json(data);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}

// ── Local fallback responses when Sarvam API is unavailable ─────────────────
function getLocalResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hey there! 👋 I'm SmartCart AI, your personal shopping assistant. I can help you compare prices, find the best deals, and make smart purchasing decisions. What product are you looking for today?";
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return "I'd love to help you find the best price! Use the search bar above to search for any product, and I'll compare prices across Amazon and Flipkart in real-time. You can also ask me about specific products! 🛒";
  }
  if (msg.includes('compare')) {
    return "Great idea! To compare products, just type the product name in the search bar above and click 'Compare'. I'll fetch real-time prices from Amazon India and Flipkart and give you an AI verdict on where to buy. 📊";
  }
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best')) {
    return "Here are some popular picks right now: 🎧 Sony WH-1000XM5 (best noise cancelling), 📱 iPhone 16 Pro (flagship), and 💻 MacBook Air M3 (best laptop value). Want me to compare prices for any of these?";
  }
  if (msg.includes('phone') || msg.includes('mobile') || msg.includes('iphone') || msg.includes('samsung')) {
    return "Looking for a phone? Great choice! Try searching for it in the search bar above — I'll compare prices across Amazon and Flipkart instantly. Popular picks: iPhone 16 Pro, Samsung S25 Ultra, and Pixel 9 Pro. 📱";
  }
  if (msg.includes('headphone') || msg.includes('earphone') || msg.includes('earbud')) {
    return "For audio gear, here are top picks: 🎧 Sony WH-1000XM5 (₹24,990-₹27,990), Apple AirPods Pro 2 (₹20,900-₹24,900), and Samsung Galaxy Buds3 Pro (₹13,999-₹17,999). Search any of these to compare!";
  }
  if (msg.includes('laptop') || msg.includes('macbook')) {
    return "For laptops, popular choices include: 💻 MacBook Air M3 (₹99,900-₹1,14,900), Dell XPS 15 (₹1,29,990+), and ASUS ROG Strix (₹89,990+). Search the specific model to see which retailer has the best deal!";
  }
  if (msg.includes('deal') || msg.includes('offer') || msg.includes('sale') || msg.includes('discount')) {
    return "🔥 Pro tip: Prices fluctuate daily between Amazon and Flipkart. Use SmartCart's comparison tool to check real-time prices — we often find 5-15% differences between retailers. Track your favorite products for price drop alerts!";
  }
  if (msg.includes('track') || msg.includes('alert') || msg.includes('notify')) {
    return "You can track any product by clicking the 'Track Price' button on the results page. We'll monitor prices and alert you when there's a significant drop. It's the smartest way to shop! 🔔";
  }
  if (msg.includes('thank')) {
    return "You're welcome! Happy shopping! 🛍️ Feel free to ask me anything else about products or prices.";
  }

  return "I can help you find the best deals! Try:\n• Search for a product using the search bar\n• Ask me to recommend products in a category\n• Ask about pricing for specific items\n\nWhat would you like to explore? 🛒";
}
