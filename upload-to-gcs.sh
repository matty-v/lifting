#!/bin/bash

# Upload PWA files to Google Cloud Storage
# Usage: ./upload-to-gcs.sh YOUR_BUCKET_NAME

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 BUCKET_NAME"
    echo "Example: $0 my-bucket-name"
    exit 1
fi

BUCKET_NAME=$1
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Uploading PWA files to gs://$BUCKET_NAME/..."

# Upload index.html
echo "  Uploading index.html..."
gsutil -h "Content-Type:text/html" \
       -h "Cache-Control:no-cache, max-age=0" \
       cp index.html "gs://$BUCKET_NAME/"

# Upload service worker (no-cache is critical for SW updates)
echo "  Uploading sw.js..."
gsutil -h "Content-Type:application/javascript" \
       -h "Cache-Control:no-cache, max-age=0" \
       cp sw.js "gs://$BUCKET_NAME/"

# Upload manifest
echo "  Uploading manifest.json..."
gsutil -h "Content-Type:application/manifest+json" \
       -h "Cache-Control:no-cache, max-age=0" \
       cp manifest.json "gs://$BUCKET_NAME/"

# Upload icons
echo "  Uploading icons..."
gsutil -h "Content-Type:image/png" \
       -h "Cache-Control:public, max-age=31536000" \
       cp -r icons "gs://$BUCKET_NAME/"

echo ""
echo "Successfully uploaded PWA to gs://$BUCKET_NAME/"
echo "URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
