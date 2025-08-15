# NebulaForge Hello World Tutorial

## Objective
This tutorial provides a foundational introduction to NebulaForge by guiding you through the creation and deployment of a basic cloud infrastructure configuration. Upon completion, you will have synthesized a valid Infrastructure-as-Code (IaC) declaration for a multi-cloud "Hello World" virtual machine instance.

---

## Prerequisites
1. **NebulaForge CLI** installed (v1.4.0+)
2. Active cloud provider account credentials (AWS/Azure/GCP)
3. Text editor with YAML/Markdown support

---

## Step 1: Initialize Workspace
Create a project directory and navigate to it:
```bash
mkdir nebulaforge-hello-world && cd nebulaforge-hello-world
```

Initialize configuration scaffolding:
```bash
nebulaforge init --template=basic-vm
```

---

## Step 2: Configure Deployment
Open the generated `nf-config.yaml` file and modify the `specs` block:

```yaml
# nf-config.yaml
apiVersion: nebulaforge/v1
kind: SynthesisBlueprint
metadata:
  project: hello-world
  author: "[Your Name]"
  environment: sandbox

specs:
  targetPlatforms:
    - aws: eu-west-1
    - azure: westus2
    - gcp: us-central1
  
  compute:
    baseImage:  
      aws: ami-0c55b159cbfafe1f0
      azure: Canonical:UbuntuServer:18.04-LTS:latest
      gcp: ubuntu-1804-bionic-v20220419
    instanceType: t2.micro # Standard_A1_v2 / g1-small
```

---

## Step 3: Synthesize IaC
Execute the synthesis engine:
```bash
nebulaforge generate --validate
```

Successful output should display:
```
✔ Manifest validated against schema NF-2023.1
✔ Synthesized 3 platform configurations
▶︎ Output directory: ./artifacts/hello-world-<timestamp>
```

---

## Step 4: Verify Output
Examine the generated declarative configurations:

```hcl
# Example AWS output (artifacts/hello-world-*/aws/main.tf)
resource "aws_instance" "hello_world" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Project     = "hello-world"
    ManagedBy   = "NebulaForge"
  }
}
```

Equivalent configurations for Azure (ARM template) and GCP (Deployment Manager) will be generated in their respective subdirectories.

---

## Step 5: Execution (Optional)
To deploy using native IaC tools:

```bash
# For AWS deployment
cd artifacts/hello-world-*/aws
terraform init && terraform apply
```

*Note: Cloud provider credentials must be configured in your execution environment.*

---

## Troubleshooting

| Symptom | Resolution |
|---------|------------|
| `ERR: Manifest validation failed` | Run `nebulaforge schema verify` to diagnose YAML structure issues |
| `WARN: Unrecognized cloud region` | Consult `nebulaforge regions list` for supported zones |
| Empty output directory | Verify write permissions in project path |

---

## Next Steps
1. [Variable Interpolation Guide](manual/advanced/variable-interpolation.md)
2. [Multi-Cloud State Management](manual/concepts/state-federation.md)
3. [Module Registry Integration](manual/operations/registry-configuration.md)

*Last validated against NebulaForge v1.4.3 on 2023-11-30*