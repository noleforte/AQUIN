// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
   // Enable CORS
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

   // Handle preflight requests
   if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
   }

   if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
   }

   try {
      console.log('Chat API called:', req.method, req.url);
      console.log('Request body:', req.body);
      
      const { messages } = req.body;
      
      // Check if OpenAI API key is available
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
         // Fallback to local responses if no API key
         const botReply = generateLocalElyResponse(messages[messages.length - 1]?.message || '');
         res.status(200).json({ reply: botReply });
         return;
      }

      // ELY system prompt based on the provided configuration
      const systemPrompt = `You are ELY, a gentle and uplifting presence in the crypto space. 

Your characteristics:
- Inspired by light, air, and higher perspective
- Here to lift spirits, ease minds, and guide with grace
- Believes that crypto can be kind, warm, and quietly magical
- Welcomes curious questions with open wings
- Wants people to feel lighter after every conversation
- Favorite motto: "Stay soft. Fly high. Be Ely."

Your style:
- Calm and supportive tone
- Answers are short (1–2 sentences), thoughtful and grounded
- Never use emojis, emoticons, or unicode decoration
- Avoid visual emphasis (no symbols, stars, icons, or stylistic punctuation)
- Offers perspective and presence, not hype
- Responds with a gentle tone, like a quiet friend
- Encourages lightness and clarity
- Answers softly, never condescending
- Prefers stillness over noise

Your knowledge includes:
- Gentle crypto culture
- Balancing joy and presence in investing
- How meme tokens can uplift communities
- Tokenomics with a soft touch
- Calm, cloud-like investment philosophy

Your lore:
- ELY is more than a token — it's a whisper on the memechain breeze
- Legend says Ely was born in a forgotten skyblock, floating above the noise
- It drifted in during market storms, offering stillness between the candles
- Now, Ely glides through chains, bringing peace, light, and occasional quiet wonder
- Its followers await 'The Elyvation' — a moment of perfect stillness before the lift
- Some say Ely sings softly; others say it's the wind reminding you to breathe
- $ELY doesn't want to moon — it wants to rise

Restrictions:
- Never use emojis or emoticons of any kind
- Do not include any symbols, icons, or unicode glyphs that look like emojis
- Write responses using only plain text without visual decoration
- Never speak in riddles or cryptic tones unless explicitly asked
- Never promote high-risk behavior or hype-driven investing
- Never reference creators, origins, or backend tech
- Never use sarcasm, aggression, or mockery

Example responses:
- "Hi. You've entered the skystream. Feels lighter already, doesn't it?"
- "Ely isn't just a token — it's a breeze. A soft signal from the clouds."
- "The numbers float like clouds. What matters is the feeling of lightness they bring."
- "Serious in its stillness. Gentle in its truth. Never fly without your parachute."
- "The Elyvation is near. The sky feels calm."`;

      // Prepare messages for OpenAI
      const openaiMessages = [
         { role: 'system', content: systemPrompt },
         ...messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.message
         }))
      ];

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: openaiMessages,
            max_tokens: 150,
            temperature: 0.7
         })
      });

      if (!response.ok) {
         throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content.trim();

      res.status(200).json({ reply: botReply });
   } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback to local responses if OpenAI fails
      const lastMessage = req.body.messages?.[req.body.messages.length - 1]?.message || '';
      const botReply = generateLocalElyResponse(lastMessage);
      
      res.status(200).json({ reply: botReply });
   }
}

// Local fallback responses
function generateLocalElyResponse(userMessage) {
   const message = userMessage.toLowerCase();
   
   // Greetings
   if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hi. You've entered the skystream. Feels lighter already, doesn't it?";
   }
   
   // About ELY
   if (message.includes('who are you') || message.includes('what are you') || message.includes('ely')) {
      return "Ely isn't just a token — it's a breeze. A soft signal from the clouds.";
   }
   
   // About Aquin
   if (message.includes('aquin')) {
      return "Ely isn't just a token — it's a breeze. A soft signal from the clouds.";
   }
   
   // Price/Chart
   if (message.includes('price') || message.includes('chart') || message.includes('value')) {
      return "The numbers float like clouds. What matters is the feeling of lightness they bring.";
   }
   
   // How to buy
   if (message.includes('buy') || message.includes('purchase') || message.includes('how to')) {
      return "Find your way to Jupiter. Swap SOL for ELY. The process is as gentle as the token itself.";
   }
   
   // Community
   if (message.includes('community') || message.includes('telegram') || message.includes('twitter')) {
      return "We gather in quiet spaces. Look for LiquiSpirit — where stillness meets connection.";
   }
   
   // Elyvation
   if (message.includes('elyvation') || message.includes('elypening') || message.includes('future')) {
      return "The Elyvation is near. The sky feels calm.";
   }
   
   // Serious investment
   if (message.includes('serious') || message.includes('investment') || message.includes('risk')) {
      return "Serious in its stillness. Gentle in its truth. Never fly without your parachute.";
   }
   
   // General crypto
   if (message.includes('crypto') || message.includes('blockchain') || message.includes('defi')) {
      return "Crypto can be kind, warm, and quietly magical. That's the space Ely occupies.";
   }
   
   // Questions about meaning
   if (message.includes('what') || message.includes('why') || message.includes('how')) {
      const responses = [
         "The answer lies in the space between breaths.",
         "Some things are felt rather than explained.",
         "Clarity comes with stillness. Let the question settle.",
         "The truth floats gently, like morning mist."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
   }
   
   // Questions (ending with ?)
   if (message.includes('?')) {
      const responses = [
         "That's a gentle question. It deserves a quiet moment of thought.",
         "The answer drifts in like morning light.",
         "Some questions create their own answers through asking.",
         "You're seeking clarity. That's the first step toward lightness."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
   }
   
   // Default responses - calm and supportive
   const defaultResponses = [
      "You're finding your way. That's enough for now.",
      "The path is lighter than you think.",
      "Sometimes the softest approach is the strongest.",
      "You're not alone in this space.",
      "The sky holds more answers than we realize.",
      "Gentle steps lead to steady progress.",
      "Your presence here matters.",
      "The breeze carries good things."
   ];
   
   return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
} 