FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    git \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --no-cache-dir --break-system-packages yt-dlp bgutil-ytdlp-pot-provider

# PO token provider sidecar: solves YouTube's bot-check algorithmically
# (no cookies, no IP reputation dependency), so it keeps working from any
# host indefinitely. Pinned tag for a reproducible build.
RUN git clone --single-branch --branch 1.3.1 --depth 1 \
    https://github.com/Brainicism/bgutil-ytdlp-pot-provider.git /opt/bgutil \
    && cd /opt/bgutil/server && npm ci && npx tsc

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV PYTHON_PATH=python3
ENV NODE_ENV=production

EXPOSE 4000

# Docker caches the pip install layer above indefinitely across deploys, so
# both packages go stale even on unrelated redeploys - upgrade both together
# at boot. Upgrading only yt-dlp while leaving the PO token plugin pinned
# risks a version mismatch where the plugin silently stops actually
# supplying a valid token even though it still registers as available.
CMD ["sh", "-c", "\
    pip3 install --quiet --no-cache-dir --break-system-packages -U yt-dlp bgutil-ytdlp-pot-provider && \
    node /opt/bgutil/server/build/main.js --port 4416 & \
    for i in $(seq 1 30); do curl -sf http://127.0.0.1:4416/ping >/dev/null 2>&1 && break; sleep 0.5; done && \
    node dist/server.js \
"]
