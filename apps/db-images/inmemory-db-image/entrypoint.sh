#!/bin/bash

# Validate required secret
if [ -z "$REDIS_PASSWORD" ]; then
  echo "ERROR: REDIS_PASSWORD not set!"
  exit 1
fi

# Generate redis.conf dynamically
cat <<EOF > /etc/redis/redis.conf
requirepass ${REDIS_PASSWORD}
appendonly yes
save 60 1000
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
