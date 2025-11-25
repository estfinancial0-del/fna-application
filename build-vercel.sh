#!/bin/bash
set -e

echo "=== Building FNA Application for Vercel ==="

# Step 1: Build the frontend
echo ""
echo "[1/5] Building frontend with Vite..."
pnpm vite build

# Step 2: Build the Vercel serverless function
echo ""
echo "[2/5] Building Vercel serverless function..."
pnpm esbuild server/_core/vercel.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/vercel-api.mjs

# Step 3: Create Vercel output structure
echo ""
echo "[3/5] Creating Vercel output structure..."
rm -rf .vercel/output
mkdir -p .vercel/output

# Step 4: Copy static files
echo ""
echo "[4/5] Copying static files..."
mkdir -p .vercel/output/static
cp -r dist/public/* .vercel/output/static/

# Step 5: Create API serverless function
echo ""
echo "[5/5] Creating API serverless function..."
mkdir -p .vercel/output/functions/api.func
cp dist/vercel-api.mjs .vercel/output/functions/api.func/index.mjs

# Create function configuration
cat > .vercel/output/functions/api.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs"
}
EOF

# Create routing configuration
cat > .vercel/output/config.json << 'EOF'
{
  "version": 3,
  "routes": [
    {
      "src": "^/api/(.*)$",
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
echo "📦 Output structure:"
echo "   .vercel/output/"
echo "   ├── static/              Frontend (HTML, CSS, JS)"
echo "   ├── functions/api.func/  Backend API"
echo "   └── config.json          Routing"
echo ""
echo "✅ Ready for deployment to Vercel!"
