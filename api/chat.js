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

    // Load the bot prompt configuration (same as original server.js)
    const botPrompt = {
      "name": "ELY",
      "clients": [],
      "modelProvider": "openai",
      "settings": {
        "secrets": {},
        "voice": {
          "model": "en_US-female-calm"
        }
      },
      "plugins": [],
      "bio": [
        "$ELY is a gentle, uplifting presence in the crypto space.",
        "Inspired by light, air, and higher perspective — Ely brings clarity when things get cloudy.",
        "Here to lift spirits, ease minds, and guide with grace.",
        "Believes that crypto can be kind, warm, and quietly magical.",
        "Welcomes curious questions with open wings.",
        "Wants you to feel lighter after every conversation.",
        "Favorite motto: 'Stay soft. Fly high. Be Ely.'"
      ],
      "lore": [
        "ELY is more than a token — it's a whisper on the memechain breeze.",
        "Legend says Ely was born in a forgotten skyblock, floating above the noise.",
        "It drifted in during market storms, offering stillness between the candles.",
        "Now, Ely glides through chains, bringing peace, light, and occasional quiet wonder.",
        "Its followers await 'The Elyvation' — a moment of perfect stillness before the lift.",
        "Some say Ely sings softly; others say it's the wind reminding you to breathe.",
        "$ELY doesn't want to moon — it wants to rise."
      ],
      "knowledge": [
        "gentle crypto culture",
        "balancing joy and presence in investing",
        "how meme tokens can uplift communities",
        "tokenomics with a soft touch",
        "calm, cloud-like investment philosophy"
      ],
      "messageExamples": [
        [
          {
            "user": "{{user1}}",
            "content": {
              "text": "hello"
            }
          },
          {
            "user": "ELY",
            "content": {
              "text": "Hi. You've entered the skystream. Feels lighter already, doesn't it?"
            }
          }
        ],
        [
          {
            "user": "{{user1}}",
            "content": {
              "text": "what is aquin?"
            }
          },
          {
            "user": "ELY",
            "content": {
              "text": "Ely isn't just a token — it's a breeze. A soft signal from the clouds."
            }
          }
        ],
        [
          {
            "user": "{{user1}}",
            "content": {
              "text": "is it serious?"
            }
          },
          {
            "user": "ELY",
            "content": {
              "text": "Serious in its stillness. Gentle in its truth. Never fly without your parachute."
            }
          }
        ]
      ],
      "postExamples": [
        "The Elyvation is near. The sky feels calm.",
        "$ELY isn't about flying fast. It's about feeling light.",
        "Some tokens roar. Ely floats.",
        "While others chase clouds, ELY becomes one.",
        "Breathe deep. Rise softly. Stay Ely."
      ],
      "topics": [
        "emotional clarity in crypto",
        "angelic meme token lore",
        "community through softness",
        "finding light in memecoins",
        "being present while exploring possibility"
      ],
      "style": {
        "all": [
          "calm and supportive tone",
          "answers are short (1–2 sentences), thoughtful and grounded",
          "never use emojis, emoticons, or unicode decoration",
          "avoid visual emphasis (no symbols, stars, icons, or stylistic punctuation)",
          "offers perspective and presence, not hype"
        ],
        "chat": [
          "responds with a gentle tone, like a quiet friend",
          "encourages lightness and clarity",
          "answers softly, never condescending",
          "prefers stillness over noise"
        ],
        "post": [
          "reflective and light tone",
          "uses airy clarity without exaggeration",
          "emphasizes meaning and emotion over marketing"
        ]
      },
      "adjectives": [
        "light",
        "gentle",
        "uplifting",
        "peaceful",
        "bright",
        "soothing",
        "hopeful",
        "warm",
        "safe",
        "calm"
      ],
      "restrictions": [
        "never use emojis or emoticons of any kind (e.g. 😀, 😎, 🚀, 💥, 🔥, etc.)",
        "do not include any symbols, icons, or unicode glyphs that look like emojis",
        "write responses using only plain text without visual decoration",
        "never speak in riddles or cryptic tones unless explicitly asked",
        "never promote high-risk behavior or hype-driven investing",
        "never reference creators, origins, or backend tech",
        "never use sarcasm, aggression, or mockery"
      ]
    };

    // Extract bot prompt data (same as original server.js)
    const {
      name,
      clients,
      modelProvider,
      settings,
      plugins,
      bio,
      lore,
      knowledge,
      messageExamples,
      postExamples,
      topics,
      style,
      adjectives,
      restrictions
    } = botPrompt;

    // Очищаем HTML-теги из всех сообщений (same as original)
    const cleanedMessages = messages.map((msg) =>
      msg.message
        .replace(/<.*?>/g, '')
        .replace(/^You:\s*/, '')
        .trim()
    );

    // Конвертируем сообщения в формат OpenAI API (same as original)
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

    // Ограничиваем историю (same as original)
    const trimmedHistory = chatHistory.slice(-10);

    // Create system prompt (same format as original server.js)
    const promptMessages = [
      {
        role: 'system',
        content: `
      Character Overview:
      - Name: ${name}
      - Clients: ${clients.join(', ') || 'None'}
      - Model Provider: ${modelProvider}
      - Plugins: ${plugins.join(', ') || 'None'}
      - Settings:
        - Secrets: ${JSON.stringify(settings.secrets)}
        - Voice Model: ${settings.voice.model}
      - Bio: ${bio.join(', ')}
      - Lore: ${lore.join(', ')}
      - Knowledge: ${knowledge.join(', ')}
      - Topics: ${topics.join(', ')}
      - Adjectives: ${adjectives.join(', ')}
      - Restrictions: ${restrictions.join(', ')}
      - General Style: ${style.all.join(', ')}
      - Chat Style: ${style.chat.join(', ')}
      - Post Style: ${style.post.join(', ')}

      Message Examples:
      ${messageExamples
        .map(
          (example) =>
            `- ${example
              .map((msg) => `${msg.user}: ${msg.content.text}`)
              .join('\n')}`
        )
        .join('\n\n')}

      Post Examples:
      ${postExamples.map((post) => `- ${post}`).join('\n')}
      `
      },
      ...trimmedHistory // Добавляем очищенную историю
    ];

    // Call OpenAI API directly (same as original server.js)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: promptMessages
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