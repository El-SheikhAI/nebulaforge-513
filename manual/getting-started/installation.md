# NebulaForge Installation Guide

## System Prerequisites
Before installing NebulaForge, ensure your system meets these requirements:
- **Operating Systems**: Linux (x86_64, ARM64), macOS (10.14+), Windows 10/11 (64-bit)
- **Dependencies**:
  - Terraform ≥ v1.3.0
  - AWS CLI v2 (for AWS deployments) / Azure CLI 2.40 (for Azure) / gcloud CLI 420+ (for GCP)
  - Python 3.10 interpreter
  - 500 MB disk space for base templates
  - 4 GB RAM minimum

---

## Installation Methods

### Method 1: Binary Distribution (All Platforms)
1. Download the appropriate binary:
   ```bash
   # Linux/macOS
   curl -LO https://dl.nebulaforge.io/releases/v1.0.0/nebulaforge-$(uname -s)-$(uname -m).tar.gz

   # Windows (PowerShell)
   Invoke-WebRequest -URI "https://dl.nebulaforge.io/releases/v1.0.0/nebulaforge-windows-amd64.zip" -OutFile "nebulaforge.zip"
   ```

2. Extract and install:
   ```bash
   # Linux/macOS
   tar -xvzf nebulaforge-*.tar.gz
   sudo mv nebulaforge /usr/local/bin/

   # Windows
   Expand-Archive -Path nebulaforge.zip -DestinationPath $env:ProgramFiles\NebulaForge
   [System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ';' + $env:ProgramFiles\NebulaForge, [System.EnvironmentVariableTarget]::Machine)
   ```

### Method 2: Homebrew (macOS/Linux)
```bash
brew tap nebulaforge/tap
brew install nebulaforge
```

### Method 3: Docker (All Platforms)
```bash
docker pull nebulaforge/core:stable
alias nebulaforge='docker run -it -v ${PWD}:/config nebulaforge/core'
```

---

## Configuration Initialization
Initialize environment after installation:
```bash
nebulaforge init
```

This will:
1. Create `~/.nebulaforge/config.yaml`
2. Synchronize base template libraries
3. Validate cloud provider credentials

---

## Verification
Confirm successful installation:
```bash
nebulaforge --version
# Expected output: NebulaForge v1.0.0 (Build 2103.9a4e2f)

nebulaforge validate --quickstart
# Should return: "System validation complete: All checks passed [Status: OPERATIONAL]"
```

---

## Post-Install Requirements
### Cloud Provider Authentication
Configure authentication for your target platforms:

**AWS**
```bash
nebulaforge auth aws --profile=prod
```

**Multi-cloud Setup**
```bash
nebulaforge auth configure \
  --aws-profile=dev \
  --azure-tenant-id=<your_tenant> \
  --gcp-service-account-key=./service-key.json
```

---

## Upgrade Procedure
To update to the latest version:
```bash
nebulaforge self-update --channel=stable
```

---

## Uninstallation
### Linux/macOS
```bash
sudo rm -rf /usr/local/bin/nebulaforge \
  ~/.nebulaforge \
  /usr/local/share/nebulaforge_templates
```

### Windows
1. Remove Program Files directory:
   ```powershell
   Remove-Item -Recurse -Force "$env:ProgramFiles\NebulaForge"
   ```
2. Delete environment variable via System Properties

---

## Next Steps
Proceed to the [Configuration Guide](../configuration/core-concepts.md) to create your first infrastructure blueprint.