# NebulaForge Testing Guidelines

## Introduction
This document establishes formal testing procedures for NebulaForge development. Rigorous validation is mandatory given our mission-critical role in infrastructure synthesis. All contributions MUST demonstrate comprehensive test coverage before review.

## Test Categorization

### 1. Unit Tests
- **Scope**: Validate individual logic units in isolation
- **Coverage Requirement**: ≥95% statement coverage
- **Framework**: Go `testing` package + `testify`
- **Conventions**:
  ```go
  func TestResourceParser_Validate(t *testing.T) {
      t.Parallel()
      testCases := []struct {
          name        string
          input       string
          expectedErr error
      }{
          // Test matrix
      }
  
      for _, tc := range testCases {
          t.Run(tc.name, func(t *testing.T) {
              parser := NewResourceParser()
              _, err := parser.Parse(tc.input)
              assert.ErrorIs(t, err, tc.expectedErr)
          })
      }
  }
  ```

### 2. Integration Tests
- **Scope**: Validate cross-component interactions with cloud providers
- **Coverage Requirement**: Full path coverage for execution workflows
- **Framework**: Custom test harness with containerized environments  
  ![Integration Test Architecture](media/integration-test-arch.png)

```bash
# Test execution command
make test-integration PROVIDERS=aws,gcp,azure
```

### 3. End-to-End Validation
- **Scope**: Synthesize complete infrastructure stacks in ephemeral environments
- **Validation Criteria**:
  - Successful provisioning via Terraform/OpenTofu
  - Cloud API verification of provisioned resources
  - Idempotency checks
  - Tear-down validation

```markdown
| Test Aspect       | AWS | GCP | Azure | OCI  |
|-------------------|-----|-----|-------|------|
| Compute Synthesis | ✅  | ✅  | ✅    | ⚠️  |
| Networking        | ✅  | ⚠️  | ✅    | ❌   |
| IAM Integration   | ⚠️  | ✅  | ⚠️    | ❌   |
```

## Test Development Workflow

1. **Test Implementation**  
   Branch name format: `test/<component>-<JIRA-ID>`

2. **Local Verification**  
   Execute full test matrix before commit:
   ```bash
   make verify
   ```

3. **Continuous Integration**  
   GitHub Actions pipeline enforces:
   - Unit test coverage thresholds
   - Provider-specific integration suites
   - Multi-arch container compatibility

## Best Practices

### Test Construction
- **Isolation**: Each test case must be independent and parallelizable
- **Naming**: Follow `Test<Unit>_<Condition>_<Expectation>` convention
- **Table-Driven**: Structure tests using parameterized test cases

### Cloud Interactions
- Use `cloud-test-env` Docker images for provider authentication
- Apply timeouts to all external calls:
  ```go
  ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
  defer cancel()
  ```

### Performance Standards
| Test Type         | Maximum Duration |
|-------------------|------------------|
| Unit              | 50ms per case    |
| Integration       | 5s per case      |
| E2E Provisioning  | 10m per provider |

## Exception Handling
Submit test waiver requests via `TEST_EXEMPTION` template:
```markdown
| Rationale                 | Mitigation Plan | Target Removal Date |
|---------------------------|----------------|----------------------|
| Cloud API rate limiting   | Mock adaptation | 2024-03-31          |
```

## Review Criteria
All PRs must demonstrate:
- Coverage delta analysis
WARNING: Pull requests showing coverage degradation >5% will be automatically rejected

---

This document rev. 3.4 approved by Technical Steering Committee on 2024-02-15