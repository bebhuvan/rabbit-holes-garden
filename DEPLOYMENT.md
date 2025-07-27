# Deployment Guide: Cloudflare Pages + Vercel API

This guide walks you through deploying your Rabbit Holes blog with the hybrid architecture:
- **Cloudflare Pages**: Static Astro site (fast, free CDN)
- **Vercel**: AI API endpoints (serverless functions)

## 🚀 Quick Deployment Steps

### 1. Deploy API to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY

# Note your Vercel URL (e.g., https://rabbit-holes-api.vercel.app)
```

### 2. Update Admin Interface

Edit `src/pages/admin.astro` and replace `your-api-app.vercel.app` with your actual Vercel URL:

```javascript
function getAPIBase() {
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://rabbit-holes-api.vercel.app'; // ← Your actual URL
}
```

### 3. Deploy Site to Cloudflare Pages

1. **Connect Repository**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Click "Create a project" → "Connect to Git"
   - Select your repository

2. **Configure Build**:
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   ```

3. **Deploy**: Cloudflare will build and deploy automatically

## 🔧 Complete Workflow

### Content Creation Process

1. **Generate Content**:
   - Visit `https://your-site.pages.dev/admin`
   - Enter your API key
   - Generate posts using AI

2. **Save Content**:
   - Click "Export for Manual Save"
   - Copy the markdown content
   - Create file in `src/content/posts/`

3. **Deploy**:
   ```bash
   git add src/content/posts/new-post.md
   git commit -m "Add AI-generated post"
   git push
   ```
   - Cloudflare Pages rebuilds automatically

## 📋 Environment Variables

### Vercel (for API)
```bash
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

### Cloudflare Pages (optional)
No environment variables needed - the static site calls the Vercel API directly.

## 🛠️ Local Development

### Run Vercel API Locally
```bash
# Terminal 1: Start Vercel dev server
vercel dev

# Terminal 2: Start Astro dev server  
npm run dev
```

### Test the Integration
1. Visit `http://localhost:4321/admin`
2. Add your API key
3. Test post generation

## 🎯 Production URLs

After deployment, you'll have:
- **Main Site**: `https://your-site.pages.dev`
- **Admin Interface**: `https://your-site.pages.dev/admin`
- **API**: `https://your-api.vercel.app/api/generate-post`

## 🔒 Security Notes

### API Keys
- Never commit API keys to git
- Store in Vercel environment variables
- Users enter keys in the admin interface

### CORS
The Vercel API is configured to accept requests from any origin (`*`). For production, consider restricting to your domain:

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://your-site.pages.dev');
```

## 💰 Cost Breakdown

### Free Tier Limits
- **Cloudflare Pages**: 500 builds/month, unlimited bandwidth
- **Vercel**: 100GB bandwidth, 100k function invocations/month
- **Total**: $0/month for most blogs

### If You Exceed Free Limits
- **Cloudflare Pages Pro**: $20/month (unlikely needed)
- **Vercel Pro**: $20/month (only if you hit function limits)

## 🐛 Troubleshooting

### Common Issues

**API Not Working**:
```bash
# Check Vercel deployment
vercel logs

# Test API directly
curl -X POST https://your-api.vercel.app/api/generate-post \
  -H "Content-Type: application/json" \
  -d '{"inputType":"text","content":"test","settings":{"provider":"openai","apiKey":"your-key"}}'
```

**Build Failures**:
```bash
# Test build locally
npm run build

# Check Cloudflare Pages build logs
```

**CORS Errors**:
- Ensure your Vercel API includes CORS headers
- Check the API URL in your admin interface

## 🔄 Alternative: Netlify Functions

If you prefer Netlify over Vercel:

1. **Move API files**:
   ```bash
   mkdir netlify/functions
   mv api/generate-post.js netlify/functions/
   ```

2. **Update function format**:
   ```javascript
   exports.handler = async (event, context) => {
     // Function code here
   }
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

## 🎉 You're Done!

Your blog now has:
- ✅ Lightning-fast static site on Cloudflare's global CDN
- ✅ AI-powered content generation via serverless functions
- ✅ Zero ongoing costs (likely)
- ✅ Scalable architecture that grows with your needs

Happy blogging! 🚀