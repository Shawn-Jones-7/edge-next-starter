#!/usr/bin/env bash
set -euo pipefail

ROOT="${CONDUCTOR_ROOT_PATH:-$(pwd)}"
WS="${CONDUCTOR_WORKSPACE_PATH:-$(pwd)}"

cd "$WS"

echo "[conductor-setup] workspace: $WS"
echo "[conductor-setup] root:      $ROOT"

# 1. .env.local：优先用你本地真正的配置，没有的话再用 example 兜底
if [ -f "$ROOT/.env.local" ]; then
  echo "[conductor-setup] copy .env.local from root"
  cp "$ROOT/.env.local" .env.local
elif [ -f "$ROOT/.env.local.example" ] && [ ! -f .env.local ]; then
  echo "[conductor-setup] create .env.local from .env.local.example"
  cp "$ROOT/.env.local.example" .env.local
fi

# 2. .dev.vars：同样优先用你本地版本，没有就从 example 拷贝
if [ -f "$ROOT/.dev.vars" ]; then
  echo "[conductor-setup] copy .dev.vars from root"
  cp "$ROOT/.dev.vars" .dev.vars
elif [ -f "$ROOT/.dev.vars.example" ] && [ ! -f .dev.vars ]; then
  echo "[conductor-setup] create .dev.vars from .dev.vars.example"
  cp "$ROOT/.dev.vars.example" .dev.vars
fi

# 3. 安装依赖（pnpm 是这个仓库的推荐包管理器）
if command -v pnpm >/dev/null 2>&1; then
  echo "[conductor-setup] pnpm install"
  pnpm install
else
  echo "[conductor-setup] ERROR: pnpm not found, please install pnpm >= 8 first." >&2
  exit 1
fi

# 4. 本地数据库迁移（D1 的 schema 建好）
# 如果你暂时还没配 Cloudflare / D1，可以先注释掉这一段
if pnpm run -s db:migrate:local >/dev/null 2>&1; then
  echo "[conductor-setup] pnpm db:migrate:local"
  pnpm db:migrate:local
else
  echo "[conductor-setup] skip db:migrate:local (script missing or failed)"
fi

echo "[conductor-setup] done."