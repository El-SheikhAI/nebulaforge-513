# NebulaForge API Authentication

## Overview
Authentication mechanisms for NebulaForge's programmatic interface enforce secure access to infrastructure synthesis operations. The API implements OAuth 2.0 (RFC 6749) and API key validation protocols to authorize requests across all multi-cloud generation endpoints.

---

## Authentication Methods

### API Key Authentication
Primary method for service-to-service integration. 

1. **Obtaining Keys**  
   Navigate to **Dashboard > Account Settings > Security > API Keys** to generate credentials.

2. **Usage**  
   Include the key in request headers:
   ```http
   Authorization: NF-API-KEY 08a2dbfb-89d4-4cb8-8d1e-18f2277141a7
   ```

### OAuth 2.0 (Client Credentials Flow)
Recommended for third-party application integrations.

#### Authorization Workflow
1. Register client application through **Developer Portal > OAuth Applications**
2. Use credentials to request access token:
   ```bash
   curl -X POST "https://api.nebulaforge.io/oauth/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=CLIENT_ID&client_secret=CLIENT_SECRET&grant_type=client_credentials"
   ```
3. Include bearer token in subsequent requests:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI...
   ```

### Short-Lived Access Tokens
Ephemeral credentials for CI/CD pipelines (JWT-based, valid for 15 minutes).  

**Generation**:
```bash
nebulaforge-cli auth generate-token --environment=production
```

---

## Security Specifications

1. **HTTPS Enforcement**  
   All authentication exchanges require TLS 1.3 encryption.

2. **Key Rotation**  
   - API Keys: Mandatory rotation every 90 days
   - OAuth Secrets: Rotate every 180 days

3. **Token Expiration**  
   | Token Type       | Validity Period |
   |------------------|-----------------|
   | OAuth Access     | 1 hour          |
   | CI/CD Tokens     | 15 minutes      |

4. **IP Allowlisting**  
   Enterprise-tier accounts may restrict API access to predefined CIDR ranges.

---

## Error Responses

| Code | Error                 | Resolution Steps                     |
|------|-----------------------|--------------------------------------|
| 401  | `invalid_credentials` | Verify key format/token expiration  |
| 403  | `scope_insufficient`  | Request additional permissions       |
| 429  | `rate_limit_exceeded` | Check `X-RateLimit-Remaining` header |

---

## Best Practices
- Store secrets using vault solutions (AWS Secrets Manager, HashiCorp Vault)
- Implement exponential backoff for 429 responses
- Validate JWT signatures using published [OIDC configuration](https://api.nebulaforge.io/.well-known/openid-configuration)

> Contact **security@nebulaforge.io** within 5 minutes of suspected credential compromise.  
> Full security audit documentation: [NebulaForge Security White Paper](https://docs.nebulaforge.io/security-architecture)