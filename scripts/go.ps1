# ==========================================================================
#  Synergy Business -- all-in-one launcher (Windows)
#
#  Run this once on your laptop. It will:
#    1. Verify the local repo is sane
#    2. Wire up your GitHub remote (https://github.com/ddotsmedia/synergybusiness.git)
#    3. Push the code to GitHub
#    4. SCP the install script to your VPS
#    5. SSH into the VPS and run the installer
#    6. Watch it complete and print the live URL
#
#  Usage:
#    .\scripts\go.ps1
#
#  Or from CMD (double-click works too):
#    scripts\go.bat
#
#  All inputs are interactive -- you only need to know your VPS IP.
# ==========================================================================

param(
    [string]$VpsIp,
    [string]$VpsUser = "root",
    [string]$LeEmail,
    [string]$Domain = "synergybusiness.ae",
    [string]$AdminDomain = "",
    [string]$RepoUrl = "https://github.com/ddotsmedia/synergybusiness.git",
    [string]$Branch = "main",
    [string]$GithubToken = "",
    [switch]$SkipPush,
    [switch]$SkipInstall,
    [switch]$NoDnsCheck
)

if (-not $AdminDomain) { $AdminDomain = "admin.$Domain" }

$ErrorActionPreference = "Stop"

function Write-Step ($m) { Write-Host ""; Write-Host "==> $m" -ForegroundColor Cyan }
function Write-OK   ($m) { Write-Host "    $m" -ForegroundColor Green }
function Write-Warn ($m) { Write-Host "    $m" -ForegroundColor Yellow }
function Write-Err  ($m) { Write-Host "!!  $m" -ForegroundColor Red }
function Die        ($m) { Write-Err $m; exit 1 }

# ----- 0. prerequisites ---------------------------------------------------

Write-Step "Checking prerequisites"
foreach ($c in @("git", "ssh", "scp")) {
    if (-not (Get-Command $c -ErrorAction SilentlyContinue)) {
        Die "Missing: $c. Install Git for Windows from https://git-scm.com (it bundles ssh + scp)."
    }
}
Write-OK "git: $((git --version))"
# ssh -V writes to stderr; under $ErrorActionPreference=Stop in PS 5.1
# redirecting stderr would turn that into a terminating error. Just confirm
# the binary is there (we already did via Get-Command above).
Write-OK "ssh: present (Windows OpenSSH)"

# ----- 1. interactive prompts --------------------------------------------

if (-not $VpsIp) {
    $VpsIp = Read-Host "VPS IP address (e.g. 45.123.45.67)"
    if (-not $VpsIp) { Die "VPS IP is required" }
}
if (-not $LeEmail) {
    $entered = Read-Host "Email for Let's Encrypt notifications [admin@$Domain]"
    $LeEmail = if ([string]::IsNullOrWhiteSpace($entered)) { "admin@$Domain" } else { $entered }
}
if (-not $GithubToken) {
    $entered = Read-Host "If your GitHub repo is PRIVATE, paste a Personal Access Token (or just press Enter for public)"
    if (-not [string]::IsNullOrWhiteSpace($entered)) { $GithubToken = $entered }
}

Write-Step "Configuration"
Write-OK "  Public:    https://$Domain"
Write-OK "  Admin:     https://$AdminDomain/admin"
Write-OK "  VPS:       ${VpsUser}@${VpsIp}"
Write-OK "  LE email:  $LeEmail"
Write-OK "  Repo:      $RepoUrl"
Write-OK "  Branch:    $Branch"
Write-OK "  Visibility: $(if ($GithubToken) { 'private (token supplied)' } else { 'public' })"

Write-Warn ""
Write-Warn "DNS records you need at hPanel (Domains -> synergybusiness.ae -> Manage DNS):"
Write-Warn "  A   @       $VpsIp"
Write-Warn "  A   www     $VpsIp"
Write-Warn "  A   admin   $VpsIp     <- new, for the admin panel"
Write-Warn ""
Write-Warn "If admin DNS isn't ready yet, the install will still finish (HTTP only for admin)."
Write-Warn "Add the record at any time and re-run this script -- certbot will pick it up."

# ----- 2. locate repo ----------------------------------------------------

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot
if (-not (Test-Path ".git")) {
    Die "No .git directory in $RepoRoot. Run this from the synergybusiness project root."
}
Write-OK "Repo root: $RepoRoot"

# ----- 3. local push ------------------------------------------------------

if (-not $SkipPush) {
    Write-Step "Configuring git remote 'origin'"
    # `git remote` lists remotes to stdout (no stderr noise), avoiding the
    # PS 5.1 ErrorAction=Stop trap that bites if we try `get-url` on a
    # missing remote.
    $remotes = @(git remote)
    if ($remotes -contains "origin") {
        $existing = (git remote get-url origin).Trim()
        if ($existing -ne $RepoUrl) {
            Write-OK "Updating origin: $existing -> $RepoUrl"
            git remote set-url origin $RepoUrl | Out-Null
        } else {
            Write-OK "origin is already $RepoUrl"
        }
    } else {
        git remote add origin $RepoUrl | Out-Null
        Write-OK "Added origin: $RepoUrl"
    }

    # Auto-commit any local edits so the VPS pulls them on the next install.
    # Without this, GO.bat would push nothing new and the server would
    # re-deploy the same broken state.
    Write-Step "Checking for uncommitted changes"
    git add -A | Out-Null
    $status = @(git status --porcelain)
    if ($status.Count -gt 0) {
        Write-OK "Found $($status.Count) changed file(s):"
        $status | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
        $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $msg = "Deploy update $stamp"
        git commit -m $msg | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Die "git commit failed. Run 'git status' to inspect."
        }
        Write-OK "Committed: $msg"
    } else {
        Write-OK "Working tree clean."
    }

    Write-Step "Pushing to GitHub ($Branch)"
    Write-Warn "If prompted, paste a GitHub Personal Access Token (NOT your password)."
    Write-Warn "  Generate one at: https://github.com/settings/tokens?type=beta"
    Write-Warn "  Repo permission: Contents = Read and write"

    git push -u origin $Branch
    if ($LASTEXITCODE -ne 0) {
        Write-Err "git push failed. Common fixes:"
        Write-Err "  * Wrong credentials      -> use a PAT, not your GitHub password"
        Write-Err "  * Repo not yet on GitHub -> create it at https://github.com/new"
        Write-Err "  * Conflicting initial commit on GitHub -> run:  git pull --rebase origin $Branch"
        Die "Stopped."
    }
    Write-OK "Pushed."
} else {
    Write-Warn "Skipping local push (--SkipPush)"
}

# ----- 4. DNS sanity check ----------------------------------------------

if (-not $NoDnsCheck) {
    Write-Step "Checking DNS"
    foreach ($host in @($Domain, "www.$Domain", $AdminDomain)) {
        try {
            $resolved = (Resolve-DnsName $host -Type A -ErrorAction Stop -DnsOnly |
                         Where-Object Type -eq "A" |
                         Select-Object -ExpandProperty IPAddress -First 1)
            if ($resolved -eq $VpsIp) {
                Write-OK "$host -> $VpsIp"
            } elseif ($resolved) {
                Write-Warn "$host -> $resolved (expected $VpsIp)"
            } else {
                Write-Warn "$host -> no A record yet"
            }
        } catch {
            Write-Warn "$host -> not resolvable (add an A record at hPanel)"
        }
    }
}

# ----- 5. install on VPS -------------------------------------------------

if ($SkipInstall) {
    Write-Step "Skipping VPS install (--SkipInstall)"
    Write-OK "Done. You can run the install manually with:"
    Write-OK "  ssh ${VpsUser}@${VpsIp}"
    Write-OK "  sudo DOMAIN=$Domain LE_EMAIL=$LeEmail REPO_URL=$RepoUrl bash install-vps.sh"
    exit 0
}

Write-Step "Uploading installer to VPS"
Write-Warn "If asked, enter your VPS root password (or set up SSH keys for passwordless access)."
Write-Host ""

scp scripts\install-vps.sh "${VpsUser}@${VpsIp}:/tmp/install-vps.sh"
if ($LASTEXITCODE -ne 0) {
    Die "scp failed. Check VPS IP / firewall / SSH credentials."
}
Write-OK "Uploaded to /tmp/install-vps.sh"

# Build effective repo URL (with token if private)
$effectiveRepoUrl = $RepoUrl
if ($GithubToken) {
    $effectiveRepoUrl = $RepoUrl -replace '^https://', "https://x-access-token:${GithubToken}@"
}

Write-Step "Running installer on VPS (5-8 minutes)"
Write-OK "Streaming output below..."
Write-Host ""

# Use sudo via -t for password prompt, exec the script
$remoteCmd = "sudo DOMAIN=$Domain ADMIN_DOMAIN=$AdminDomain LE_EMAIL=$LeEmail REPO_URL='$effectiveRepoUrl' bash /tmp/install-vps.sh"
ssh -t "${VpsUser}@${VpsIp}" $remoteCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Err "Installer exited with code $LASTEXITCODE."
    Write-Err "To inspect, SSH in manually:"
    Write-Err "  ssh ${VpsUser}@${VpsIp}"
    Write-Err "  sudo -u synergy pm2 logs synergy-web"
    Write-Err "  sudo journalctl -u nginx --no-pager | tail -50"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Done! Live URLs:" -ForegroundColor Green
Write-Host "    Public:  https://$Domain" -ForegroundColor Green
Write-Host "    Admin:   https://$AdminDomain/admin" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Add API keys (Anthropic, Clerk, etc.) to /home/synergy/app/apps/web/.env.local on the VPS"
Write-Host "  2. After editing .env.local: ssh ${VpsUser}@${VpsIp} `"sudo -u synergy pm2 reload synergy-web --update-env`""
Write-Host "  3. To deploy code updates later: git push, then run scripts\go.ps1 again with -SkipPush:0 (or just re-push and SSH in to run deploy.sh)"
