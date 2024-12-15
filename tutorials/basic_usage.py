# NebulaForge: Basic Usage Tutorial

## Introduction
This tutorial demonstrates foundational operations within NebulaForge - a cloud-native infrastructure synthesis platform. You will configure a core deployment pattern and examine the synthesized infrastructure-as-code (IaC) outputs. 

## Prerequisites
- Python ≥3.9 installed
- Active accounts with one or more cloud providers
- Provider CLI tools configured (AWS CLI, gcloud, az)
- Terminal access with 4GB available memory

## Package Installation
```bash
pip install nebulaforge --extra-index-url https://pypi.nebulaforge.io/simple/
```

Verify installation:
```bash
nebulaforge --version
> nebulaforge 1.3.0 (Compiler: Terraform 1.5.7, Crossplane 1.12)
```

## Project Initialization
Create a new workspace:
```bash
nebulaforge init --provider aws,gcp --pattern web-service
```

Directory structure:
```
├── manifests/
│   ├── base.yaml
│   └── overlays/
├── schematics/
│   └── networking.hcl
└── nebulaforge.lock
```

## Infrastructure Definition
Edit `manifests/base.yaml`:

```yaml
apiVersion: infrastructure.nebulaforge.io/v1
kind: WorkloadCluster
metadata:
  name: primary-web
spec:
  compute:
    nodes: 3
    instanceType: medium-ha    # Auto-mapped to provider equivalents
  networking:
    topology: mesh
    ingress:
      domains: [example.com]
  storage:
    persistent: true
    iopsClass: standard
```

## Code Synthesis
Generate provider-specific configurations:
```bash
nebulaforge synthesize --target terraform
```

Output confirmation:
```
✔ Compiled AWS Terraform module to outputs/aws_web-service
✔ Compiled GCP Terraform module to outputs/gcp_web-service
ℹ Crossplane Composition available at outputs/crossplane/
```

Examine generated Terraform for AWS:
```hcl
# outputs/aws_web-service/main.tf
module "compute" {
  source = "nebulaforge-aws-modules/vpc/aws"
  version = "3.2.0"

  instance_count = 3
  instance_type  = "t3.medium"
  vpc_mesh       = true
  # ... (32 resources generated)
```

## Deployment Execution
Apply configurations using native tools:
```bash
cd outputs/aws_web-service
terraform init
terraform apply -auto-approve
```

## Validation
Confirm resource creation:
```bash
nebulaforge verify --live
```

Expected output:
```
✓ AWS EC2 Instances (3/3 running)
✓ GCP Load Balancer (active)
✓ Hybrid DNS Records (propagated)
```

## Teardown Procedure
Destroy provisioned infrastructure:
```bash
terraform destroy -auto-approve
nebulaforge clean --purge-lock
```

## Conclusion
You have now:
1. Established a NebulaForge workspace
2. Defined multi-cloud infrastructure requirements
3. Synthesized provider-specific configurations
4. Executed and validated deployments

Proceed to the Intermediate Tutorials to explore state management, policy enforcement, and cost estimation features.