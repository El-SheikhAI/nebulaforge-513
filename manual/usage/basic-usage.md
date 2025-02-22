# Basic Usage of NebulaForge

## Overview
NebulaForge operates as a declarative infrastructure synthesis engine, enabling users to generate cloud-agnostic Infrastructure-as-Code (IaC) configurations through a three-stage workflow:  
1. **Definition**: Specify infrastructure requirements in a provider-agnostic manifest  
2. **Synthesis**: Transform the manifest into concrete IaC implementations  
3. **Deployment**: Execute generated configurations against target cloud platforms  

## Workflow Components
### 1. Project Initialization
Create a new project scaffold with default structure:
```bash
nebulaforge init my-infra-project
```
Generates:
```
my-infra-project/
├── manifest.yaml        # Primary definition file
├── parameters/          # Environment-specific variables
└── artifacts/           # Auto-generated IaC configurations
```

### 2. Infrastructure Definition
Construct infrastructure requirements using NebulaForge's Domain-Specific Language (DSL) in `manifest.yaml`:

```yaml
# manifest.yaml
apiVersion: nebulaforge.io/v1
kind: InfrastructureBlueprint

domains:
  - id: core-network
    components:
      - type: network
        properties:
          cidr: 10.0.0.0/16
          subnets:
            - zone: us-west1-a
              cidr: 10.0.1.0/24

  - id: data-layer
    components:
      - type: database
        engine: postgresql
        version: "14.0"
        storage: 250GiB

providers:
  - aws:
      regions: [us-west-2]
  - gcp:
      regions: [us-west1]
```

### 3. Configuration Synthesis
Generate provider-specific IaC artifacts:
```bash
nebulaforge synthesize --manifest manifest.yaml
```

Outputs multi-cloud implementations to `artifacts/`:
```
artifacts/
├── aws/
│   ├── core-network.tf
│   └── data-layer.tf
└── gcp/
    ├── core-network.tf
    └── data-layer.tf
```

### 4. Infrastructure Deployment
Execute generated configurations through provider-native toolchains:
```bash
# Dry-run validation
nebulaforge deploy --artifact artifacts/aws/ --dry-run

# Actual deployment
nebulaforge deploy --artifact artifacts/aws/
```

## Key Operational Flags
| Flag | Description | Example |
|------|-------------|---------|
| `--validate` | Verify manifest syntax | `nebulaforge synthesize --validate` |
| `--target-provider` | Selective code generation | `nebulaforge synthesize --target-provider=gcp` |
| `--var-file` | Inject environment variables | `nebulaforge deploy --var-file=parameters/prod.yaml` |
| `--output-format` | Configure artifact structure | `nebulaforge synthesize --output-format=helm` |

## Best Practices
1. **Modular Design**: Decompose infrastructure into discrete domains with clear boundaries
2. **Parameterization**: Externalize environment-specific values to `parameters/` directory
3. **Version Control**: Commit both manifests and synthesized artifacts
4. **Pre-flight Checks**: Always execute dry-runs before actual deployments
5. **Diff Analysis**: Use `nebulaforge diff --manifest manifest-v2.yaml --baseline manifest-v1.yaml` for change validation

## Next Steps
Proceed to [Advanced Configuration](/manual/usage/advanced-configuration.md) for coverage of:
- Conditional provisioning logic
- Cross-provider dependency resolution
- Custom template extensions
- Policy enforcement guardrails