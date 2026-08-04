FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --no-cache-dir --break-system-packages yt-dlp

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV PYTHON_PATH=python3
ENV NODE_ENV=production

EXPOSE 4000

# Docker caches the pip install layer above indefinitely across deploys, so
# yt-dlp goes stale even on unrelated redeploys - YouTube breaks old
# extractors often enough that this matters. Upgrade at boot instead.
CMD ["sh", "-c", "pip3 install --quiet --no-cache-dir --break-system-packages -U yt-dlp && node dist/server.js"]
