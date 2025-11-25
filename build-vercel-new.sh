#!/bin/bash
set -e

echo "=== Building FNA Application for Vercel ==="

# Step 1: Build the application
echo ""
echo "[1/4] Building frontend and backend..."
pnpm build

# Step 2: Create Vercel output structure
echo ""
echo "[2/4] Creating Vercel output structure..."
rm -rf .vercel/output
mkdir -p .vercel/output

# Step 3: Copy static files
echo ""
echo "[3/4] Copying static files to .vercel/output/static/..."
mkdir -p .vercel/output/static
cp -r dist/public/* .vercel/output/static/

# Step 4: Create serverless function for API
echo ""
echo "[4/4] Creating API serverless function..."
mkdir -p .vercel/output/functions/api.func

# Copy the compiled server code
cp dist/index.js .vercel/output/functions/api.func/index.mjs

# Also copy node_modules that are needed at runtime
# (Vercel will handle this automatically for external packages)

# Create function configuration
cat > .vercel/output/functions/api.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs",
  "environment": {}
}
EOF

# Create routing configuration
cat > .vercel/output/config.json << 'EOF'
{
  "version": 3,
  "routes": [
    {
      "src": "^/api/oauth/(.*)$",
      "dest": "/api"
    },
    {
      "src": "^/api/trpc/(.*)$",
      "dest": "/api"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "^/(.*)$",
      "dest": "/index.html"
    }
  ]
}
EOF

echo ""
echo "=== Build Complete ==="
echo ""
echo "Output structure:"
echo "  📁 .vercel/output/"
echo "    📁 static/           → Frontend files (served by Vercel CDN)"
echo "    📁 functions/"
echo "      📁 api.func/       → Backend API (serverless function)"
echo "    📄 config.json       → Routing rules"
echo ""
echo "Ready for deployment!"
