# NebulaForge Client SDK Tutorial

## Overview
The NebulaForge Client SDK provides programmatic access to NebulaForge's cloud infrastructure synthesis capabilities. This tutorial demonstrates practical integration patterns using JavaScript/Node.js to generate, analyze, and deploy Infrastructure as Code (IaC) configurations across multiple cloud providers.

## Prerequisites
1. Node.js v18+
2. Active NebulaForge account with API credentials
3. Basic understanding of Terraform or CloudFormation syntax

## Installation
```bash
npm install @nebulaforge/client-sdk --save
```

## Initialization
Configure the SDK with your API credentials:

```javascript
const { NebulaForgeClient } = require('@nebulaforge/client-sdk');

const client = new NebulaForgeClient({
  apiKey: process.env.NEBULA_API_KEY,
  environment: 'production', // 'staging' for test environments
  version: '2023-07'
});
```

## Core Operations

### 1. Infrastructure Synthesis
Generate multi-cloud IaC configurations from high-level requirements:

```javascript
async function generateInfrastructure() {
  const spec = {
    name: "ecommerce-backend",
    providers: ["aws", "gcp"],
    components: [
      {
        type: "database",
        engine: "postgresql",
        replication: "multi-region",
        scalability: "auto"
      },
      {
        type: "compute",
        architecture: "serverless",
        runtime: "node18.x",
        concurrency: 1000
      }
    ]
  };

  try {
    const synthesis = await client.synthesize(spec);
    console.log(`Generated configuration:\n${synthesis.iacConfig}`);
    console.log(`Cost estimate: $${synthesis.costEstimation.monthly}/mo`);
    console.log(`Security Report: ${synthesis.securityAnalysis.summary}`);
  } catch (error) {
    console.error(`Synthesis failed: ${error.details}`);
  }
}
```

### 2. Configuration Retrieval
Access historical configurations and analysis reports:

```javascript
async function retrieveConfiguration(configId) {
  const config = await client.getConfiguration(configId, {
    format: 'terraform-aws',  // Options: json, hcl, yaml, terraform-*, cloudformation-*
    version: 2               // Configuration version history
  });

  console.log(`Configuration metadata:`);
  console.log(`- Created: ${config.metadata.createdAt}`);
  console.log(`- Provider: ${config.metadata.targetProviders.join(', ')}`);
  console.log(`- DRIFT Status: ${config.analysis.driftStatus}`);
}
```

### 3. Deployment Orchestration
Execute deployment workflows across multiple clouds:

```javascript
async function deployConfiguration(configId) {
  const deployment = await client.deploy(configId, {
    executionMode: "auto-approve",  // Manual approval optional
    environmentVariables: {
      AWS_REGION: "us-east-1",
      GCP_PROJECT: "my-project-id"
    }
  });

  console.log(`Deployment Status: ${deployment.status}`);
  console.log(`Cloud Resources Created:`);
  deployment.resources.forEach(res => {
    console.log(`- ${res.provider}: ${res.type} (${res.identifier})`);
  });
}
```

## Advanced Usage

### Multi-Cloud Configuration Analysis
```javascript
async function analyzeCrossCloud() {
  const matrix = await client.compareConfigurations({
    baseConfig: "config-123",
    targetConfig: "config-456",
    comparisonMetrics: ["cost", "security", "latency"]
  });

  console.log("Cost Comparison:");
  console.log(`- Base: $${matrix.cost.base} vs Target: $${matrix.cost.target}`);
  console.log(`- Difference: ${matrix.cost.percentChange}%`);

  console.log("\nSecurity Findings:");
  matrix.security.vulnerabilities.forEach(vuln => {
    console.log(`- ${vuln.severity}: ${vuln.description}`);
  });
}
```

## Error Handling
Implement robust error management:

```javascript
client.on('error', (error) => {
  switch(error.code) {
    case 'QUOTA_EXCEEDED':
      console.error("API quota exceeded. Upgrade plan or optimize requests.");
      break;
    case 'SYNTAX_VALIDATION':
      console.error(`Validation error: ${error.details.join('\n- ')}`);
      break;
    case 'CLOUD_PROVIDER_AUTH':
      console.error("Cloud provider credentials invalid");
      break;
    default:
      console.error(`Unexpected error: ${error.message}`);
  }
});
```

## Best Practices
1. **Environment Isolation**: Use separate API keys for development/staging/production
2. **Configuration Versioning**: Always track configuration versions
3. **Cost Monitoring**: Implement budget alerts using `costEstimation` metadata
4. **Security Scanning**: Run automated checks using the security analysis API

## Performance Considerations
- Enable caching for frequent configuration retrievals:
  ```javascript
  const client = new NebulaForgeClient({
    cache: {
      enabled: true,
      ttl: 3600  // Cache duration in seconds
    }
  });
  ```

- Utilize asynchronous operations for long-running tasks:
  ```javascript
  const deployment = await client.deploy(configId, { async: true });
  const status = await client.trackOperation(deployment.operationId);
  ```

## Troubleshooting
| Symptom | Resolution |
|---------|------------|
| `ECONNRESET` errors | Configure retry strategy with `retry: { attempts: 3 }` in client options |
| Configuration drift | Use `client.detectDrift(configId)` and `client.remediate(configId)` |
| Version conflicts | Specify exact API version in client initialization |
| Dependency conflicts | Check with `npm ls @nebulaforge/client-sdk` |

---

## References
1. [Official Documentation](https://docs.nebulaforge.io/sdk)
2. [IaC Best Practices Whitepaper](https://nebulaforge.io/whitepapers/iac-patterns.pdf)
3. API Reference Guide (included in SDK package)

> **NOTE**: Always verify cloud provider credentials and test configurations in staging environments before production deployment. This SDK implements automatic request retries and exponential backoff for transient failures.