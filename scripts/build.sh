#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ADMIN_USER="${ADMIN_USER:-p80pe}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

# Only write Basic Auth headers when a password is provided; otherwise skip so the site still builds.
if [[ -n "${ADMIN_PASSWORD}" ]]; then
  cat > _headers <<EOF
/admin
  Basic-Auth: ${ADMIN_USER}:${ADMIN_PASSWORD}

/admin/*
  Basic-Auth: ${ADMIN_USER}:${ADMIN_PASSWORD}
EOF
  echo "Generated _headers with Basic Auth for /admin (user: ${ADMIN_USER})."
else
  echo "WARNING: ADMIN_PASSWORD not set; skipping Basic Auth headers. Set ADMIN_PASSWORD (and optionally ADMIN_USER) in Netlify env to protect /admin." >&2
  # leave any existing _headers untouched if present
fi
