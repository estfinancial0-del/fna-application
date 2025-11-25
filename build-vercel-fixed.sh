#!/bin/bash
set -e

echo "Building application..."
pnpm build

echo "Creating Vercel output structure..."
rm -rf .vercel/output
mkdir -p .vercel/output

# Copy static files to Vercel's static directory
echo "Copying static files..."
mkdir -p .vercel/output/static
cp -r dist/public/* .vercel/output/static/

# Create API serverless function
echo "Creating API serverless function..."
mkdir -p .vercel/output/functions/api.func

# Create a wrapper that only handles API routes
cat > .vercel/output/functions/api.func/index.mjs << 'WRAPPER_EOF'
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// Import the compiled server code
import("./server.mjs").then(({ appRouter, createContext, registerOAuthRoutes }) => {
  const app = express();
  
  // Configure body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // OAuth routes
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Export for Vercel
  export default app;
}).catch(console.error);
WRAPPER_EOF

# Copy the compiled server code
cp dist/index.js .vercel/output/functions/api.func/server.mjs

# Create function config
cat > .vercel/output/functions/api.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs"
}
EOF

# Create config.json with proper routing
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

echo "Vercel output structure created successfully!"
echo ""
echo "Structure:"
echo "  .vercel/output/static/        - Static files (HTML, CSS, JS)"
echo "  .vercel/output/functions/api.func/ - API serverless function"
echo "  .vercel/output/config.json    - Routing configuration"
