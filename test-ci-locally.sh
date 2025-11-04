#!/bin/bash

set -e

echo "🧪 Testing CI workflow locally..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Start test databases
echo -e "${YELLOW}Step 1: Starting test databases...${NC}"
docker-compose -f docker-compose.test.yml up -d
echo "Waiting for databases to be ready..."
sleep 10
echo -e "${GREEN}✅ Databases started${NC}"
echo ""

# Step 2: Set environment variables
echo -e "${YELLOW}Step 2: Setting environment variables...${NC}"
export DB_HOST=localhost
export DB_PORT=5433
export DB_USERNAME=app
export DB_PASSWORD=app
export DB_NAME=shop_test
export REDIS_HOST=localhost
export REDIS_PORT=6380
export NODE_ENV=test
export SESSION_TOKEN=ce8d4e24ce258fe39d2bc6961812a8af197f9c8776bbe2e9f7dacc2adfd7dfcd
echo -e "${GREEN}✅ Environment variables set${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
cd monolith-api
npm ci --quiet
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Lint
echo -e "${YELLOW}Step 4: Running lint...${NC}"
npm run lint
echo -e "${GREEN}✅ Lint passed${NC}"
echo ""

# Step 5: Run migrations
echo -e "${YELLOW}Step 5: Running migrations...${NC}"
npm run migration:run
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Step 6: Seed test data
echo -e "${YELLOW}Step 6: Seeding test data...${NC}"
npm run seed:test
echo -e "${GREEN}✅ Test data seeded${NC}"
echo ""

# Step 7: Build
echo -e "${YELLOW}Step 7: Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Step 8: Start API server in background
echo -e "${YELLOW}Step 8: Starting API server...${NC}"
npm start &
API_PID=$!
echo "API PID: $API_PID"
sleep 10
echo -e "${GREEN}✅ API server started${NC}"
echo ""

# Step 9: Run k6 tests
echo -e "${YELLOW}Step 9: Running k6 tests...${NC}"
if k6 run tests/e2e-graphql.test.js; then
    echo -e "${GREEN}✅ k6 tests passed${NC}"
    TEST_RESULT=0
else
    echo -e "${RED}❌ k6 tests failed${NC}"
    TEST_RESULT=1
fi
echo ""

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
kill $API_PID 2>/dev/null || true
cd ..
docker-compose -f docker-compose.test.yml down
echo -e "${GREEN}✅ Cleanup completed${NC}"
echo ""

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! CI workflow is working correctly.${NC}"
else
    echo -e "${RED}❌ Tests failed. Please check the output above.${NC}"
fi

exit $TEST_RESULT
