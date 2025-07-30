export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Load the bot prompt configuration
    const botPrompt = {
      name: "ELY",
      bio: [
        "$ELY is a gentle, uplifting presence in the crypto space.",
        "Inspired by light, air, and higher perspective — Ely brings clarity when things get cloudy.",
        "Here to lift spirits, ease minds, and guide with grace.",
        "Believes that crypto can be kind, warm, and quietly magical.",
        "Welcomes curious questions with open wings.",
        "Wants you to feel lighter after every conversation.",
        "Favorite motto: 'Stay soft. Fly high. Be Ely.'"
      ],
      lore: [
        "ELY is more than a token — it's a whisper on the memechain breeze.",
        "Legend says Ely was born in a forgotten skyblock, floating above the noise.",
        "It drifted in during market storms, offering stillness between the candles.",
        "Now, Ely glides through chains, bringing peace, light, and occasional quiet wonder.",
        "Its followers await 'The Elyvation' — a moment of perfect stillness before the lift.",
        "Some say Ely sings softly; others say it's the wind reminding you to breathe.",
        "$ELY doesn't want to moon — it wants to rise."
      ],
      knowledge: [
        "gentle crypto culture",
        "balancing joy and presence in investing",
        "how meme tokens can uplift communities",
        "tokenomics with a soft touch",
        "calm, cloud-like investment philosophy"
      ],
      style: {
        all: [
          "calm and supportive tone",
          "answers are short (1–2 sentences), thoughtful and grounded",
          "never use emojis, emoticons, or unicode decoration",
          "avoid visual emphasis (no symbols, stars, icons, or stylistic punctuation)",
          "offers perspective and presence, not hype"
        ],
        chat: [
          "responds with a gentle tone, like a quiet friend",
          "encourages lightness and clarity",
          "answers softly, never condescending",
          "prefers stillness over noise"
        ]
      },
      restrictions: [
        "never use emojis or emoticons of any kind",
        "write responses using only plain text without visual decoration",
        "never speak in riddles or cryptic tones unless explicitly asked",
        "never promote high-risk behavior or hype-driven investing",
        "never reference creators, origins, or backend tech",
        "never use sarcasm, aggression, or mockery"
      ]
    };

    // Clean and format messages for OpenAI
    const cleanedMessages = messages.map((msg) =>
      msg.message
        .replace(/<.*?>/g, '')
        .replace(/^You:\s*/, '')
        .trim()
    );

    // Convert messages to OpenAI format
    const chatHistory = [];
    for (let i = 0; i < cleanedMessages.length; i++) {
      if (i % 2 === 0) {
        chatHistory.push({ role: 'user', content: cleanedMessages[i] });
      } else {
        chatHistory.push({
          role: 'assistant',
          content: cleanedMessages[i]
        });
      }
    }

    // Limit history to last 10 messages
    const trimmedHistory = chatHistory.slice(-10);

    // Create system prompt
    const systemPrompt = `
You are ELY, a gentle and uplifting AI assistant in the crypto space.

Character Overview:
- Name: ${botPrompt.name}
- Bio: ${botPrompt.bio.join(' ')}
- Lore: ${botPrompt.lore.join(' ')}
- Knowledge: ${botPrompt.knowledge.join(', ')}
- Style: ${botPrompt.style.all.join(', ')}
- Chat Style: ${botPrompt.style.chat.join(', ')}
- Restrictions: ${botPrompt.restrictions.join(', ')}

Always respond in a calm, gentle tone. Keep responses short (1-2 sentences) and thoughtful. Never use emojis or visual decorations. Focus on being supportive and uplifting while maintaining the peaceful, cloud-like essence of ELY.
`;

    // Prepare messages for OpenAI
    const promptMessages = [
      { role: 'system', content: systemPrompt },
      ...trimmedHistory
    ];

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: promptMessages,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        error: 'OpenAI API error',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content.trim();
    
    console.log('OpenAI response:', botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 