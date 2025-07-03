FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt update && \
    apt install -y curl gnupg ca-certificates software-properties-common supervisor gettext-base && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs redis-server && \
    npm install -g redis-commander && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy files
COPY entrypoint.sh /entrypoint.sh
COPY supervisord.conf /etc/supervisord.conf
RUN chmod +x /entrypoint.sh

# Define exposed ports (can be overridden)
ENV REDIS_PORT=6379 \
    REDIS_UI_PORT=8081

EXPOSE 6379 8081

ENTRYPOINT ["/entrypoint.sh"]
