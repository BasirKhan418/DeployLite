#!/bin/bash

echo "🔃 Starting MySQL..."
service mysql start

# Wait until MySQL is ready
until mysqladmin ping -h 127.0.0.1 --silent; do
  echo "⏳ Waiting for MySQL to be ready..."
  sleep 2
done

# Initialize DB + User
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS \`${WORDPRESS_DB_NAME}\`;
CREATE USER IF NOT EXISTS '${WORDPRESS_DB_USER}'@'127.0.0.1' IDENTIFIED BY '${WORDPRESS_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${WORDPRESS_DB_NAME}\`.* TO '${WORDPRESS_DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF

# wp-config.php setup
if [ ! -f /var/www/html/wp-config.php ]; then
  echo "⚙️ Generating wp-config.php..."
  cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php

  sed -i "s/database_name_here/${WORDPRESS_DB_NAME}/" /var/www/html/wp-config.php
  sed -i "s/username_here/${WORDPRESS_DB_USER}/" /var/www/html/wp-config.php
  sed -i "s/password_here/${WORDPRESS_DB_PASSWORD}/" /var/www/html/wp-config.php
  sed -i "s/localhost/127.0.0.1/" /var/www/html/wp-config.php
fi

# Start Apache
echo "🚀 Starting Apache..."
exec apachectl -D FOREGROUND
