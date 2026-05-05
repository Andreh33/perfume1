#!/usr/bin/env bash
# Smoke tests post-deploy. Uso: ./scripts/verify-deploy.sh https://solperfumesarabes.com
set -euo pipefail

URL="${1:-${NEXT_PUBLIC_APP_URL:-}}"
if [[ -z "$URL" ]]; then
  echo "Uso: $0 https://tu-dominio.com"
  exit 1
fi

GOLD='\033[33m'
GREEN='\033[32m'
RED='\033[31m'
RESET='\033[0m'

pass() { echo -e "  ${GREEN}✓${RESET} $1"; }
fail() { echo -e "  ${RED}✗${RESET} $1"; FAILED=1; }

FAILED=0

echo -e "${GOLD}━━━ Sol Perfumes Árabes — Smoke tests ━━━${RESET}"
echo "URL: $URL"
echo ""

check() {
  local label="$1"
  local url="$2"
  local expect="${3:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
  if [[ "$code" == "$expect" ]]; then
    pass "$label ($code)"
  else
    fail "$label esperado=$expect recibido=$code · $url"
  fi
}

check "Home"                  "$URL/"
check "Catálogo"              "$URL/perfumes"
check "Ferias"                "$URL/ferias"
check "Blog"                  "$URL/blog"
check "Sitemap"               "$URL/sitemap.xml"
check "Robots"                "$URL/robots.txt"
check "Manifest"              "$URL/manifest.webmanifest"
check "OG default"            "$URL/opengraph-image"
check "iCal"                  "$URL/api/ferias/ical"
check "Admin (debe redirigir)" "$URL/admin/dashboard"  302

echo ""
echo "Validación de iCal:"
if curl -s "$URL/api/ferias/ical" | head -1 | grep -q "BEGIN:VCALENDAR"; then
  pass "iCal devuelve BEGIN:VCALENDAR"
else
  fail "iCal NO devuelve un calendario válido"
fi

echo ""
if [[ $FAILED -eq 0 ]]; then
  echo -e "${GREEN}Todos los smoke tests pasan.${RESET}"
else
  echo -e "${RED}Algunos tests han fallado. Revisa los logs de Vercel.${RESET}"
  exit 1
fi
