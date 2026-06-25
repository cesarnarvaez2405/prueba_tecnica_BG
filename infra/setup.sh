#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  Prueba Técnica BG — Setup${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo -e "${YELLOW}⚠  .env file not found${NC}"
  echo "Creating .env from .env.example..."
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
  echo -e "${GREEN}✓ Created .env file${NC}"
  echo -e "${YELLOW}⚠  Please edit .env and add your credentials before continuing${NC}"
  echo ""
  read -p "Press enter to continue after editing .env, or Ctrl+C to exit..."
else
  echo -e "${GREEN}✓ .env file found${NC}"
fi

echo ""
echo "Checking prerequisites..."

if ! command -v docker &>/dev/null; then
  echo -e "${RED}✗ Docker is not installed${NC}"
  echo "Install with: sudo dnf install -y docker && sudo systemctl start docker && sudo systemctl enable docker"
  exit 1
fi
echo -e "${GREEN}✓ Docker $(docker --version | cut -d' ' -f3 | tr -d ',')${NC}"

if ! docker compose version &>/dev/null; then
  echo -e "${RED}✗ Docker Compose v2 is not available${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Docker Compose $(docker compose version --short)${NC}"

echo ""
echo "Building and starting services..."
echo ""

docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d --build

echo ""
echo "Waiting for services to be ready..."
sleep 8

echo ""
echo "Running migrations..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" exec back npm run migration:run:prod

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  Services Status${NC}"
echo -e "${CYAN}=========================================${NC}"
docker compose -f "$SCRIPT_DIR/docker-compose.yml" ps

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  Service URLs${NC}"
echo -e "${CYAN}=========================================${NC}"
echo -e "${GREEN}API:${NC}         http://localhost:1010/prueba-tecnica-bg/server"
echo -e "${GREEN}Swagger:${NC}     http://localhost:1010/docs"
echo -e "${GREEN}PostgreSQL:${NC}  localhost:5433"
echo ""

echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  Useful Commands${NC}"
echo -e "${CYAN}=========================================${NC}"
echo "  Logs:              docker compose logs -f"
echo "  Logs (back):       docker compose logs -f back"
echo "  Stop all:          docker compose down"
echo "  Restart:           docker compose restart back"
echo ""

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
