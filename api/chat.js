export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  console.log('Received messages:', messages);
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

  try {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are KURO, a friendly and helpful assistant.' },
        ...(messages || []).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.message
        }))
      ]
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenAI response status:', openaiRes.status);
    const data = await openaiRes.json();
    console.log('OpenAI response data:', JSON.stringify(data, null, 2));

    // Проверяем ошибки OpenAI
    if (openaiRes.status !== 200) {
      if (openaiRes.status === 429) {
        return res.status(200).json({ 
          reply: "Sorry, I'm a bit busy right now! Please try again later or check your OpenAI quota." 
        });
      } else if (data.error) {
        return res.status(200).json({ 
          reply: `Sorry, there was an error: ${data.error.message || 'Unknown error'}` 
        });
      }
    }

    const reply = data.choices?.[0]?.message?.content || 'No answer';
    console.log('Final reply:', reply);

    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    res.status(200).json({ 
      reply: "Sorry, I'm having trouble connecting right now. Please try again later!" 
    });
  }
} 