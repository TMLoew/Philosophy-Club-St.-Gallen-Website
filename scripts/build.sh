#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ADMIN_USER="${ADMIN_USER:-p80pe}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

if [[ -z "${ADMIN_PASSWORD}" ]]; then
  echo "ERROR: ADMIN_PASSWORD is not set. Set it in Netlify environment to protect /admin." >&2
  exit 1
fi

cat > _headers <<EOF
/admin
  Basic-Auth: ${ADMIN_USER}:${ADMIN_PASSWORD}

/admin/*
  Basic-Auth: ${ADMIN_USER}:${ADMIN_PASSWORD}
EOF

echo "Generated _headers with Basic Auth for /admin (user: ${ADMIN_USER})."
