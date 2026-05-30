#!/usr/bin/env bash
# Start the live-AI backend. Requires ANTHROPIC_API_KEY in backend/.env
set -e
cd "$(dirname "$0")"
if [ ! -d .venv ]; then
  python3 -m venv .venv
  ./.venv/bin/pip install -q -r requirements.txt
fi
./.venv/bin/uvicorn main:app --reload --port 8000
