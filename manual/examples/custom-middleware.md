# Custom Middleware Development Guide

## Overview
NebulaForge's extensibility model enables engineering teams to implement custom middleware for advanced processing of infrastructure-as-code (IaC) configurations. Middleware functions intercept and transform declarative infrastructure definitions during synthesis pipelines.

## Example: Resource Tagging Middleware
This demonstration implements validation and enrichment middleware for resource tagging compliance.

### Middleware Implementation
Create `tagging-middleware.js`:

```javascript
/**
 * Validates and enhances resource tags in IaC definitions
 * @param {Object} config - Input configuration object
 * @param {Function} next - Next middleware in processing chain
 * @returns {Object} Processed configuration
 */
module.exports = function taggingMiddleware(config, next) {
  // Validate input structure
  if (!config?.resources) {
    throw new Error('Invalid configuration: Missing resources definition');
  }

  // Process resources
  const processed = {
    ...config,
    resources: config.resources.map(resource => ({
      ...resource,
      tags: {
        environment: process.env.NF_ENVIRONMENT || 'development',
        project: 'nebulaforge',
        ...resource.tags
      }
    }))
  };

  // Continue processing chain
  return next(processed);
};
```

### Integration Configuration
Reference the middleware in your NebulaForge manifest:

```yaml
# nebulaforge.yml
synthesis:
  middlewareChain:
    - ./middleware/tagging-middleware.js
    - @nebulaforge/validation-middleware
    - @nebulaforge/core-synthesizer

targets:
  aws:
    regions: [us-west-2, eu-central-1]
  azure:
    regions: [eastus]
```

## Error Handling Best Practices
Implement validation guards in middleware:

```javascript
function validateTags(tags) {
  const MAX_TAG_KEY_LENGTH = 128;
  const MAX_TAG_VALUE_LENGTH = 256;
  
  return Object.entries(tags).every(([key, value]) => {
    if (key.length > MAX_TAG_KEY_LENGTH) {
      throw new Error(`Tag key ${key} exceeds ${MAX_TAG_KEY_LENGTH} characters`);
    }
    
    if (typeof value !== 'string' || value.length > MAX_TAG_VALUE_LENGTH) {
      throw new Error(`Invalid tag value for key ${key}: Must be string <= ${MAX_TAG_VALUE_LENGTH} chars`);
    }
    
    return true;
  });
}
```

## Advanced Use Cases
1. **Cost Attribution**: Implement chargeback tagging strategies
2. **Security Compliance**: Enforce mandatory tags for PCI/HIPAA resources
3. **Environment Propagation**: Synchronize configurations across staging/production environments
4. **Vendor Adaptors**: Transform generic definitions into cloud-specific IaC syntax

## Conclusion
Custom middleware extends NebulaForge's core capabilities while maintaining compliance with organizational standards. The functional composition model ensures deterministic transformations across multi-cloud deployment targets.