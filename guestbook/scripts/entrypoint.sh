#!/bin/sh

set -eu

POSTGRES_USER=$(cat /run/secrets/guestbook_db_user)
POSTGRES_PASSWORD=$(cat /run/secrets/guestbook_db_password)
POSTGRES_DB=$(cat /run/secrets/guestbook_db_name)

export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_DB

exec "$@"