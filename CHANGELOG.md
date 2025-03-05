# NebulaForge Changelog

## [1.0.0] - 2023-11-15
### Added
- Initial production release of NebulaForge Core Synthesizer
- Support for AWS CloudFormation, Azure Resource Manager, and Google Cloud Deployment Manager
- Declarative abstraction layer with multi-cloud manifest unification
- Cross-plane resource mapping engine
- Terraform and OpenFaaS backend integration

### Changed
- BREAKING: Redesigned DSL syntax for infrastructure definitions (v1 schema required)
- Upgraded constraint solver to Z3 4.12.1
- Resource reconciliation loop now uses three-way merge strategy

### Fixed
- Critical path resolution error in cyclic dependency graphs
- Authorization context propagation in federated cloud environments
- Memory leak in topology analyzer during large-scale deployments

## [0.3.1] - 2023-10-27
### Fixed
- CVE-2023-45872: Secure default handling of temporary credentials
- Regression in GCP persistent disk type validation
- CLI completion generator for PowerShell environments

## [0.3.0] - 2023-09-14
### Added
- Experimental support for Alibaba Cloud Resource Orchestration Service
- Dry-run simulation mode with policy violation previews
- Bidirectional translation between HCL and YAML definitions

### Changed
- Optimized ARM template generation by 40% through contextual caching
- Strict type checking enabled by default in validation pipeline

### Fixed
- Parallel execution deadlock when processing >500 resources
- Incorrect interpolation of region-specific service endpoints
- UTF-8 encoding errors in manifest serialization

## [0.2.4] - 2023-08-03
### Added
- Audit trail generation for compliance reporting (ISO 27001 compatible)
- Resource tagging strategies for cost allocation frameworks

### Fixed
- Pagination handling in AWS IAM role discovery
- Timezone-aware scheduling of infrastructure snapshots
- X.509 certificate chain validation in mutual TLS setups

## [0.1.0] - 2023-06-19
### Added
- Initial alpha release of NebulaForge Synthesis Engine
- Base framework for cloud-agnostic resource modeling
- Proof-of-concept Azure VM provisioning workflow
- JSON schema validation pipeline

### Changed
- Minimum required Java runtime version to JDK17
- Vendor SDKs decoupled into plugin architecture

---

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).  
All notable changes to this project are documented in this file.