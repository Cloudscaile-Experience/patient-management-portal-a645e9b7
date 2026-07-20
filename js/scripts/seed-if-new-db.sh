#!/bin/sh
set -e

if node dist/db/is-new-db.js; then
	echo "Fresh database detected — seeding initial data..."
	node dist/seed/seed.js
else
	echo "Existing data detected — skipping seed."
fi
