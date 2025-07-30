const fetch = require('node-fetch');

async function testServer() {
   const testUrl = 'https://chat-ai-back-h9wn.onrender.com/health';
   
   try {
      console.log('Testing server health...');
      const response = await fetch(testUrl);
      const data = await response.json();
      console.log('Health check response:', data);
   } catch (error) {
      console.error('Health check failed:', error.message);
   }
   
   try {
      console.log('\nTesting chat endpoint...');
      const chatResponse = await fetch('https://chat-ai-back-h9wn.onrender.com/chat', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify({
            messages: [
               { message: 'Hello', isUser: true },
               { message: 'Hi there!', isUser: false }
            ]
         })
      });
      
      if (chatResponse.ok) {
         const chatData = await chatResponse.json();
         console.log('Chat response:', chatData);
      } else {
         console.error('Chat test failed:', chatResponse.status, chatResponse.statusText);
         const errorText = await chatResponse.text();
         console.error('Error details:', errorText);
      }
   } catch (error) {
      console.error('Chat test error:', error.message);
   }
}

testServer(); 