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
const PORT = 4000;
const TOKEN = process.env.TOKEN;

const allowedOrigins = [
   'https://aquin.vercel.app',
   'https://aquin.xyz',
   'https://loono.boo',
   'https://ely-lemon.vercel.app' // ← ДОБАВЛЕНО
 ];

app.use(cors({
   origin: true,
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Handle preflight requests
app.options('*', cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   res.header('Access-Control-Allow-Credentials', 'true');
   
   if (req.method === 'OPTIONS') {
      res.sendStatus(200);
   } else {
      next();
   }
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
      const { messages } = req.body;
    //   console.log('message', messages);

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
         res.json({ reply: botReply });
      } catch (error) {
         console.error('Error fetching from OpenAI:', error);
         res.status(500).json({ error: 'Ошибка при отправке запроса' });
      }
   } catch (error) {
      console.log('Error');
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
