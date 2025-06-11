# Pull Request Process

This document delineates the canonical procedure for contributing code changes to NebulaForge through pull requests (PRs). Adherence to this protocol ensures efficient collaboration while maintaining stringent quality standards across our multi-cloud infrastructure synthesis platform.

## Prerequisites
1. **Signed Contributor License Agreement (CLA)**  
   All contributors must have an executed CLA on file before merging any code.

2. **Branch Management**  
   - Branch from the current `main` branch
   - Prefix branch names with semantic categories:
     - `feature/` for new functionality
     - `bugfix/` for defect remediation
     - `docs/` for documentation improvements
     - `refactor/` for non-functional enhancements

3. **Validation Suite**  
   Ensure all changes pass:
   ```shell
   make precommit # Runs linters, static analysis, and unit tests
   make e2e       # Executes cross-cloud integration tests
   ```

4. **Documentation Alignment**  
   Update corresponding documentation in `/manual` directory for any:
   - New feature implementations
   - Behavioral modifications
   - Public interface changes

## Creating a Pull Request
1. **Template Compliance**  
   Use the PR template (`/.github/pull_request_template.md`) with all sections completed.

2. **Issue Referencing**  
   Reference relevant GitHub issues using auto-closing keywords:
   ```
   Resolves #123
   Addresses #456
   ```

3. **Architectural Description**  
   Include in your PR description:
   - Technical approach rationale
   - Cross-cloud compatibility impact assessment
   - Performance implications
   - Security considerations

## Review Process
1. **Automated Verification**  
   PRs must pass all required CI checks before human review:
   - Build verification (Linux/Windows/macOS)
   - Policy compliance scans
   - Test coverage maintenance (≥85% target)
   - Documentation integrity checks

2. **Reviewer Assignment**  
   - Assign two primary reviewers with domain expertise
   - Tag specialized maintainers for:
     - Cloud provider-specific changes (`@gcp-team`, `@aws-team`, `@azure-team`)
     - Core engine modifications (`@core-synthesis-team`)

3. **Review Expectations**  
   - Maintainers respond within 72 business hours
   - Contributors address feedback within 7 days
   - Resolution of all blocking comments before merge

4. **Approval Standards**  
   Require:
   - Two approving reviews
   - Consensus among affected subsystem owners
   - Security team approval for changes impacting:
     - Authentication flows
     - Secrets management
     - Network policies

## Merging Guidelines
1. **Permission Protocol**  
   Only repository maintainers may merge PRs after:
   - Successful CI completion
   - Final architectural review approval
   - Security clearance (where applicable)

2. **Commit Strategy**  
   - **Preferred**: Clean rebase onto `main` with linear history
   - **Permitted**: Squash merge for single-commit PRs <150 LoC
   - **Prohibited**: Merge commits under all circumstances

## Post-Merge Protocol
1. **Branch Management**  
   Source branches are automatically archived after successful:
   - Merge to `main`
   - Nightly regression suite completion

2. **Downstream Propagation**  
   Changes automatically propagate through our release pipeline:
   ```mermaid
   graph LR
     A[Merged PR] --> B[Nightly Build]
     B -->|Stable| C[Staging Environment]
     C -->|Validated| D[Production Release]
   ```

3. **Issue Automation**  
   Linked issues automatically transition through workflow states:
   - `Resolved` → `QA Validation`
   - `Released` → `Closed`

## Special Considerations
- **Draft PRs**: Encouraged for early architectural feedback
- **Breaking Changes**: Require major version bump per [SemVer](https://semver.org/)
   - Accompanying migration guide in `/manual/upgrades`
   - Backward compatibility shim when feasible
- **Community Contributions**:  
   External PRs receive expedited review cycles (72hr SLA)
   during our monthly Community Contribution Window

---

**Note**: Questions regarding this process should be directed to the Maintainer Council via [Discord #pr-process](https://discord.gg/nebulaforgedev). All participants must adhere to the [NebulaForge Community Norms and Agreements](../CODE_OF_CONDUCT.md).