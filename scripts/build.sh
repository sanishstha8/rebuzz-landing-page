#!/bin/sh
# Cloudflare build: copies only the public site into dist/, so notes
# like README.md and tailwind.config.js are never served.
set -e
rm -rf dist
mkdir dist
cp -r index.html robots.txt sitemap.xml _redirects assets dist/
find dist -name 'README.md' -delete
