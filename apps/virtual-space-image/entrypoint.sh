#!/bin/bash

# Fail if password is not set
if [ -z "$PASSWORD" ]; then
  echo "❌ ERROR: PASSWORD environment variable not set!"
  exit 1
fi

# Create config directory
mkdir -p /root/.config/code-server

# Write password-protected config
cat <<EOF > /root/.config/code-server/config.yaml
bind-addr: 0.0.0.0:80
auth: password
password: $PASSWORD
cert: false
EOF

# Optional: Clone a GitHub repo if REPO_URL is given
if [ -n "$REPO_URL" ]; then
  echo "📦 Cloning repo: $REPO_URL"
  mkdir -p /config/workspace && cd /config/workspace
  git clone "$REPO_URL" .
else
  echo "📁 No REPO_URL provided. Starting with blank workspace."
  mkdir -p /config/workspace
fi

# Install VS Code extensions
echo "🔧 Installing extensions..."
extensions=(
  formulahendry.auto-rename-tag
  formulahendry.code-runner
  rodrigovallades.es7-react-js-snippets
  ms-vscode.vscode-typescript-next
  pawelborkar.jellyfish
  ritwickdey.liveserver
  pkief.material-icon-theme
  esbenp.prettier-vscode
  bradlc.vscode-tailwindcss
)

for ext in "${extensions[@]}"; do
  code-server --install-extension "$ext"
done

echo "🔐 Starting Code Server with password protection..."
exec code-server --bind-addr 0.0.0.0:80
