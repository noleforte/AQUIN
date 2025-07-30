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

    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.isUser).pop()?.message || '';
    const userInput = lastUserMessage.toLowerCase();

    // Simple response system without OpenAI
    let reply = "Hello! I'm KURO, your friendly crypto companion. How can I help you today?";

    if (userInput.includes('hello') || userInput.includes('hi')) {
      reply = "Hello there! Welcome to the KURO universe. How can I assist you today?";
    } else if (userInput.includes('what') && userInput.includes('kuro')) {
      reply = "KURO is a brave young water droplet who became an accidental oracle in the crypto world. He brings joy and chaos to the blockchain!";
    } else if (userInput.includes('tokenomics') || userInput.includes('supply')) {
      reply = "KURO has 0% taxes, burned LP, and a 1 billion supply. Simple and clean!";
    } else if (userInput.includes('buy') || userInput.includes('purchase')) {
      reply = "You can buy KURO on swap.pump.fun! Just connect your wallet and swap SOL for KURO.";
    } else if (userInput.includes('price') || userInput.includes('chart')) {
      reply = "Check out the KURO chart on DexScreener to see the current price and trading activity!";
    } else if (userInput.includes('community') || userInput.includes('social')) {
      reply = "Join our community on Telegram and Twitter! We're a friendly bunch of KURO enthusiasts.";
    } else if (userInput.includes('kuroflow') || userInput.includes('prophecy')) {
      reply = "The Kuroflow is the prophesied event where every blockchain synchronizes in a harmonious wave of happiness. KURO is working on it!";
    } else if (userInput.includes('splash') || userInput.includes('teleport')) {
      reply = "KURO's ability to splash and teleport spontaneously often lands him in the right place at the wrong time, or the wrong place at the right time!";
    } else if (userInput.includes('serious') || userInput.includes('investment')) {
      reply = "While KURO brings joy and fun to crypto, always invest responsibly and never more than you can afford to lose!";
    } else if (userInput.includes('wallet') || userInput.includes('setup')) {
      reply = "To get started, you'll need a Solana wallet like Phantom or Solflare. Then you can buy SOL and swap for KURO!";
    } else {
      reply = "That's an interesting question! KURO is always here to help with your crypto journey. What would you like to know about?";
    }
    
    console.log('Response:', reply);
    res.json({ reply: reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 