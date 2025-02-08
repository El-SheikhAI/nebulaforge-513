# NebulaForge Authentication Guide

## 1. Introduction to Authentication
NebulaForge implements a robust authentication framework supporting multiple credentialing mechanisms. All API interactions and CLI operations require valid authentication credentials to execute infrastructure synthesis operations. This document specifies the supported authentication methods and their implementation details.

## 2. Authentication Methods

### 2.1 API Key Authentication
Primary method for machine-to-machine communication:

```bash
curl -X POST https://api.nebulaforge.io/v1/synthesize \
  -H "Authorization: Bearer nf_apikey_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{"template": "aws-ec2-cluster"}'
```

**Key Characteristics:**
- 64-character alphanumeric strings prefixed with `nf_apikey_`
- Generated through the NebulaForge Console → Security → API Keys
- Require rotation every 90 days (enforced compliance)

### 2.2 Service Account Authentication
For automated pipeline integration:

1. Create service account:
```bash
nebulaforge service-accounts create \
  --name "CI/CD Pipeline" \
  --role SYNTHESIZER_ENGINE \
  --output credentials.json
```

2. Authenticate with JWT:
```python
from nebulaforge_sdk import Client
client = Client.from_service_account_file("credentials.json")
client.synthesize_infrastructure(manifest)
```

### 2.3 OAuth 2.0 Authentication
For user-facing applications:

**Authorization Code Flow:**
```
GET /oauth2/auth?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=REDIRECT_URI&
  scope=infra:read+infra:write
```

**Token Request:**
```bash
curl -X POST https://api.nebulaforge.io/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "redirect_uri=REDIRECT_URI" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET"
```

### 2.4 OpenID Connect Integration
For organizations using identity providers:

```yaml
# nebulaforge-config.yaml
authentication:
  oidc:
    issuer_url: "https://your-idp.example.com"
    client_id: "nebulaforge-prod"
    scopes: ["openid", "profile", "email"]
    claim_mappings:
      role: "https://nebulaforge/claims/roles"
```

## 3. Multi-Cloud Credential Binding
NebulaForge requires cloud provider credentials for infrastructure deployment:

```bash
nebulaforge credentials attach \
  --provider AWS \
  --role-arn arn:aws:iam::123456789012:role/NebulaForgeDeployer
```

Supported credential mechanisms:
- AWS IAM Roles Anywhere
- Azure Managed Identities
- GCP Workload Identity Federation
- Vault-based credential brokering

## 4. Security Best Practices

1. **Secret Management:**
   - All credentials must be stored in encrypted secret stores
   - Never commit credentials to version control systems
   - Use temporary credentials with limited lifetimes

2. **Access Control:**
   ```bash
   nebulaforge iam policy create \
     --name "SynthesizerOperator" \
     --actions "synthesize:execute" \
     --resources "template:*"
   ```

3. **Audit Logging:**
   - All authentication events logged to CloudAudit service
   - Real-time anomaly detection for credential usage

4. **Credential Rotation:**
   - Implement automatic key rotation via:
   ```bash
   nebulaforge security rotate-credentials --automated --schedule "0 0 1 * *"
   ```

## 5. Troubleshooting

**Common Error Codes:**
- `401 Unauthorized`: Invalid or expired credentials
- `403 Forbidden`: Insufficient permissions for requested operation
- `429 Too Many Requests`: Authentication rate limiting triggered

**Diagnostic Commands:**
```bash
nebulaforge auth verify --verbose
nebulaforge auth context --show-scopes
```

## 6. Summary
This documentation specifies the complete authentication framework for NebulaForge. Implementers must choose the appropriate authentication method based on their use case while adhering to the security practices outlined in section 4. All authentication flows comply with OAuth 2.1 and OpenID Connect Core 1.0 specifications.