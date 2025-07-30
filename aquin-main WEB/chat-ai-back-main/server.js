const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const bot1Prompt = JSON.parse(
   fs.readFileSync('./prompts/aqin.json', 'utf8')
);

const app = express();
const PORT = process.env.PORT || 4000;
const TOKEN = process.env.TOKEN;

// Updated CORS configuration for Render deployment
const allowedOrigins = [
   'https://ely.vercel.app', 
   'https://elyangel.world', 
   'https://loono.boo',
   'https://ely-lemon.vercel.app',
   'http://localhost:3000',
   'http://localhost:5173',
   'http://127.0.0.1:3000',
   'http://127.0.0.1:5173'
];

// Enable CORS for all routes with more permissive settings
app.use((req, res, next) => {
   const origin = req.headers.origin;
   
   console.log('Request origin:', origin);
   console.log('Request method:', req.method);
   console.log('Request headers:', req.headers);
   
   // Always allow the specific domain
   if (origin === 'https://ely-lemon.vercel.app') {
      res.header('Access-Control-Allow-Origin', origin);
   } else if (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      allowedOrigins.includes(origin)
   ) {
      res.header('Access-Control-Allow-Origin', origin);
   } else if (!origin) {
      // Allow requests with no origin
      res.header('Access-Control-Allow-Origin', '*');
   } else {
      console.log('Blocked origin:', origin);
      // For now, allow all origins to debug the issue
      res.header('Access-Control-Allow-Origin', origin);
   }
   
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Origin, X-Requested-With');
   res.header('Access-Control-Allow-Credentials', 'true');
   res.header('Access-Control-Max-Age', '86400'); // 24 hours
   
   // Handle preflight requests
   if (req.method === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      res.status(200).end();
      return;
   }
   
   next();
});

app.use(bodyParser.json());

// Add health check endpoint
app.get('/health', (req, res) => {
   res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Настройка ограничения частоты запросов
const limiter = rateLimit({
   windowMs: 1 * 60 * 1000,
   max: 60,
   message: 'Too many requests from this IP, please try again later.'
});

app.use('/chat', limiter);

app.post('/chat', async (req, res) => {
   try {
      console.log('Received chat request from:', req.headers.origin);
      console.log('Request body:', req.body);
      
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
         console.error('Invalid messages format:', messages);
         return res.status(400).json({ error: 'Invalid messages format' });
      }

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
      } = bot1Prompt;

      // Очищаем HTML-теги из всех сообщений
      const cleanedMessages = messages.map((msg) =>
         msg.message
            .replace(/<.*?>/g, '')
            .replace(/^You:\s*/, '')
            .trim()
      );

      // Конвертируем сообщения в формат OpenAI API
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

      // Ограничиваем историю (например, до 10 последних сообщений)
      const trimmedHistory = chatHistory.slice(-10);

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

      try {
         const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
               model: 'gpt-3.5-turbo',
               messages: promptMessages
            },
            {
               headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  'Content-Type': 'application/json'
               }
            }
         );

         const botReply = response.data.choices[0].message.content.trim();
         console.log('OpenAI response:', botReply);
         res.json({ reply: botReply });
      } catch (error) {
         console.error('Error fetching from OpenAI:', error.response?.data || error.message);
         res.status(500).json({ 
            error: 'Error processing request',
            details: error.response?.data?.error?.message || error.message 
         });
      }
   } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
         error: 'Internal server error',
         details: error.message 
      });
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
