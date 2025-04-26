# NebulaForge Prerequisites  

## System Requirements  

To utilize NebulaForge effectively, ensure your development or execution environment meets the following specifications:  

**Operating System**  
- Linux (Ubuntu 22.04 LTS or later, CentOS 8+, or equivalent distributions)  
- macOS (12 Monterey or later, x86_64 or Apple Silicon architectures)  
- Windows Subsystem for Linux 2 (WSL2) on Windows 10/11  

**Architectures**  
- AMD64 (x86_64)  
- ARM64  

## Essential Tools  

### 1. Infrastructure as Code (IaC) Tooling  
- **Terraform v1.5.0 or later**:  
  Required for deploying synthesized configurations.  
  [Installation Guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)  

```bash
terraform version  # Verify minimum version requirement
```

### 2. Cloud Command-Line Interfaces (CLIs)  
Install and configure CLI tools for target cloud platforms:  
- **AWS CLI v2**  
  [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)  
- **Azure CLI v2.50.0 or later**  
  [Installation Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)  
- **Google Cloud SDK v430.0.0 or later**  
  [Installation Guide](https://cloud.google.com/sdk/docs/install)  

### 3. Containerization  
- **Docker Engine v24.0 or later**  
  Required for NebulaForge’s synthesis engine runtime.  
  [Installation Guide](https://docs.docker.com/engine/install/)  

```bash
docker --version  # Validate installation
```

## Cloud Provider Authentication  

### AWS  
Configure credentials using **IAM access keys** or **IAM instance roles**:  
```bash
aws configure  # Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and default region
```

### Azure  
Authenticate via the Azure CLI:  
```bash
az login  # Follow interactive authentication flow
```

### Google Cloud Platform (GCP)  
Initialize and authenticate:  
```bash
gcloud init  # Configure project and credentials
```

## Network and Security  

- **Inbound/Outbound Connectivity**  
  Allowlist necessary domains (e.g., `api.nebulaforge.io`, cloud provider APIs) in firewalls or proxies.  
- **IAM Permissions**:  
  Ensure service accounts/users have permissions to create/modify resources via IaC:  
  - *AWS*: `AdministratorAccess` (or least-privilege equivalents)  
  - *Azure*: `Contributor` role  
  - *GCP*: `Editor` role  

## Optional Tools (Environment-Specific)  

1. **CI/CD Integration**  
   - Jenkins v2.387 or later  
   - GitLab CI/CD v15.0 or later  
   - GitHub Actions  
2. **IDE Extensions**  
   - VS Code with Terraform/HCL language support  
   - JetBrains Terraform Plugin  

---

**Verification Checklist**  
Run these commands to confirm tooling readiness:  
```bash
terraform version | grep -E 'v1\.[5-9]|v1\.[1-9][0-9]'  
aws --version | grep 'aws-cli/2'  
az --version | grep 'azure-cli'  
gcloud --version | grep 'Google Cloud SDK'  
docker --version | grep -E '24\.0|2[5-9]\.|[3-9][0-9]\.'  
```  
Expected output: Version identifiers matching minimum requirements.  

This documentation adheres to NebulaForge's operational specifications as of Q3 2024. Revalidate prerequisites during major version upgrades (`vX.0.0`).