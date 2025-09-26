# NebulaForge Data Model

## Overview
The NebulaForge data model provides an abstract representation of infrastructure resources and their relationships across cloud providers. This canonical model serves as the foundation for generating cloud-specific Infrastructure as Code (IaC) configurations while maintaining a provider-agnostic interface for users. The model employs graph-based structures to capture topological relationships and dependency management requirements.

## Key Components

### 1. Resource Entities
Fundamental building blocks representing cloud infrastructure components. All resources conform to a unified type system:

```yaml
type: ComputeInstance
id: frontend-server-01
properties:
  cpu_cores: 4
  memory_gb: 16
  os_type: linux
```

### 2. Relationships
Directed edges defining connections between resources:

- **Dependency**: Hard requirement (e.g., subnet must exist before VM creation)
- **Association**: Soft linkage (e.g., security group attached to EC2 instance)
- **Hierarchy**: Composition relationship (e.g., VPC contains subnets)

### 3. Property System
Three-tiered attribute model:

1. **Core Attributes**: Provider-agnostic parameters (e.g., CPU count)
2. **Extended Attributes**: Cloud-specific customizations (e.g., AWS instance types)
3. **Metadata**: Non-functional attributes (tags, descriptions, ownership)

### 4. Profiles
Abstraction layers for environment-specific configurations:

```yaml
profiles:
  production:
    scaling:
      min_instances: 4
      max_instances: 12
  staging:
    scaling:
      min_instances: 1
      max_instances: 2
```

### 5. Policy Bindings
Constraint-based governance rules attached to resources:

```yaml
policies:
  - type: CostControl
    max_monthly_budget: 5000
    enforced: true
  - type: SecurityCompliance
    standards: [PCI-DSS, SOC2]
```

### 6. Layered Architecture
Multi-tiered model composition:

| Layer          | Responsibility              | Example                      |
|----------------|-----------------------------|------------------------------|
| Foundation     | Network topology            | VPCs, Subnets, Route Tables  |
| Platform       | Shared services             | Kubernetes Clusters, DBaaS   |
| Application    | Workload-specific resources | Microservices, Serverless    |

## Model Interactions
1. **Hierarchical Evaluation**: Layers are processed from foundation to application tier
2. **Dependency Resolution**: Topological sort determines resource creation order
3. **Policy Enforcement**: Constraints validated before code generation
4. **Profile Merging**: Environment configurations override base definitions

## Critical Considerations
- **Idempotency**: All operations produce same result regardless of execution count
- **Determinism**: Same input model always generates identical IaC output
- **State Isolation**: Model maintains no runtime state, depending entirely on declarative inputs
- **Extensibility**: Custom resource types can be added via plugin architecture

## Example Model Representation
```yaml
resources:
  - type: VirtualNetwork
    id: main-vpc
    properties:
      cidr_block: 10.0.0.0/16
      region: multi
    
  - type: ComputeCluster
    id: primary-cluster
    dependencies: [main-vpc]
    properties:
      node_count: 3
      profile: production
      
relationships:
  - source: primary-cluster
    target: main-vpc
    type: depends_on
```

## Cross-Cloud Abstraction
The model implements cloud-agnosticism through:

1. Unified type system with provider mappings
2. Normalized property syntax (e.g., `storage_gb` vs AWS `VolumeSize`/GCP `diskSizeGb`)
3. Abstract relationship types translated to cloud-specific implementations
4. Multi-cloud resource support through federation rules

This architecture enables the generation of consistently structured infrastructure definitions across AWS CloudFormation, Azure Resource Manager, and Google Cloud Deployment Manager from a single declarative model.