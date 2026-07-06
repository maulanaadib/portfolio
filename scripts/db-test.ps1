#!/usr/bin/env pwsh
# Test that your DATABASE_URL (Coolify Postgres) is reachable and schema can be pushed.
# Run this BEFORE doing the Vercel deploy to catch connectivity / credential issues early.
#
# Usage:
#   pwsh scripts/db-test.ps1
#
# It will:
#   1. Read DATABASE_URL from .env
#   2. Try to connect and run a simple query
#   3. Push the Prisma schema
#   4. (Optional, with -Seed) seed sample data
#   5. Report success or the exact error

param(
    [switch]$Seed
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Step($n, $title) { Write-Host "`n[$n] $title" -ForegroundColor Cyan }
function Ok($msg) { Write-Host "  OK: $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  WARN: $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "  FAIL: $msg" -ForegroundColor Red; exit 1 }

Step 1 "Checking .env"
if (-not (Test-Path ".env")) {
    Fail ".env not found. Copy .env.example to .env and set DATABASE_URL first."
}
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch 'DATABASE_URL="(postgresql://[^"]+)"') {
    Fail ".env DATABASE_URL is not set to a postgresql:// string. Update it."
}
$dbUrl = ($envContent | Select-String 'DATABASE_URL="(postgresql://[^"]+)"').Matches[0].Groups[1].Value
Ok "DATABASE_URL = $dbUrl"

if ($dbUrl -match 'placeholder|localhost:5432') {
    Fail "DATABASE_URL looks like a placeholder. Replace with your real Coolify connection string."
}

Step 2 "Checking Node + dependencies"
if (-not (Test-Path "node_modules/prisma")) {
    Warn "node_modules not installed, running npm install..."
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { Fail "npm install failed" }
}
Ok "Prisma installed"

Step 3 "Testing connection to database"
# Use prisma db push with --skip-generate to avoid regenerating client
# If DB is unreachable, this fails with the exact error
$env:DATABASE_URL = $dbUrl
try {
    $output = npx prisma db push --skip-generate --accept-data-loss 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host $output
        Fail "Cannot connect to database. Check that:"
        Write-Host "  - The DB is running in Coolify"
        Write-Host "  - The host/port is reachable from this machine (try: Test-NetConnection HOST -Port PORT)"
        Write-Host "  - The user/password in DATABASE_URL is correct"
        Write-Host "  - The DB accepts connections from your IP (check Coolify's network settings)"
    }
} catch {
    Fail "Connection test failed: $($_.Exception.Message)"
}
Ok "Connection works + schema is in sync"

Step 4 "Verifying tables exist"
$tables = node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const r = await p.\$queryRaw\`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename\`;
  console.log(JSON.stringify(r.map(t => t.tablename)));
  await p.\$disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
" 2>&1
if ($LASTEXITCODE -ne 0) {
    Fail "Could not query tables: $tables"
}
Write-Host "  Tables: $tables"
if ($tables -notmatch 'Profile') {
    Fail "Profile table missing. Run: npx prisma db push"
}
Ok "All tables present"

if ($Seed) {
    Step 5 "Seeding sample data"
    npx tsx prisma/seed.ts
    if ($LASTEXITCODE -ne 0) { Fail "Seed failed" }
    Ok "Seeded"
} else {
    Step 5 "Skipping seed (run with -Seed to include)"
}

Write-Host "`nDatabase is ready for Vercel deploy!" -ForegroundColor Green
Write-Host "Next: go to https://vercel.com/new and import your GitHub repo, or follow DEPLOY.md"
