# Vercel API Deployment Guide

## Quick Fix for CORS Issues

This solution uses Vercel serverless functions to proxy requests to your backend, avoiding CORS issues entirely.

## Files to Deploy

1. **`vercel-api/chat.js`** - The API function that proxies requests
2. **`vercel.json`** - Vercel configuration
3. **Updated `index.html`** - Uses `/api/chat` instead of direct backend calls

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

1. **Create a new Vercel project:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Deploy the API function:**
   ```bash
   # Navigate to your project directory
   cd "aquin-main WEB"
   
   # Deploy to Vercel
   vercel
   ```

3. **Set up the API route:**
   - Copy `vercel-api/chat.js` to `api/chat.js` in your Vercel project
   - Copy `vercel.json` to your project root
   - Deploy again: `vercel --prod`

### Option 2: Manual Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Create a new project**
3. **Upload these files:**
   - `api/chat.js` (copy from `vercel-api/chat.js`)
   - `vercel.json`
   - Your updated `index.html`

### Option 3: GitHub Integration

1. **Push your code to GitHub**
2. **Connect your GitHub repo to Vercel**
3. **Vercel will automatically deploy the API functions**

## How It Works

1. **Frontend** makes requests to `/api/chat` (same domain)
2. **Vercel function** forwards requests to your backend
3. **No CORS issues** because frontend and API are on same domain

## Testing

After deployment, your chat should work without CORS errors. The API function will:

- Handle CORS headers automatically
- Forward requests to your backend
- Return responses to your frontend
- Provide proper error handling

## Environment Variables

If your backend requires authentication, add environment variables in Vercel:

1. **Go to your Vercel project dashboard**
2. **Settings → Environment Variables**
3. **Add any required variables**

## Troubleshooting

### If the API function fails:

1. **Check Vercel function logs** in the dashboard
2. **Verify your backend URL** is correct in `chat.js`
3. **Test the backend directly** to ensure it's working
4. **Check environment variables** if needed

### If you get 404 errors:

1. **Ensure `api/chat.js` is in the correct location**
2. **Verify `vercel.json` configuration**
3. **Redeploy the project**

## Benefits

- ✅ **No CORS issues** - Same domain requests
- ✅ **Better performance** - Serverless functions
- ✅ **Automatic scaling** - Vercel handles load
- ✅ **Easy deployment** - Git integration
- ✅ **Free tier** - Generous limits

## Alternative: Direct Backend Fix

If you prefer to fix the backend directly:

1. **Redeploy your backend** with the updated `server.js`
2. **Update your frontend** to use the direct backend URL
3. **Test the connection** using the provided test files

The Vercel API solution is recommended as it's more reliable and easier to maintain. 