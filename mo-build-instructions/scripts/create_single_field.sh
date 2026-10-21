#!/usr/bin/env bash
# Create one ODP custom field via cURL (single-field example from the setup guide).
# Reads ODP_PRIVATE_API_KEY and ODP_REGION from the repo-root .env
# (variables already set in the shell take precedence).
# Usage: ./create_single_field.sh
set -euo pipefail

ENV_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/.env"
if [[ -f "$ENV_FILE" ]]; then
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
    value="${value%\"}"; value="${value#\"}"
    [[ -z "${!key:-}" ]] && export "$key=$value"
  done < <(grep -E '^(ODP_PRIVATE_API_KEY|ODP_REGION)=' "$ENV_FILE")
fi

: "${ODP_PRIVATE_API_KEY:?ODP_PRIVATE_API_KEY is not set in the environment or $ENV_FILE}"
REGION="${ODP_REGION:-us1}"

curl -sS -X POST "https://api.${REGION}.odp.optimizely.com/v3/schema/objects/customers/fields" \
  -H "x-api-key: ${ODP_PRIVATE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "esl_member_status",
    "display_name": "ESL Member Status",
    "type": "string",
    "public_read": true,
    "description": "Member vs Prospective Member"
  }' \
  -w '\nHTTP %{http_code}\n'
