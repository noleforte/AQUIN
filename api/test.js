module.exports = async function handler(req, res) {
   // Enable CORS
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

   console.log('Test API called:', req.method, req.url);
   
   // Handle preflight requests
   if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
   }

   res.status(200).json({ 
      message: 'API is working!',
      method: req.method,
      url: req.url
   });
} 