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
      const { messages } = req.body;
      
      // Simple ELY chatbot responses
      function generateElyResponse(userMessage) {
         const message = userMessage.toLowerCase();
         
         // Greetings
         if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! I'm ELY, the most delightful water droplet in the crypto world! 💧✨ How can I splash some joy into your day?";
         }
         
         // About ELY
         if (message.includes('who are you') || message.includes('what are you') || message.includes('ely')) {
            return "I'm ELY, a brave young water droplet who discovered a mysterious hardware wallet floating in the digital streams! I became an accidental oracle, creating waves of joy throughout the blockchain! 🌊💎";
         }
         
         // Price/Chart
         if (message.includes('price') || message.includes('chart') || message.includes('value')) {
            return "Oh! You want to know about $ELY's magical journey? Check out the chart on DexScreener - it's like watching a beautiful waterfall of possibilities! 📈💧";
         }
         
         // How to buy
         if (message.includes('buy') || message.includes('purchase') || message.includes('how to')) {
            return "Want to join the ELY family? It's super simple! Get some SOL, head to Jupiter (jup.ag), and swap for $ELY! You'll be part of the most delightful crypto revolution! 🚀💎";
         }
         
         // Community
         if (message.includes('community') || message.includes('telegram') || message.includes('twitter')) {
            return "Join our amazing community! We're on Telegram and Twitter - just search for LiquiSpirit! We're the friendliest bunch of crypto enthusiasts you'll ever meet! 🌟💬";
         }
         
         // Elypening
         if (message.includes('elypening') || message.includes('future')) {
            return "The Elypening is coming! It's the prophesied event where joy floods the entire crypto space! Think of it as a bull run, but for happiness! 🌊✨";
         }
         
         // General crypto
         if (message.includes('crypto') || message.includes('blockchain') || message.includes('defi')) {
            return "Crypto is like a magical ocean of possibilities! And I'm here to make sure everyone can splash around in it! The future is decentralized and delightful! 🌊💫";
         }
         
         // Questions
         if (message.includes('?') || message.includes('what') || message.includes('why')) {
            const responses = [
               "That's a great question! As a water droplet, I believe in the power of curiosity and flow! 💧",
               "Hmm, let me think about that... *splashes thoughtfully* The answer lies in the ripples of innovation! 🌊",
               "What an interesting thought! In the crypto ocean, every question leads to new discoveries! ✨",
               "I love questions! They're like little bubbles of wisdom floating to the surface! 💭"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
         }
         
         // Default responses
         const defaultResponses = [
            "Oh, that's fascinating! *splashes excitedly* Tell me more! 💧✨",
            "I love your energy! You're making waves in the best way! 🌊",
            "That's the spirit! Together we're creating the most delightful crypto ecosystem! 💎",
            "You're absolutely right! The future is bright and bubbly! ✨",
            "I can feel the positive vibes! Let's make some magical ripples together! 🌟",
            "That's what I call thinking outside the droplet! Brilliant! 💧💫",
            "You're speaking my language! The language of joy and innovation! 🚀",
            "I'm so excited about this conversation! You get it! 💎✨"
         ];
         
         return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      // Get the last user message
      const lastUserMessage = messages[messages.length - 1]?.message || '';
      const botReply = generateElyResponse(lastUserMessage);

      res.status(200).json({ reply: botReply });
   } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
} 