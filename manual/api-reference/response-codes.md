# NebulaForge API Response Codes

This document describes the standard HTTP response codes used by the NebulaForge API. All responses utilize JSON format and follow IETF standards for HTTP status codes.

---

## Success Responses (2xx)

### 200 OK

**Context**: Successful retrieval of resource(s)
**Response Body**:
```json
{
  "data": {
    "id": "config-id-12345",
    "type": "iac_configuration",
    "attributes": { /* Resource-specific data */ }
  },
  "links": { /* Navigation links */ }
}
```

### 201 Created

**Context**: Successful resource creation (synchronous operations)
**Headers**:
- `Location: /v1/configurations/config-id-12345`
  
**Response Body**:
```json
{
  "data": {
    "id": "config-id-12345",
    "status": "provisioning",
    "created_at": "2023-11-15T09:23:42Z"
  }
}
```

### 202 Accepted

**Context**: Asynchronous operation initiation (common for multi-cloud deployments)
**Headers**:
- `Location: /v1/operations/op-67890`

**Response Body**:
```json
{
  "operation_id": "op-67890",
  "status_url": "/v1/operations/op-67890",
  "estimated_completion": "2023-11-15T09:28:00Z"
}
```

---

## Client Errors (4xx)

### 400 Bad Request

**Typical Causes**:
- Malformed JSON payload
- Missing required parameters
- Schema validation failures

**Response Body**:
```json
{
  "error": {
    "code": "NF-400-02",
    "message": "Invalid input: 'region' must be an AWS-compatible region",
    "details": [
      {
        "field": "parameters.region",
        "issue": "UNSUPPORTED_VALUE"
      }
    ]
  }
}
```

### 401 Unauthorized

**Requirements**:
- Valid `Authorization: Bearer <token>` header missing
- Expired credentials

**Response Body**:
```json
{
  "error": {
    "code": "NF-401-01",
    "message": "Authentication required",
    "documentation_url": "https://docs.nebulaforge.com/authentication"
  }
}
```

### 403 Forbidden

**Typical Scenarios**:
- Insufficient permissions for target resource
- Organization policy restrictions

**Response Body**:
```json
{
  "error": {
    "code": "NF-403-07",
    "message": "Write access to project 'sandbox' denied"
  }
}
```

### 404 Not Found

**Resolution Guidance**:
- Verify resource IDs in path parameters
- Check regional availability of requested resources

**Response Body**:
```json
{
  "error": {
    "code": "NF-404-11",
    "message": "Environment 'dev-west-01' not found",
    "suggested_actions": [
      "Verify environment ID",
      "List available environments: GET /v1/environments"
    ]
  }
}
```

### 422 Unprocessable Entity

**Special Notes**:
- Semantic validation failure (correct syntax but invalid context)
- Cross-field dependencies violation

**Response Body**:
```json
{
  "error": {
    "code": "NF-422-05",
    "message": "Cannot deploy Azure functions to GCP region",
    "conflicts": [
      {
        "resource_type": "cloud_function",
        "provider_constraint": "azure",
        "target_environment": "gcp/us-central1"
      }
    ]
  }
}
```

### 429 Too Many Requests

**Standard Headers**:
- `Retry-After: 30`

**Response Body**:
```json
{
  "error": {
    "code": "NF-429-00",
    "message": "Rate limit exceeded for organization 'acme-corp'",
    "limits": "100 requests/5min",
    "reset_time": "2023-11-15T09:25:00Z"
  }
}
```

---

## Server Errors (5xx)

### 500 Internal Server Error

**Troubleshooting**:
- Include `X-Request-ID` header value in support tickets
- Retry non-mutative requests after exponential backoff

**Response Body**:
```json
{
  "error": {
    "code": "NF-500-00",
    "message": "Internal system failure",
    "reference_id": "req-abcd1234"
  }
}
```

### 503 Service Unavailable

**Common Triggers**:
- Planned maintenance windows
- Upstream cloud provider outages

**Headers**:
- `Retry-After: 300`

**Response Body**:
```json
{
  "error": {
    "code": "NF-503-03",
    "message": "Terraform state service offline",
    "estimated_recovery": "2023-11-15T11:00:00Z"
  }
}
```