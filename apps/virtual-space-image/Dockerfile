FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    sudo \
    lsb-release && \
    apt-get clean

# Create a non-root user `coder`
RUN useradd -m coder && echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to non-root user
USER coder
WORKDIR /home/coder

# Install Coder CLI
RUN curl -fsSL https://coder.com/install.sh | sh

# Expose port 80
EXPOSE 80

# Run Coder server using non-root user and new flag
CMD ["coder", "server", "--http-address", "0.0.0.0:8080"]
