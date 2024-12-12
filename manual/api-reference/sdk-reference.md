# NebulaForge SDK Reference

## Overview
The NebulaForge SDK provides programmatic access to the NebulaForge infrastructure synthesis engine, enabling developers to generate infrastructure-as-code (IaC) configurations across multiple cloud providers within their applications.

## Supported Targets
- **Cloud Providers**: AWS, Google Cloud Platform (GCP), Microsoft Azure
- **Output Formats**: Terraform HCL, AWS CloudFormation (YAML/JSON), Google Deployment Manager, Azure Resource Manager (ARM) Templates

## Installation

### Python
```bash
pip install nebulaforge-sdk
```

### Node.js
```bash
npm install @nebulaforge/sdk
```

## Authentication
Initialize the SDK with your API credentials:

```python
from nebulaforge import NebulaClient

client = NebulaClient(
    api_key="nf_sk_...",
    environment="prod"  # or "staging"
)
```

## Core Classes

### 1. `NebulaClient`
The primary interface for SDK operations.

**Methods:**
- `.synthesize(config)`: Generates IaC from configuration
- `.validate(template)`: Checks template consistency
- `.estimate(template)`: Returns cost projection
- `.get_providers()`: Lists supported cloud providers

### 2. `InfrastructureBuilder`
Domain-specific language (DSL) for infrastructure definition.

```python
builder = client.builder()
builder.vpc(name="core", cidr="10.0.0.0/16")
builder.compute(name="web", type="balanced", replicas=3)
builder.add_ingress_rules([...])
```

### 3. `DeploymentManager`
Orchestrates provisioning workflows.

**Methods:**
- `.deploy(template, dry_run=True)`
- `.rollback(deployment_id)`
- `.get_status(deployment_id)`

## API Reference

### `synthesize()` Method
```python
def synthesize(
    config: dict | InfrastructureBuilder,
    target_format: str = 'terraform',
    provider: str = 'aws',
    **kwargs
) -> SynthesisResult
```

**Parameters:**
- `config`: Infrastructure specification (raw JSON or builder instance)
- `target_format`: Output format (terraform, cloudformation, etc.)
- `provider`: Target cloud provider
- `kwargs`: Provider-specific options

**Returns:**
```python
class SynthesisResult:
    template: str            # Rendered IaC
    diagnostics: list        # Validation warnings/errors
    cost_estimate: dict      # Regional cost breakdown
    compatibility_report: dict
```

## Error Handling
The SDK raises context-specific exceptions:

```python
try:
    result = client.synthesize(config)
except SynthesisException as e:
    print(f"Synthesis failed: {e.details}")
except DeploymentError as e:
    print(f"Deployment error: {e.traceback}")
```

Common error codes:
- `NF-400`: Invalid configuration syntax
- `NF-403`: Authorization failure
- `NF-500`: Synthesis engine error
- `NF-503`: Provider connectivity issue

## Examples

### Basic Infrastructure Generation
```python
from nebulaforge import NebulaClient

client = NebulaClient(api_key="nf_sk_...")
config = {
    "infrastructure": {
        "compute": [
            {"name": "web-server", "type": "ec2-t3-medium", "count": 3}
        ],
        "network": {
            "cidr": "10.0.0.0/16",
            "subnets": ["10.0.1.0/24", "10.0.2.0/24"]
        }
    }
}

result = client.synthesize(
    config,
    target_format="terraform",
    provider="aws"
)

print(result.template)
```

### Advanced Multi-Cloud Deployment
```python
# Create cross-cloud architecture
builder = client.builder()
with builder.cloud("aws"):
    builder.vpc("main")
    builder.kubernetes_cluster("prod", version="1.27")
    
with builder.cloud("gcp"):
    builder.memorystore("redis")
    builder.cloud_sql("postgres-db")

# Generate unified configuration
result = builder.synthesize(
    target_format="terraform",
    multi_cloud_strategy="primary-secondary"
)

# Deploy with drift detection
deployment = client.deployment_manager.deploy(
    result.template,
    dry_run=False,
    enable_drift_detection=True
)
```

## Advanced Features
### State Management
```python
# Store configuration state
state_token = client.persist_state(result.template)

# Retrieve historical version
previous_config = client.retrieve_state(
    state_token,
    version=3
)
```

### Custom Module Integration
```python
client.register_module(
    name="custom-database",
    provider="aws",
    definition="""
    resource "aws_instance" "database" {
      // Custom resource definition
    }
    """
)

# Reference in builder
builder.use_module("custom-database", version="1.2")
```

## Best Practices
1. **Validation**: Always validate configurations before deployment
   ```python
   client.validate(result.template)
   ```
2. **Cost Analysis**: Review estimates across regions
   ```python
   print(result.cost_estimate['us-east-1'])
   ```
3. **Rollback Strategies**: Implement deployment fallback plans
   ```python
   deployment = client.deploy(template)
   if deployment.status == 'failed':
       client.rollback(deployment.id)
   ```

## Troubleshooting
See [Error Handling Guide](manual/error-handling.md) for detailed resolution workflows. Enable debug logging with:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

For additional resources:  
[NebulaForge API Documentation](api.md) | [CLI Reference](cli.md) | [Best Practices Guide](best-practices.md)