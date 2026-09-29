#!/bin/sh
# Cloudflare Pages build: copies only the public site into dist/, so notes
# like README.md and tailwind.config.js are never served.
set -e
rm -rf dist
mkdir dist
cp -r index.html download.html assets dist/
find dist -name 'README.md' -delete
