#!/bin/sh
set -e

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

"$SCRIPT_DIR/scripts/migrate.sh"
"$SCRIPT_DIR/scripts/seed-if-new-db.sh"

echo "Starting server..."
exec node dist/server.js
