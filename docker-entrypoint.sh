#!/bin/sh
set -eu

: "${NODE_RED_CREDENTIAL_SECRET:?Falta NODE_RED_CREDENTIAL_SECRET}"
: "${MQTT_USER:?Falta MQTT_USER}"
: "${MQTT_PASSWORD:?Falta MQTT_PASSWORD}"
: "${PGHOST:?Falta PGHOST}"
: "${PGPORT:?Falta PGPORT}"
: "${PGDATABASE:?Falta PGDATABASE}"
: "${PGUSER:?Falta PGUSER}"
: "${PGPASSWORD:?Falta PGPASSWORD}"

if [ -z "${NODE_RED_PASSWORD:-}" ]; then
  echo "ADVERTENCIA: NODE_RED_PASSWORD no está definido; el editor quedará sin autenticación." >&2
fi

node /data/generate-credentials.js
exec "$@"
