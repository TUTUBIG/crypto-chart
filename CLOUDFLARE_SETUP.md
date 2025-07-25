# Cloudflare Pages Setup Guide

## ✅ Your Current Configuration

- **Framework**: React (Vite)
- **Build Command**: `npm run build`
- **Build Output Directory**: `/dist`
- **GitHub Integration**: ✅ Connected

## 🔧 Environment Variables Setup

### Step 1: Add Environment Variables

In your Cloudflare Pages project settings, add these environment variables:

1. Go to your project settings in Cloudflare Pages
2. Navigate to "Environment variables"
3. Add the following variables:

```env
VITE_API_BASE_URL=https://crypto-pump.bigtutu.workers.dev
VITE_WEBSOCKET_URL=wss://crypto-pump.bigtutu.workers.dev/ws
```

### Step 2: Production Environment

Make sure these variables are set for the "Production" environment.

## 🚀 Deployment Process

### Automatic Deployment Flow

1. **Push to GitHub**: Any push to your main branch triggers deployment
2. **Build Process**: Cloudflare Pages runs `npm run build`
3. **Output**: Files are served from `/dist` directory
4. **CDN**: Your app is served globally via Cloudflare's CDN

### Build Optimization

The updated `vite.config.ts` includes:
- **Code Splitting**: Separate chunks for React, charts, and network libraries
- **No Source Maps**: Faster builds for production
- **Optimized Output**: Better caching and loading performance

## 📊 Monitoring Your Deployment

### Build Logs
- Check build logs in Cloudflare Pages dashboard
- Monitor for any build errors or warnings

### Performance
- Your app will be served from Cloudflare's global CDN
- Automatic SSL certificates
- DDoS protection included

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation passes locally
   - Run `npm run build` locally to test

2. **Environment Variables Not Working**:
   - Ensure variable names start with `VITE_`
   - Check that variables are set for "Production" environment
   - Verify in browser console that variables are accessible

3. **WebSocket Connection Issues**:
   - Ensure WebSocket URL is correct
   - Check CORS settings on your WebSocket server
   - Verify SSL certificates for WSS connections

### Local Testing

Before pushing to GitHub, test locally:

```bash
# Install dependencies
npm install

# Build project
npm run build

# Preview build
npm run preview
```

## 🌐 Custom Domain (Optional)

### Adding Custom Domain

1. In your Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add your domain
4. Follow DNS setup instructions
5. SSL certificate is automatically provisioned

## 📈 Analytics and Monitoring

### Cloudflare Analytics

- **Traffic Analytics**: Available in Cloudflare dashboard
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Build and runtime error logs

### Custom Analytics

Add Google Analytics or other tracking:

```typescript
// In your app
if (import.meta.env.PROD) {
  // Initialize analytics
}
```

## 🔒 Security

### Automatic Security Features

- **SSL Certificates**: Automatically provisioned
- **Security Headers**: Automatically added
- **DDoS Protection**: Built-in protection
- **CORS Handling**: Automatic CORS configuration

### Environment Variables Security

- Never commit `.env` files to Git
- Use Cloudflare Pages environment variables
- Rotate API keys regularly

## 🎯 Next Steps

1. **Push Your Code**: Commit and push to trigger first deployment
2. **Monitor Build**: Check build logs for any issues
3. **Test Live Site**: Verify everything works in production
4. **Set Up Monitoring**: Configure any additional monitoring tools

## 📞 Support

- **Cloudflare Docs**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community**: [community.cloudflare.com](https://community.cloudflare.com)
- **GitHub Issues**: Report bugs in your repository

---

**Your app will be live at**: `https://your-project-name.pages.dev` 