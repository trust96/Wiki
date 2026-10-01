#!/usr/bin/env bash
set -euo pipefail

docker compose --profile prod up --build -d
