FROM ubuntu:22.04

# ENV
ENV DEBIAN_FRONTEND=noninteractive
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=20.9.0
ENV CODE_SERVER_VERSION=4.89.1
ENV PASSWORD=changeme

# Install dependencies
RUN apt update && apt install -y \
    curl wget gnupg lsb-release sudo git build-essential \
    ca-certificates unzip bash software-properties-common

# Install Code Server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Install Node.js and Python
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    bash -c "source /root/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION && nvm alias default $NODE_VERSION" && \
    echo 'export NVM_DIR="/root/.nvm"' >> /root/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /root/.bashrc && \
    apt install -y python3 python3-pip && \
    apt clean

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
