# ==========================================================================
#  Synergy Business -- one-click auto-deploy setup
#
#  Run this once after GO.bat has done the initial install. It will:
#    1. Generate a deploy SSH keypair at ~/.ssh/synergy-deploy
#    2. SSH into the VPS as root and authorise the public key for `synergy`
#    3. Optionally install the cron-based backup poller (every 5 min)
#    4. Set GitHub repo secrets (VPS_HOST / VPS_USER / VPS_SSH_KEY) via gh CLI
#       or, if gh is missing, copy each value to your clipboard one-by-one
#       and open the browser to the secrets page
#    5. (Optional) trigger a test workflow run
#
#  After this runs, every `git push` automatically lands on synergybusiness.ae.
#
#  Usage:
#    .\scripts\sync.ps1
#  Or double-click SYNC.bat in the project root.
# ==========================================================================

param(
    [string]$VpsIp = "194.164.151.202",
    [string]$VpsRootUser = "root",
    [string]$AppUser = "synergy",
    [string]$RepoSlug = "ddotsmedia/synergybusiness",
    [string]$KeyPath = "$env:USERPROFILE\.ssh\synergy-deploy",
    [switch]$NoCron,
    [switch]$NoSecrets,
    [switch]$NoTestRun
)

$ErrorActionPreference = "Stop"

function Write-Step ($m) { Write-Host ""; Write-Host "==> $m" -ForegroundColor Cyan }
function Write-OK   ($m) { Write-Host "    $m" -ForegroundColor Green }
function Write-Warn ($m) { Write-Host "    $m" -ForegroundColor Yellow }
function Write-Err  ($m) { Write-Host "!!  $m" -ForegroundColor Red }
function Die        ($m) { Write-Err $m; exit 1 }

# Windows OpenSSH refuses to use a private key file that any other user can
# read. Newly-created files in %USERPROFILE%\.ssh inherit the home-folder
# ACL which usually includes "Authenticated Users" -- so we explicitly
# strip inheritance and grant only the current user.
function Set-StrictKeyPermissions ($path) {
    if (-not (Test-Path $path)) { return }
    $me = (whoami).Trim()
    & icacls $path /inheritance:r       | Out-Null
    & icacls $path /grant:r "${me}:(F)" | Out-Null
    foreach ($principal in @("BUILTIN\Users", "Authenticated Users", "Everyone")) {
        & icacls $path /remove $principal 2>$null | Out-Null
    }
}

# --- 0 prereqs ------------------------------------------------------------

Write-Step "Checking prerequisites"
foreach ($c in @("git", "ssh", "scp", "ssh-keygen")) {
    if (-not (Get-Command $c -ErrorAction SilentlyContinue)) {
        Die "Missing: $c. Install Git for Windows from https://git-scm.com (it bundles ssh + ssh-keygen)."
    }
}
Write-OK "git, ssh, scp, ssh-keygen present"

$ghAvailable = $false
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $ghStatus = (& gh auth status 2>&1) -join " "
    if ($LASTEXITCODE -eq 0) {
        $ghAvailable = $true
        Write-OK "gh CLI present and authenticated"
    } else {
        Write-Warn "gh CLI installed but not authenticated. Run 'gh auth login' to use it."
    }
} else {
    Write-Warn "gh CLI not installed. Will use clipboard + browser fallback for secrets."
    Write-Warn "Install for one-click secret upload: https://cli.github.com/"
}

# --- 1 prompts ------------------------------------------------------------

if (-not $VpsIp) { $VpsIp = Read-Host "VPS IP" }

Write-Step "Configuration"
Write-OK "  VPS:         ${VpsRootUser}@${VpsIp}"
Write-OK "  App user:    ${AppUser}"
Write-OK "  GitHub repo: ${RepoSlug}"
Write-OK "  Key path:    ${KeyPath}"
Write-OK "  Cron poller: $(if ($NoCron) { 'no' } else { 'yes (every 5 min)' })"

# --- 2 keypair ------------------------------------------------------------

$pubPath = "$KeyPath.pub"
if (-not (Test-Path $KeyPath)) {
    Write-Step "Generating deploy keypair"
    $keyDir = Split-Path -Parent $KeyPath
    if (-not (Test-Path $keyDir)) { New-Item -ItemType Directory -Path $keyDir | Out-Null }
    & ssh-keygen -t ed25519 -C "synergy-vps-deploy" -f "$KeyPath" -N "''" -q
    if (-not (Test-Path $KeyPath)) { Die "ssh-keygen failed" }
    Write-OK "Created $KeyPath (+ .pub)"
} else {
    Write-OK "Reusing existing key at $KeyPath"
}

# Always lock the file down. Newly-generated keys inherit the home-folder
# ACL which Windows OpenSSH rejects ("Bad permissions / UNPROTECTED PRIVATE
# KEY FILE"). Re-runs also fix keys that were created before this fix.
Set-StrictKeyPermissions $KeyPath
Write-OK "Locked $KeyPath to current user only"

if (-not (Test-Path $pubPath)) {
    Die "Public key missing at $pubPath. Delete the private key and re-run to regenerate."
}
$pubKey = (Get-Content $pubPath -Raw).Trim()

# --- 3 authorise on VPS ---------------------------------------------------

Write-Step "Authorising public key on VPS (you'll be asked for the root password)"

$cronEnv = if ($NoCron) { "0" } else { "1" }
$remoteCmd = @"
sudo PUBKEY='$pubKey' ENABLE_CRON=$cronEnv bash /home/$AppUser/app/scripts/setup-autodeploy.sh
"@

# If GO.bat already ran, /home/synergy/app exists. Check first to give a
# clearer error than a generic ssh failure.
$probe = & ssh -o StrictHostKeyChecking=accept-new "${VpsRootUser}@${VpsIp}" "test -f /home/$AppUser/app/scripts/setup-autodeploy.sh && echo OK || echo MISSING"
if ($LASTEXITCODE -ne 0) {
    Die "SSH to ${VpsRootUser}@${VpsIp} failed. Check the IP and that you can ssh in manually."
}
if ($probe -notmatch "OK") {
    Die "VPS isn't bootstrapped yet -- /home/$AppUser/app/scripts/setup-autodeploy.sh is missing. Run GO.bat first."
}

ssh -t "${VpsRootUser}@${VpsIp}" $remoteCmd
if ($LASTEXITCODE -ne 0) {
    Die "Remote setup-autodeploy.sh exited non-zero. Inspect the output above."
}
Write-OK "Public key authorised, non-interactive PATH wired, $(if ($NoCron) { 'cron skipped' } else { 'cron poller installed' })"

# --- 4 verify the new key works as the synergy user ----------------------

Write-Step "Verifying new key works for ${AppUser}@${VpsIp}"
$verifyOut = & ssh -i "$KeyPath" -o StrictHostKeyChecking=accept-new -o BatchMode=yes "${AppUser}@${VpsIp}" "whoami"
if ($LASTEXITCODE -ne 0 -or $verifyOut.Trim() -ne $AppUser) {
    Die "Couldn't ssh as ${AppUser}@${VpsIp} with the new key. Got: '$verifyOut'."
}
Write-OK "Confirmed: $($verifyOut.Trim())@${VpsIp} via deploy key"

# --- 5 GitHub secrets ----------------------------------------------------

if (-not $NoSecrets) {
    Write-Step "Setting GitHub repo secrets"
    $privateKey = Get-Content $KeyPath -Raw

    if ($ghAvailable) {
        Write-OK "Using gh CLI"
        # gh secret set reads the value from stdin if --body is not provided
        $VpsIp | gh secret set VPS_HOST --repo $RepoSlug --body $VpsIp 2>$null
        if ($LASTEXITCODE -ne 0) { gh secret set VPS_HOST --repo $RepoSlug --body $VpsIp | Out-Null }
        gh secret set VPS_USER --repo $RepoSlug --body $AppUser | Out-Null
        # Private key may have multiple lines -- set via stdin
        $privateKey | gh secret set VPS_SSH_KEY --repo $RepoSlug | Out-Null
        Write-OK "Set VPS_HOST, VPS_USER, VPS_SSH_KEY on $RepoSlug"

        $slack = Read-Host "Optional: paste a Slack incoming-webhook URL for notifications (or press Enter to skip)"
        if ($slack -and $slack.StartsWith("https://")) {
            $slack | gh secret set SLACK_WEBHOOK_URL --repo $RepoSlug | Out-Null
            Write-OK "Set SLACK_WEBHOOK_URL"
        } else {
            Write-Warn "Skipping Slack webhook (you can set it later: gh secret set SLACK_WEBHOOK_URL)"
        }
    } else {
        # Manual fallback: copy each value, open browser, walk user through it
        $secretsUrl = "https://github.com/$RepoSlug/settings/secrets/actions"
        Write-Warn "Will paste each secret value to your clipboard one at a time."
        Write-Warn "Click 'New repository secret' in the browser for each."

        function Stage-Secret($name, $value) {
            Set-Clipboard -Value $value
            Write-Host ""
            Write-Host "  --> Now in your clipboard: $name" -ForegroundColor Yellow
            Write-Host "      In GitHub, click 'New repository secret', name it $name, paste, save."
            Read-Host "      Press Enter when done"
        }

        Start-Process $secretsUrl

        Stage-Secret "VPS_HOST" $VpsIp
        Stage-Secret "VPS_USER" $AppUser
        Stage-Secret "VPS_SSH_KEY" $privateKey

        Write-Warn "Optional: also add SLACK_WEBHOOK_URL for deploy notifications."
    }
} else {
    Write-Warn "Skipping GitHub secrets (--NoSecrets)"
}

# --- 6 trigger a test deploy ---------------------------------------------

if (-not $NoTestRun -and $ghAvailable) {
    Write-Step "Triggering a test workflow run"
    $reason = "synced via SYNC.bat at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    & gh workflow run deploy.yml --repo $RepoSlug --ref main --field reason="$reason"
    if ($LASTEXITCODE -eq 0) {
        Write-OK "Workflow dispatched. Watch it run:"
        Write-OK "  https://github.com/$RepoSlug/actions"
        Start-Sleep -Seconds 2
        Start-Process "https://github.com/$RepoSlug/actions"
    } else {
        Write-Warn "Failed to dispatch -- check that the workflow file is on origin/main."
    }
} elseif (-not $ghAvailable) {
    Write-Warn "Skipping test run (gh CLI not available)."
    Write-Warn "Trigger manually: https://github.com/$RepoSlug/actions/workflows/deploy.yml"
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Auto-deploy is live!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Every push to 'main' deploys automatically:"
Write-Host "    https://synergybusiness.ae          (frontend)"
Write-Host "    https://admin.synergybusiness.ae    (admin)"
Write-Host ""
Write-Host "  Backup cron poller: $(if ($NoCron) { 'disabled' } else { 'every 5 minutes' })"
Write-Host "  Workflow runs:      https://github.com/$RepoSlug/actions"
Write-Host ""
