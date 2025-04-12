# NebulaForge API Types Reference

## Overview
This document specifies the foundational data types used throughout the NebulaForge API. These types govern the structure of Infrastructure-as-Code (IaC) declarations, resource definitions, and deployment specifications across supported cloud providers.

---

## Core Types

### CloudProvider
```yaml
enum: AWS | Azure | GCP | OCI | IBMCloud
```
Specifies the cloud service provider for resource deployment.  
**Members**:
- `AWS`: Amazon Web Services  
- `Azure`: Microsoft Azure  
- `GCP`: Google Cloud Platform  
- `OCI`: Oracle Cloud Infrastructure  
- `IBMCloud`: IBM Cloud  

---

### InfrastructureComponent
```yaml
type: object
properties:
  id:
    type: string
    format: uuid
    description: Unique component identifier
  type:
    type: string
    enum: [Compute, Storage, Network, Database, Security]
  provider:
    $ref: '#/components/schemas/CloudProvider'
```
Defines a logical unit of infrastructure with provider-specific implementations.  
**Properties**:
| Field      | Type                | Required | Description                          |
|------------|---------------------|----------|--------------------------------------|
| `id`       | `string` (UUID)     | Yes      | Globally unique component identifier |
| `type`     | `string`            | Yes      | Resource classification category    |
| `provider` | `CloudProvider`     | Yes      | Target cloud platform                |

---

### ResourceDefinition
```yaml
type: object
properties:
  apiVersion:
    type: string
    pattern: '^nf.io/v\d+(alpha|beta)?\d*$'
  kind:
    type: string
  metadata:
    $ref: '#/components/schemas/ResourceMetadata'
  spec:
    $ref: '#/components/schemas/ResourceSpec'
```
Base schema for all NebulaForge resource declarations.  
**Example**:
```yaml
apiVersion: nf.io/v1
kind: VirtualNetwork
metadata:
  name: prod-network-core
  labels:
    environment: production
spec:
  cidr: 10.0.0.0/16
  subnets: 6
```

---

## Specialized Types

### ResourceMetadata
```yaml
type: object
properties:
  name:
    type: string
    maxLength: 63
  namespace:
    type: string
    default: default
  labels:
    type: object
    additionalProperties:
      type: string
  annotations:
    type: object
    additionalProperties:
      type: string
```
Contains identifying information about infrastructure resources.  
**Constraints**:
- `name` must adhere to DNS-1123 subdomain conventions

---

### DeploymentSpec
```yaml
type: object
properties:
  regions:
    type: array
    items:
      type: string
    minItems: 1
  scalingProfile:
    type: string
    enum: [Static, Horizontal, Vertical]
  networkPolicy:
    $ref: '#/components/schemas/NetworkPolicy'
```
Defines operational characteristics for resource deployment.  
**Fields**:
| Field            | Type              | Required | Description                                |
|------------------|-------------------|----------|--------------------------------------------|
| `regions`        | `string[]`        | Yes      | Target deployment regions (cloud-specific) |
| `scalingProfile` | `string`          | No       | Auto-scaling behavior specification        |
| `networkPolicy`  | `NetworkPolicy`   | No       | Connectivity constraints                   |

---

### ResourceTarget
```yaml
type: object
properties:
  provider:
    $ref: '#/components/schemas/CloudProvider'
  versionConstraint:
    type: string
    pattern: '^[~^]?\d+\.\d+\.\d+$'
```
Specifies compatibility targets for multi-cloud deployments.  
**Example**:
```yaml
provider: Azure
versionConstraint: ^3.2.0
```

---

## Utility Types

### JSONObject
```yaml
type: object
additionalProperties: true
description: Flexible container for provider-specific configuration
```

### ErrorResponse
```yaml
type: object
properties:
  code:
    type: integer
    format: int32
  message:
    type: string
  details:
    type: array
    items:
      type: string
required:
  - code
  - message
```
Standard error payload for API responses.  

---

## Version Information
This specification adheres to **NebulaForge Schema Version 1.3.0**.  
All types are available under the `nf.io` API group.