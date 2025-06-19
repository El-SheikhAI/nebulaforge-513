# NebulaForge Contribution Guidelines

## Introduction
NebulaForge welcomes contributions from the community to advance cloud-native infrastructure synthesis capabilities. This document establishes technical requirements, development protocols, and quality standards for effective collaboration. Prospective contributors must adhere to these guidelines to maintain architectural integrity and operational consistency.

## Prerequisites
1. **Technical Proficiency**
   - Git version control (v2.30+)
   - Go programming language (v1.20+)
   - Node.js runtime and NPM (v18+)
   - Terraform CLI (v1.5+)
2. **Cloud Credentials**
   - Valid AWS/Azure/GCP service accounts with sufficient privileges
   - Local installation of corresponding cloud provider CLIs
   - Environment variables configured for authentication
3. **System Requirements**
   - POSIX-compliant shell environment
   - Minimum 8GB RAM allocation for synthesis operations
   - Supported processor architectures: x86_64, ARM64

## Development Environment Configuration
### Repository Initialization
```bash
git clone https://github.com/NebulaForge/core.git
cd core
go mod download
npm install --production-synthetic
```

### Environment Variables
Create `.env` file in repository root:
```env
NEBULA_MODE=development
TF_BACKEND=s3 # Supported: s3, gcs, azurerm
CLOUD_PROVIDERS=aws,gcp # Comma-separated providers
```

### Build Execution
```bash
make compile-cross-platform  # Generates binaries for all architectures
./bin/nebula-synth generate --validate
```

## Contribution Workflow
### Branch Management Protocol
1. Establish feature branches from `main` using convention: `feat/<feature-id>`
2. Prefix critical fixes with `hotfix/<issue-number>`
3. Documentation branches: `docs/<section>-update`

### Commit Standards
- Follow [Conventional Commits](https://www.conventionalcommits.org/) specification
- Minimum structural requirements:
  ```
  <type>(<scope>): <subject>
  
  <body>
  
  <footer>
  ```
- All commits must include DCO (Developer Certificate of Origin) verification:
  ```bash
  git commit -s -m "feat(synthesizer): implement GCP resource mapper"
  ```

## Code Quality Standards
### Static Analysis Requirements
1. Execute linters before submission:
   ```bash
   make analyze-go # Runs Go vet, staticcheck, and revive
   make analyze-js # Executes ESLint with NebulaForge rule set
   ```
2. Formatting requirements:
   - Go: `gofmt -s -w .`
   - Terraform: `terraform fmt -recursive`
   - Markdown: Prettier with column width 120

### Documentation Requirements
1. Inline Go documentation:
   ```go
   // ResourceMapper converts cloud-agnostic constructs to provider-specific configurations
   // Argument:
   //   blueprint - Intermediate representation of infrastructure components
   // Returns:
   //   map[string]interface{} - Provider-compliant resource definitions
   //   error - Validation failures or translation errors
   func (m *Mapper) ResourceMapper(blueprint model.Blueprint) (map[string]interface{}, error) {
   ```
2. Architectural decisions recorded in ADRs (Architecture Decision Records) directory
3. Diagram updates required for core component modifications (PlantUML format)

## Testing Protocol
### Unit Tests
```bash
go test -v ./pkg/synthesizer/... -coverprofile=coverage.out
```

### Integration Testing
1. Cloud service emulation:
   ```bash
   make start-mocks # Launches LocalStack, Azure Storage Emulator, and Google Cloud Emulator
   ```
2. Execution command:
   ```bash
   go test -tags=integration ./internal/cloudintegrations/...
   ```

### End-to-End Validation
```bash
nebula-testharness validate-templates \
  --providers aws,gcp,azure \
  --scenarios basic,high-availability,disaster-recovery
```

## Submission Process
### Pull Request Requirements
1. Mandatory elements:
   - Issue tracking reference
   - Architectural impact analysis
   - Performance benchmark comparison
   - Cloud compatibility matrix
2. Review criteria:
   - Minimum 2 maintainer approvals
   - Successful completion of all CI pipelines
   - Security scan approval (Checkmarx/CodeQL)

### Review Cycle
1. Initial triage within 72 business hours
2. Critical path reviews completed within 7 days
3. Expected revision iterations:
   | Priority Level | Maximum Iterations | Time Allocation |
   |----------------|--------------------|-----------------|
   | P0 (Critical)  | 3                  | 5 business days |
   | P1 (Standard)  | 5                  | 14 calendar days|
   | P2 (Enhancement)| 7                 | 30 calendar days|

## Community Standards
- Follow CNCF Code of Conduct (enforced)
- Technical discussions conducted via #design-reviews Slack channel
- Architectural proposals require RFC submission process
- Security disclosures: security@nebulaforge.io (PGP key available)

## Recognition Framework
All accepted contributions receive:
1. Permanent attribution in project Changelog
2. Contributor License Agreement execution record
3. Eligibility for Architecture Council nomination
4. Participation metrics in quarterly transparency reports

Maintainers evaluate exceptional contributions quarterly for NebulaForge Distinguished Contributor status.