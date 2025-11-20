#!/bin/bash
set -e

echo "Building application..."
pnpm build

echo "Creating Vercel output structure..."
rm -rf .vercel/output
mkdir -p .vercel/output

# Copy static files
echo "Copying static files..."
mkdir -p .vercel/output/static
cp -r dist/public/* .vercel/output/static/

# Create serverless function
echo "Creating serverless function..."
mkdir -p .vercel/output/functions/index.func
cp dist/index.js .vercel/output/functions/index.func/index.mjs

# Create function config
cat > .vercel/output/functions/index.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs"
}
EOF

# Create config.json
cat > .vercel/output/config.json << 'EOF'
{
  "version": 3,
  "routes": [
    {
      "src": "^/api/(.*)$",
      "dest": "/index"
    },
    {
      "src": "^/trpc/(.*)$",
      "dest": "/index"
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

echo "Vercel output structure created successfully!"
