# GitHub Advanced Security (GAS) Skill

A Claude Code skill for automatically analyzing and fixing GitHub Advanced Security alerts with intelligent, context-aware solutions.

## Overview

This skill enables Claude to:
- 🔍 Detect security vulnerabilities flagged by GitHub Advanced Security
- 🧠 Analyze alerts within project context (not in isolation)
- 🔧 Apply automated fixes for common vulnerability patterns
- ✅ Validate fixes don't break functionality
- 📊 Generate comprehensive reports and documentation

## Quick Start

```bash
# Install the skill (if not already present)
cp -r skills/gas ~/.claude/skills/

# Analyze security alerts in a PR
claude-code skill:gas 123

# Or use the slash command
/fix-gas 123
```

## Features

### Automated Vulnerability Fixes
- **String escaping issues** - Converts single replacements to global regex
- **SQL injection** - Implements parameterized queries
- **Path traversal** - Adds input sanitization and validation
- **Insecure temp files** - Uses secure `mkdtemp` patterns
- **Race conditions** - Implements atomic operations

### Intelligent Decision Making
- Traces data flow to understand vulnerability context
- Checks for existing mitigations before applying fixes
- Validates production reachability of vulnerable code
- Identifies and dismisses false positives with evidence

### Safety First
- Runs tests after each fix to ensure no breakage
- Reverts changes if tests fail
- Escalates complex issues to human review
- Maintains full audit trail in git history

## File Structure

```
skills/gas/
├── README.md           # This file
├── SKILL.md           # Main skill definition for Claude
├── PROMPTS.md         # Internal reasoning templates
└── scripts/
    └── view-pr-gas.sh # Bash script to extract GAS alerts
```

## How It Works

1. **Detection**: Runs `view-pr-gas.sh` to extract security alerts from PR
2. **Analysis**: Reads affected files and traces vulnerability context
3. **Decision**: Determines if automated fix is appropriate
4. **Implementation**: Applies fix or escalates to user
5. **Validation**: Runs tests to ensure fix doesn't break functionality
6. **Documentation**: Commits changes with detailed messages

## Configuration

### Environment Variables

```bash
# Required for GitHub API access
export GITHUB_TOKEN="ghp_..."

# Optional configuration
export GAS_AUTO_FIX="true"        # Enable automatic fixing (default: true)
export GAS_BATCH_SIZE="10"        # Alerts per commit (default: 10)
export GAS_TEST_TIMEOUT="30000"   # Test timeout in ms (default: 30000)
```

### Project Requirements

- Git repository with GitHub remote
- GitHub Advanced Security enabled
- `gh` CLI tool installed and authenticated
- Language-specific testing framework (npm, pytest, etc.)

## Usage Examples

### Basic Usage
```bash
# Fix all alerts in current PR
/fix-gas

# Fix alerts in specific PR
/fix-gas 456

# Dry run - see what would be fixed
/fix-gas 456 --dry-run
```

### Advanced Usage
```bash
# Fix only high severity alerts
/fix-gas 456 --severity=high

# Generate report without fixing
/fix-gas 456 --report-only

# Use custom commit prefix
/fix-gas 456 --commit-prefix="security:"

# Process specific alert types
/fix-gas 456 --type="sql-injection,path-traversal"
```

### CI/CD Integration

```yaml
# .github/workflows/security.yml
name: Auto-fix Security Alerts
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  fix-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: anthropics/claude-code@v1
      - run: |
          claude-code skill:gas ${{ github.event.pull_request.number }}
      - uses: peter-evans/create-pull-request@v5
        with:
          branch: security-fixes
          title: "fix: automated security fixes"
```

## Alert Types Supported

| Alert Type | Auto-Fix | Manual Review | Notes |
|------------|----------|---------------|-------|
| Incomplete string escaping | ✅ | - | Regex replacement |
| SQL injection | ✅ | - | Query parameterization |
| Path traversal | ✅ | - | Input validation |
| Insecure temp files | ✅ | - | mkdtemp usage |
| XSS | ✅ | - | Output encoding |
| Command injection | ⚠️ | ✅ | Context dependent |
| Race conditions | ⚠️ | ✅ | Architectural review |
| Dependency CVEs | - | ✅ | Requires version analysis |
| Cryptographic issues | - | ✅ | Security expertise needed |

## Example Output

```markdown
## 🔒 Security Alert Resolution Summary

**PR:** #123
**Processed:** 2024-11-15 10:30:45
**Duration:** 2m 34s

### 📊 Results
| Status | Count | Details |
|--------|-------|---------|
| ✅ Fixed | 8 | Automated fixes applied |
| 🔍 Dismissed | 3 | False positives identified |
| ⚠️ Needs Review | 2 | Manual decision required |

### Next Steps
1. Review changes in commits abc123, def456
2. Address 2 items requiring manual review
3. Run full test suite before merge
```

## Development

### Testing the Skill
```bash
# Run the detection script standalone
./skills/gas/scripts/view-pr-gas.sh 123

# Test with Claude in dry-run mode
claude-code skill:gas 123 --dry-run

# Validate against known vulnerabilities
claude-code skill:gas test --fixture=owasp-top10
```

### Extending the Skill

To add support for new alert types:

1. Add detection pattern to `SKILL.md` decision matrix
2. Add fix template to Alert-Specific Patterns section
3. Add internal reasoning to `PROMPTS.md`
4. Test with real examples

### Contributing

Improvements welcome! Please:
1. Test changes against real security alerts
2. Ensure fixes don't break existing functionality
3. Update documentation for new patterns
4. Include example alerts in PRs

## Best Practices

### When Using This Skill

1. **Always review changes** - Automated fixes should be verified
2. **Run in PR branches** - Never directly on main/master
3. **Test thoroughly** - Ensure full test suite passes
4. **Document dismissals** - Provide clear justification
5. **Monitor patterns** - Look for systemic issues

### Security Considerations

- This skill has access to modify code
- Always runs in sandboxed environment
- Changes are tracked in git history
- Requires explicit user approval for complex fixes
- Never stores or transmits sensitive data

## Troubleshooting

### Common Issues

**"No alerts found"**
- Ensure GitHub Advanced Security is enabled
- Check PR has been scanned
- Verify GITHUB_TOKEN has correct permissions

**"Tests failing after fix"**
- Skill will automatically revert
- Review suggested fix for compatibility
- May need manual adjustment for edge cases

**"Cannot determine context"**
- Skill will escalate to user
- Provide additional context when prompted
- May indicate architectural complexity

## Performance

- Single alert: ~10 seconds
- 10 alerts: ~1 minute
- 50 alerts: ~5 minutes
- Includes test execution time

## Version History

- **1.0.0** (2024-11-15): Initial release
  - Core vulnerability fixes
  - Batch processing support
  - CI/CD integration
  - Comprehensive reporting

## License

This skill is provided as-is for use with Claude Code. See repository license for details.

## Support

For issues or questions:
- Open an issue in the repository
- Review skill logs with `--verbose` flag
- Check [SKILL.md](./SKILL.md) for detailed behavior
- Consult [PROMPTS.md](./PROMPTS.md) for reasoning patterns

---

Built with ❤️ for secure, automated development workflows.