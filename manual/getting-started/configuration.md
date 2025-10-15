# NebulaForge Configuration Guide

## 1. Introduction
This document provides a comprehensive reference for NebulaForge configuration syntax, structure, and operational parameters. The declarative configuration format enables precise specification of multi-cloud infrastructure requirements that the synthesizer compiles into validated IaC artifacts.

## 2. Prerequisites
- NebulaForge CLI v2.3.1+ installed
- Valid credentials for target cloud providers
- Base understanding of the following concepts:
  - Infrastructure as Code (IaC)
  - Declarative configuration patterns
  - Cloud resource hierarchy

## 3. Configuration Fundamentals

### 3.1 Core File Structure
```yaml
# nebulaforge.yml
version: "2.3"
blueprint: <unique_identifier>

providers:
  - <provider_configuration>

resources:
  - <resource_definitions>

networking:
  - <network_topology>

security:
  - <security_configuration>

variables:
  - <environment_parameters>

modules:
  - <reusable_components>
```

### 3.2 Provider Configuration
```yaml
providers:
  - name: aws-production
    type: aws
    account_id: "123456789012"
    region: us-west-2
    authentication:
      method: assume_role
      role_arn: arn:aws:iam::123456789012:role/NebulaForgeExecution

  - name: azure-staging
    type: azure
    subscription_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
    tenant_id: "q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6"
    regions: [eastus, westus]
```

### 3.3 Resource Definition
```yaml
resources:
  - name: web-servers
    type: compute
    provider: aws-production
    count: 3
    spec:
      instance_type: t3.large
      operating_system: amazon-linux-2
      storage:
        root_volume: 30Gi
        data_volumes:
          - mount_path: /data
            size: 100Gi
            type: gp3

  - name: persistent-store
    type: database
    provider: azure-staging
    spec:
      engine: postgresql
      version: "14"
      storage: 500Gi
      performance_tier: Premium
```

### 3.4 Network Topology
```yaml
networking:
  - name: primary-vpc
    cidr: 10.0.0.0/16
    subnets:
      - name: public-subnet-a
        cidr: 10.0.1.0/24
        zone: us-west-2a
        public: true
      - name: private-subnet-b
        cidr: 10.0.2.0/24
        zone: us-west-2b
        public: false
    security_groups:
      - name: web-traffic
        ingress:
          - protocol: tcp
            ports: [80, 443]
            source: 0.0.0.0/0
```

## 4. Complete Example Configuration
```yaml
version: "2.3"
blueprint: ecommerce-platform-v3

providers:
  - name: primary-aws
    type: aws
    region: eu-central-1
    account_id: "987654321098"

resources:
  - name: application-servers
    type: compute
    provider: primary-aws
    count: 5
    spec:
      instance_type: m5.xlarge
      monitoring: enhanced
      tags:
        Environment: Production
        Tier: Application

  - name: customer-database
    type: database
    provider: primary-aws
    spec:
      engine: aurora-postgresql
      version: "13.6"
      storage: 1024Gi
      backup_retention: 35d

networking:
  - name: core-network
    cidr: 192.168.0.0/20
    enable_nat_gateway: true
    dns:
      private_zones:
        - name: internal.example.com
          records:
            - type: A
              name: db
              value: customer-database.internal

variables:
  - name: environment_type
    default: production
    validation: 
      allowed_values: [staging, production]
```

## 5. Advanced Configuration

### 5.1 Modular Architecture
```yaml
modules:
  - name: standard-web-tier
    inputs:
      - instance_count
      - instance_size
    outputs:
      - security_group_id
      - load_balancer_dns
    implementation:
      resources:
        - type: compute
          name: web-nodes
          count: ${var.instance_count}
          spec: {...}
        
        - type: networking
          name: web-lb
          spec: {...}
```

### 5.2 Parametric Configuration
```yaml
variables:
  - name: deployment_region
    description: "Primary geographic deployment zone"
    type: string
    required: true
  
  - name: database_backup_window
    type: string
    default: "04:00-06:00"
    validation:
      regex: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'

resources:
  - name: regional-database
    provider: aws-${var.deployment_region}
    spec:
      backup:
        window: ${var.database_backup_window}
```

### 5.3 Security Controls
```yaml
security:
  - name: data-protection
    encryption:
      default: aes256
      kms: 
        rotation: 90d
        archival: 7y

  - name: access-policies
    iam:
      principle_of_least_privilege: enforced
      session_timeout: 3600
```

## 6. Configuration Validation
Execute semantic verification before synthesis:
```bash
nebulaforge validate --strict nebulaforge.yml
```

Expected success output:
```
✅ Configuration valid
🔍 Syntax: PASS
🧠 Semantics: PASS
☁️ Cloud Compatibility: PASS
📋 Policy Compliance: PASS
```

## 7. Best Practices
1. **Version Control**: Commit configurations with descriptive atomic commits
2. **Parameterization**: Abstract environment-specific values to variables
3. **Modularity**: Decompose complex configurations into reusable modules
4. **Policy Guardians**: Implement compliance checks through:
   ```yaml
   policy:
     - name: no-public-buckets
       resource_types: [object_storage]
       rule: $.spec.public_access == false
   ```
5. **Lifecycle Management**: Use metadata tags for resource tracking
   ```yaml
   metadata:
     owner: platform-engineering@example.com
     cost_center: CC-2024-INFRA
     compliance_level: PCI-DSS
   ```