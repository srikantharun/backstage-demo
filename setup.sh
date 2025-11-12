#!/bin/bash
set -e

echo "=================================================="
echo "Backstage Demo Setup Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18 or higher is required. Current: $(node --version)${NC}"
    echo "Install with: brew install node@18"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK: $(node --version)${NC}"

# Check yarn
echo -e "${YELLOW}Checking yarn...${NC}"
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}Yarn not found. Installing...${NC}"
    npm install -g yarn
fi
echo -e "${GREEN}✓ Yarn version: $(yarn --version)${NC}"

# Check if already initialized
if [ -f "package.json" ]; then
    echo -e "${YELLOW}Backstage already initialized. Skipping creation step.${NC}"
else
    echo ""
    echo -e "${YELLOW}Creating Backstage app...${NC}"
    echo "This will take a few minutes..."
    echo ""

    # Create Backstage app
    npx @backstage/create-app@latest --path . --skip-install

    echo -e "${GREEN}✓ Backstage app created${NC}"
fi

# Install dependencies
echo ""
echo -e "${YELLOW}Installing dependencies (this takes 5-10 minutes)...${NC}"
yarn install

echo ""
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check for GitHub token
echo ""
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}=================================================="
    echo "GitHub Token Required"
    echo "=================================================="
    echo ""
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes: repo, workflow, read:org, read:user, user:email"
    echo "4. Copy the token"
    echo ""
    echo "Then run:"
    echo "  export GITHUB_TOKEN=ghp_your_token_here"
    echo "  yarn dev"
    echo ""
    echo -e "${NC}"
else
    echo -e "${GREEN}✓ GITHUB_TOKEN is set${NC}"
fi

# Success message
echo ""
echo -e "${GREEN}=================================================="
echo "✓ Setup Complete!"
echo "==================================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Create GitHub token if you haven't:"
echo "   https://github.com/settings/tokens"
echo ""
echo "2. Export the token:"
echo "   export GITHUB_TOKEN=ghp_your_token_here"
echo ""
echo "3. Start Backstage:"
echo "   yarn dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "See SETUP.md for detailed instructions."
echo ""
