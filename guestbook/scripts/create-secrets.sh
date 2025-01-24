#!/bin/sh

# Check if three arguments are provided
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <DB_USER> <DB_PASSWORD> <DB_NAME>"
  exit 1
fi

# Assign input arguments to variables
DB_USER=$1
DB_PASSWORD=$2
DB_NAME=$3

# Create the secrets directory if it doesn't exist
SECRETS_DIR="./secrets"
mkdir -p "$SECRETS_DIR"

# Create secret files and write content
echo "$DB_USER" > "$SECRETS_DIR/guestbook_db_user.txt"
echo "$DB_PASSWORD" > "$SECRETS_DIR/guestbook_db_password.txt"
echo "$DB_NAME" > "$SECRETS_DIR/guestbook_db_name.txt"

# Set permissions to 666
chmod 666 "$SECRETS_DIR/guestbook_db_user.txt"
chmod 666 "$SECRETS_DIR/guestbook_db_password.txt"
chmod 666 "$SECRETS_DIR/guestbook_db_name.txt"

echo "Secrets created and permissions set in $SECRETS_DIR"