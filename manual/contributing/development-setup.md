# NebulaForge Development Environment Setup

## Prerequisites
The following software must be installed prior to configuring your development environment:

| Component       | Minimum Version | Verification Command          |
|-----------------|-----------------|--------------------------------|
| Go              | 1.20            | `go version`                   |
| Node.js         | 18.16           | `node --version`               |
| Python          | 3.11            | `python --version`             |
| Terraform       | 1.5             | `terraform version`            |
| Docker Engine   | 24.0            | `docker version`               |
| Git             | 2.40            | `git --version`                |

## Repository Setup
1. Clone the repository:
```bash
git clone https://github.com/org/NebulaForge.git
cd NebulaForge
```

2. Configure upstream tracking:
```bash
git remote add upstream https://github.com/org/NebulaForge.git
git fetch upstream
```

## Dependency Installation
### Core Dependencies
```bash
go mod download
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

### Frontend Dependencies
```bash
cd ui && npm ci --legacy-peer-deps
```

### Infrastructure Tooling
```bash
terraform init -backend=false -upgrade
```

## Environment Configuration
Create a `.env` file in the project root:
```ini
NEBULA_ENV=development
AWS_PROFILE=nebula-dev # Requires configured AWS CLI profile
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
AZURE_TENANT_ID=your_tenant_id
```

Configure cloud provider authentication:
- [AWS CLI Setup Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
- [GCP Service Accounts](https://cloud.google.com/docs/authentication/provide-credentials-adc)
- [Azure Service Principal](https://learn.microsoft.com/en-us/azure/developer/go/azure-sdk-authentication)

## Testing Infrastructure
Execute the validation sequence:
```bash
# Unit tests with race detection
go test -race ./...

# Integration tests (requires cloud credentials)
go test -tags=integration ./internal/cloud/...

# End-to-end synthesis validation
make e2e-test
```

## Development Workflow
1. Create feature branch from `main`:
```bash
git checkout -b feat/your-feature-name
```

2. Implement changes following architectural guidelines documented in `ARCHITECTURE.md`

3. Format and validate code:
```bash
make format   # Formats Go, Terraform, and Python code
make lint     # Runs static analysis on all components
```

4. Verify test coverage:
```bash
make coverage # Generates coverage reports for all languages
```

5. Commit changes with semantic messages:
```bash
git commit -m "feat: implement multi-cloud validation layer"
```

## Post-Installation Configuration
### IDE Recommendations
1. Install official Go plugin
2. Configure Terraform language support
3. Enable EditorConfig support

### Debugging Setup
Configure launch.json for debuggers:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Core Engine",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/cmd/engine"
    }
  ]
}
```

## Build Verification
Execute full build pipeline:
```bash
make clean build
```

Validate output binaries:
```bash
./bin/nebulaforge version
./bin/nfctl --help
```

## Documentation Generation
Build project documentation:
```bash
make docs
```
Generated documentation will be available in `docs/public/` directory. Serve locally with:
```bash
cd docs && npx serve public
```

**Note**: Before submitting pull requests, execute the complete CI validation suite:
```bash
make ci
```