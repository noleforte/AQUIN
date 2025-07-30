const axios = require('axios');

async function testServer() {
   const testUrl = 'https://chat-ai-back-h9wn.onrender.com/health';
   
   try {
      console.log('Testing server health...');
      const response = await axios.get(testUrl);
      console.log('Health check response:', response.data);
   } catch (error) {
      console.error('Health check failed:', error.message);
   }
   
   try {
      console.log('\nTesting chat endpoint...');
      const chatResponse = await axios.post('https://chat-ai-back-h9wn.onrender.com/chat', {
         messages: [
            { message: 'Hello', isUser: true },
            { message: 'Hi there!', isUser: false }
         ]
      }, {
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         }
      });
      
      console.log('Chat response:', chatResponse.data);
   } catch (error) {
      console.error('Chat test error:', error.response?.data || error.message);
   }
}

testServer(); 