# Deploying to Cloudflare Pages

This guide will help you deploy the crypto chart application to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Node.js**: Ensure you have Node.js 18+ installed locally

## Method 1: Deploy via Cloudflare Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. **Push to Git**: Ensure your code is pushed to a Git repository
2. **Check Build Script**: Verify `package.json` has the build script:
   ```json
   {
     "scripts": {
       "build": "tsc && vite build"
     }
   }
   ```

### Step 2: Deploy via Cloudflare Dashboard

1. **Login to Cloudflare**: Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Navigate to Pages**: Click on "Pages" in the sidebar
3. **Create New Project**: Click "Create a project"
4. **Connect Repository**: Choose your Git provider and select your repository
5. **Configure Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty if repo root)
6. **Environment Variables** (Optional):
   - `VITE_API_BASE_URL`: Your API base URL
   - `VITE_WEBSOCKET_URL`: Your WebSocket URL
7. **Deploy**: Click "Save and Deploy"

### Step 3: Configure Custom Domain (Optional)

1. **Add Custom Domain**: In your Pages project settings
2. **Configure DNS**: Follow Cloudflare's DNS setup instructions
3. **SSL Certificate**: Cloudflare provides free SSL certificates

## Method 2: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

## Method 3: Deploy via GitHub Actions

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: crypto-chart
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Step 2: Add Secrets to GitHub

1. **Get Cloudflare API Token**: 
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create token with "Cloudflare Pages" permissions
2. **Get Account ID**: 
   - Go to Cloudflare Dashboard → Right sidebar shows Account ID
3. **Add GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

## Environment Variables

### Production Environment Variables

Set these in your Cloudflare Pages project settings:

```env
VITE_API_BASE_URL=https://crypto-pump.bigtutu.workers.dev
VITE_WEBSOCKET_URL=wss://crypto-pump.bigtutu.workers.dev/ws
```

### Environment-Specific Configuration

The app automatically detects the environment:
- **Development**: `http://localhost:8787`
- **Production**: Uses environment variables or defaults

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check `npm run build` works locally
   - Verify all dependencies are in `package.json`
   - Check TypeScript compilation errors

2. **404 Errors**:
   - Ensure `dist` directory contains built files
   - Check build output directory setting

3. **Environment Variables**:
   - Verify variables are set in Cloudflare Pages settings
   - Check variable names start with `VITE_`

4. **WebSocket Connection**:
   - Ensure WebSocket URL is correct
   - Check CORS settings on your WebSocket server

### Debug Build Locally

```bash
# Install dependencies
npm install

# Build project
npm run build

# Preview build
npm run preview
```

## Performance Optimization

### Build Optimization

1. **Code Splitting**: Vite automatically splits code
2. **Tree Shaking**: Unused code is removed
3. **Minification**: Production builds are minified
4. **Gzip Compression**: Cloudflare automatically compresses

### CDN Benefits

- **Global CDN**: Content served from edge locations
- **Automatic SSL**: Free SSL certificates
- **DDoS Protection**: Built-in protection
- **Caching**: Automatic caching for static assets

## Monitoring

### Cloudflare Analytics

1. **Traffic Analytics**: View in Cloudflare Dashboard
2. **Performance Metrics**: Core Web Vitals
3. **Error Tracking**: Check Pages deployment logs

### Custom Analytics

Add Google Analytics or other tracking:

```typescript
// In your app
if (import.meta.env.PROD) {
  // Initialize analytics
}
```

## Security

### Security Headers

Cloudflare automatically adds security headers:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Content-Security-Policy`

### Environment Variables

- Never commit `.env` files
- Use Cloudflare Pages environment variables
- Rotate API keys regularly

## Support

- **Cloudflare Docs**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community**: [community.cloudflare.com](https://community.cloudflare.com)
- **GitHub Issues**: Report bugs in your repository 