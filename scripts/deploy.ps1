#!/usr/bin/env pwsh
# One-shot Vercel deploy script.
# Prerequisites (you must do these first):
#   1. Provide DATABASE_URL in .env (PostgreSQL connection string from Coolify)
#   2. Run `vercel login` in this terminal (opens browser, authorize)
#
# Usage:
#   pwsh scripts/deploy.ps1
#
# What it does:
#   - Verifies prerequisites
#   - Pushes Prisma schema to remote DB
#   - Links project to Vercel
#   - Sets all env vars
#   - Deploys to production
#   - Updates NEXTAUTH_URL with actual deployed URL
#   - Seeds production DB
#   - Verifies deployment

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Step($n, $title) { Write-Host "`n[$n] $title" -ForegroundColor Cyan }
function Ok($msg) { Write-Host "  OK: $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  WARN: $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "  FAIL: $msg" -ForegroundColor Red; exit 1 }

Step 1 "Checking prerequisites"
if (-not (Test-Path ".env")) { Fail ".env not found. Copy .env.example to .env first." }
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch 'postgresql://') {
    Fail ".env still has non-postgres DATABASE_URL. Update it with your Coolify connection string."
}
Ok ".env has postgresql DATABASE_URL"

$vercelWho = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Fail "Not logged in to Vercel. Run: vercel login"
}
Ok "Logged in to Vercel as: $($vercelWho -join ' ')"

Step 2 "Pushing Prisma schema to remote database"
npx prisma db push
if ($LASTEXITCODE -ne 0) { Fail "prisma db push failed. Check DATABASE_URL and DB reachability." }
Ok "Schema pushed"

Step 3 "Linking project to Vercel (creates .vercel/)"
if (-not (Test-Path ".vercel/project.json")) {
    vercel link --yes
    if ($LASTEXITCODE -ne 0) { Fail "vercel link failed" }
} else {
    Warn ".vercel/project.json already exists, skipping link"
}

Step 4 "Setting environment variables on Vercel"
$envVars = @{
    "DATABASE_URL"     = ($envContent | Select-String 'DATABASE_URL="([^"]+)"').Matches[0].Groups[1].Value
    "NEXTAUTH_SECRET"  = ($envContent | Select-String 'NEXTAUTH_SECRET="([^"]+)"').Matches[0].Groups[1].Value
    "ADMIN_EMAIL"      = ($envContent | Select-String 'ADMIN_EMAIL="([^"]+)"').Matches[0].Groups[1].Value
    "ADMIN_PASSWORD"   = ($envContent | Select-String 'ADMIN_PASSWORD="([^"]+)"').Matches[0].Groups[1].Value
    "ADMIN_NAME"       = ($envContent | Select-String 'ADMIN_NAME="([^"]+)"').Matches[0].Groups[1].Value
}
foreach ($kv in $envVars.GetEnumerator()) {
    Write-Host "  Setting $($kv.Key)..."
    echo $kv.Value | vercel env add $kv.Key production --force
    if ($LASTEXITCODE -ne 0) { Fail "Failed to set $env($kv.Key)" }
}
Ok "All env vars set (except NEXTAUTH_URL — set after first deploy)"

Step 5 "First production deploy"
vercel --prod --yes
if ($LASTEXITCODE -ne 0) { Fail "vercel --prod failed" }
$deployUrl = vercel ls --prod 2>&1 | Select-String 'https://[a-z0-9-]+\.vercel\.app' | Select-Object -First 1
if (-not $deployUrl) { Fail "Could not parse deployed URL" }
$url = $deployUrl.Matches[0].Value
Ok "Deployed: $url"

Step 6 "Setting NEXTAUTH_URL to actual deployed URL"
echo $url | vercel env add NEXTAUTH_URL production --force
if ($LASTEXITCODE -ne 0) { Fail "Failed to set NEXTAUTH_URL" }
Ok "NEXTAUTH_URL set to $url"

Step 7 "Redeploy with correct NEXTAUTH_URL"
vercel --prod --yes
if ($LASTEXITCODE -ne 0) { Fail "Redeploy failed" }
Ok "Redeployed"

Step 8 "Seeding production database (optional — skip with Ctrl+C in 5s)"
Start-Sleep -Seconds 5
$env:DATABASE_URL = $envVars["DATABASE_URL"]
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) { Warn "Seed failed (you can seed manually later)" }
Ok "Seed done"

Step 9 "Smoke test"
$home = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
if ($home.StatusCode -ne 200) { Fail "Home returned $($home.StatusCode)" }
Ok "Home: 200 OK"
$login = Invoke-WebRequest -Uri "$url/admin/login" -UseBasicParsing -TimeoutSec 30
if ($login.StatusCode -ne 200) { Fail "Login page returned $($login.StatusCode)" }
Ok "Login page: 200 OK"

Write-Host "`nDeploy complete!" -ForegroundColor Green
Write-Host "Public site: $url"
Write-Host "Admin:       $url/admin/login"
Write-Host "Email:       $($envVars['ADMIN_EMAIL'])"
Write-Host "Password:    (the one you set in .env)"
Write-Host "`nNext steps:"
Write-Host "  1. Open $url and confirm data shows"
Write-Host "  2. Login to /admin and add your real content"
Write-Host "  3. Push code changes with: git push (auto-deploys)"
