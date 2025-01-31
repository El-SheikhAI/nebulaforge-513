# NebulaForge Command-Line Interface Reference

## Command Structure
NebulaForge CLI commands follow this universal syntax:  
`nebulaforge [GLOBAL_FLAGS] <COMMAND> [COMMAND_FLAGS] [ARGUMENTS]`

## Global Flags
| Flag          | Description                              |
|---------------|------------------------------------------|
| `--verbose`   | Enable verbose output (debugging mode)  |
| `--no-color`  | Disable colored output                  |
| `--config`    | Specify configuration file (default: `.nebula/config.yaml`) |

---

## Core Commands

### `init`
Initializes a new NebulaForge project structure.

**Syntax**:  
`nebulaforge init [FLAGS] PROJECT_DIRECTORY`

**Flags**:  
`--template=architect`  Preset template (options: architect|spartan|enterprise)  
`--skip-validation`     Bypass initial environment checks  

**Example**:  
```bash
nebulaforge init --template=enterprise ./cloud-infra-project
```

---

### `generate`
Produces IaC configurations from blueprint definitions.

**Syntax**:  
`nebulaforge generate [FLAGS] BLUEPRINT_FILE`

**Flags**:  
`--output=DIR`          Output directory (default: `./artifacts`)  
`--provider=aws`        Target cloud provider (aws|azure|gcp|multicloud)  
`--overwrite`           Replace existing artifacts without confirmation  

**Example**:  
```bash
nebulaforge generate --provider=azure network-topology.nf.yaml
```

---

### `validate`
Verifies configuration syntax and cloud provider compatibility.

**Syntax**:  
`nebulaforge validate [FLAGS] CONFIG_PATH`

**Flags**:  
`--strict`              Enforce semantic validation beyond syntax checks  
`--report=FORMAT`       Generate validation report (json|text|md)  

**Example**:  
```bash
nebulaforge validate --strict --report=json ./definitions/
```

---

### `synthesize`
Compiles infrastructure manifests into provider-specific deployment artifacts.

**Syntax**:  
`nebulaforge synthesize [FLAGS] MANIFEST_DIR`

**Flags**:  
`--target=TYPE`         Output format (terraform|pulumi|cfn)  
`--optimize`            Apply cost/performance optimization profile  

**Example**:  
```bash
nebulaforge synthesize --target=terraform --optimize ./manifests/production
```

---

### `deploy`
Orchestrates infrastructure provisioning to target cloud environments.

**Syntax**:  
`nebulaforge deploy [FLAGS] ENVIRONMENT`

**Flags**:  
`--dry-run`             Simulate deployment without actual resource creation  
`--auto-approve`        Bypass confirmation prompts  
`--var-file=FILE`       Load environment variables from specified file  

**Example**:  
```bash
nebulaforge deploy --dry-run production_env
```

---

## Utility Commands

### `version`
Displays CLI version and core component information.

**Syntax**:  
`nebulaforge version [--detailed]`

---

### `help`
Shows contextual command documentation.

**Syntax**:  
`nebulaforge help [COMMAND_NAME]`

---

## Environment Variables
| Variable              | Purpose                                  |
|-----------------------|------------------------------------------|
| `NF_API_KEY`          | Authentication token for managed services|
| `NF_LOG_LEVEL`        | Set granular logging (debug|info|warn|error) |
| `NF_CACHE_DIR`        | Custom path for temporary artifact storage |

---

## Exit Codes
| Code | Meaning                         |
|------|---------------------------------|
| 0    | Successful execution           |
| 1    | Generic error                  |
| 2    | Configuration validation error |
| 3    | Provider API communication failure |
| 4    | Dependency resolution error    |
| 15   | Managed operation termination via system signal |