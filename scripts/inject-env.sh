#!/bin/sh
# Runtime env injection script for Next.js standalone build.
# 
# Problem: NEXT_PUBLIC_* vars are inlined by Next.js at BUILD time.
# If they're not available during 'next build' (common in Docker/Railway),
# they get replaced with 'undefined' in the compiled JS.
#
# Solution: This script replaces placeholder strings in the compiled .next
# JS files with actual runtime env values BEFORE starting the server.
#
# Usage: sh inject-env.sh && bun server.js

set -e

echo "[Lamma] Injecting runtime env vars into built files..."

# Directory containing Next.js standalone build
STATIC_DIR="/app/.next/static"
SERVER_DIR="/app/.next/server"

# Clerk publishable key
CLERK_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}"

if [ -z "$CLERK_KEY" ]; then
  echo "[Lamma] WARNING: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set!"
  echo "[Lamma] Clerk auth will not work. Set this variable in Railway."
else
  echo "[Lamma] Injecting Clerk publishable key..."
  
  # Replace 'undefined' and empty string placeholders with actual key
  # in all .js files under .next/static and .next/server
  find "$STATIC_DIR" "$SERVER_DIR" -name "*.js" -type f 2>/dev/null | while read -r file; do
    # Only process files that contain Clerk-related code
    if grep -q "clerk\|CLERK\|publishable" "$file" 2>/dev/null; then
      # Replace the pattern where Next.js inlined 'undefined' for the key
      sed -i "s|\"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\",\"undefined\"|\"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\",\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
      sed -i "s|publishableKey:\"undefined\"|publishableKey:\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
      sed -i "s|publishableKey:undefined|publishableKey:\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
      sed -i "s|\"pk_test_undefined\"|\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
      sed -i "s|\"pk_live_undefined\"|\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
    fi
  done
  
  # Also inject into the standalone server.js and chunks
  find /app -maxdepth 1 -name "server.js" -type f 2>/dev/null | while read -r file; do
    if grep -q "clerk\|CLERK\|publishable" "$file" 2>/dev/null; then
      sed -i "s|publishableKey:\"undefined\"|publishableKey:\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
      sed -i "s|publishableKey:undefined|publishableKey:\"$CLERK_KEY\"|g" "$file" 2>/dev/null || true
    fi
  done

  echo "[Lamma] Clerk key injected successfully."
fi

# Inject Clerk URL settings
for var in NEXT_PUBLIC_CLERK_SIGN_IN_URL NEXT_PUBLIC_CLERK_SIGN_UP_URL NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL; do
  val=$(eval echo "\$$var")
  if [ -n "$val" ]; then
    find "$STATIC_DIR" "$SERVER_DIR" -name "*.js" -type f 2>/dev/null | while read -r file; do
      if grep -q "$var" "$file" 2>/dev/null; then
        sed -i "s|\"$var\",\"undefined\"|\"$var\",\"$val\"|g" "$file" 2>/dev/null || true
        sed -i "s|\"$var\",undefined|\"$var\",\"$val\"|g" "$file" 2>/dev/null || true
      fi
    done
  fi
done

echo "[Lamma] Runtime env injection complete."
