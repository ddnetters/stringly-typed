# Troubleshooting

Common issues and solutions for the String Validator GitHub Action.

## Common Issues

### Action Fails to Start

#### Error: "Cannot find action"

```
Error: Can't find 'action.yml', 'action.yaml' or 'Dockerfile' under '/path/to/action'
```

**Cause:** Incorrect action reference or missing action files.

**Solutions:**
1. Check action reference in workflow:
   ```yaml
   # ✅ Correct
   uses: ddnetters/string-validator-action@v1
   
   # ❌ Incorrect
   uses: ddnetters/string-validator-action/
   ```

2. Verify action files exist in repository root:
   ```
   action.yml        # Required
   dist/index.js     # Required (built action)
   package.json      # Required
   ```

#### Error: "Node.js version not supported"

```
Error: The runner does not support Node.js version 'x.x.x'
```

**Solutions:**
1. Update runner to support Node.js 18+:
   ```yaml
   runs-on: ubuntu-latest  # Use latest runner
   ```

2. Or specify Node.js version explicitly:
   ```yaml
   - uses: actions/setup-node@v3
     with:
       node-version: '18'
   ```

### Configuration Issues

#### Error: "Invalid input parameters"

```
Error: Input required and not supplied: checker
```

**Solutions:**
1. Provide all required inputs:
   ```yaml
   with:
     files: 'src/**/*.js'
     checker: 'char_count'      # Required
     decider: 'threshold'    # Required
   ```

2. Check input spelling and case sensitivity.

#### Error: "JSON parsing failed"

```
Error: Unexpected token in JSON at position 0
```

**Cause:** Invalid JSON in `checker-options` or `decider-options`.

**Solutions:**
1. Validate JSON syntax:
   ```yaml
   # ✅ Valid JSON
   checker-options: '{"maxChars": 100}'
   
   # ❌ Invalid JSON
   checker-options: '{maxChars: 100}'
   ```

2. Use YAML multiline strings for complex JSON:
   ```yaml
   checker-options: |
     {
       "logic": "content.length > 5 && !content.includes('TODO')"
     }
   ```

3. Test JSON validity online or with `JSON.parse()`.

### File Pattern Issues

#### Error: "No files found"

```
Warning: No files matched the pattern 'src/**/*.js'
```

**Causes & Solutions:**

1. **Incorrect file patterns:**
   ```yaml
   # Check if pattern matches your file structure
   files: 'src/**/*.{js,ts}'  # Include file extensions
   ```

2. **Case sensitivity:**
   ```yaml
   # Unix systems are case-sensitive
   files: 'SRC/**/*.JS'      # ❌ Won't match 'src/**/*.js'
   files: 'src/**/*.js'      # ✅ Correct case
   ```

3. **Missing files in repository:**
   ```bash
   # Verify files exist
   git ls-files 'src/**/*.js'
   ```

4. **Glob pattern syntax:**
   ```yaml
   # ✅ Correct patterns
   files: 'src/**/*.js'           # All JS files in src/
   files: '**/*.{js,ts,md}'       # Multiple extensions
   files: 'src/**/*,docs/**/*'    # Multiple directories
   
   # ❌ Common mistakes
   files: 'src/*.js'              # Only direct children
   files: 'src/**.*js'            # Incorrect extension syntax
   ```

### Validation Issues

#### Error: "Custom logic error"

```
Error: Custom logic error: ReferenceError: undefinedVariable is not defined
```

**Causes & Solutions:**

1. **Undefined variables:**
   ```javascript
   // ❌ Undefined variable
   "undefinedVar.length > 5"
   
   // ✅ Use available variables
   "content.length > 5"
   ```

2. **Syntax errors:**
   ```javascript
   // ❌ Invalid syntax
   "content.length > 5 &&"
   
   // ✅ Valid syntax
   "content.length > 5 && content.includes('hello')"
   ```

3. **Available variables in custom logic:**
   - **Checkers:** `content` (string)
   - **Deciders:** `results` (ValidationResult[])

#### Error: "Validation never completes"

**Causes & Solutions:**

1. **Large file sets - use file filtering:**
   ```yaml
   # Add exclusions for large directories
   files: 'src/**/*.js,!node_modules/**,!dist/**'
   ```

2. **Complex custom logic - simplify:**
   ```javascript
   // ❌ Complex logic that may hang
   "results.map(r => r.valid).reduce((a,b) => a && b, true)"
   
   // ✅ Simpler equivalent
   "results.every(r => r.valid)"
   ```

3. **Check action timeout:**
   ```yaml
   - name: Validate strings
     timeout-minutes: 10  # Add timeout
     uses: ddnetters/string-validator-action@v1
   ```

### Permission Issues

#### Error: "Permission denied"

```
Error: EACCES: permission denied, open '/path/to/file'
```

**Solutions:**

1. **Check repository permissions:**
   ```yaml
   permissions:
     contents: read  # Required for file access
   ```

2. **Verify checkout action:**
   ```yaml
   - uses: actions/checkout@v3  # Required before string validation
   ```

3. **File system permissions in self-hosted runners:**
   ```bash
   # Fix file permissions
   chmod -R 755 /path/to/repository
   ```

### Performance Issues

#### Issue: "Action runs too slowly"

**Optimizations:**

1. **Limit file scope:**
   ```yaml
   # Instead of scanning everything
   files: '**/*'
   
   # Scan specific areas
   files: 'src/**/*.{js,ts}'
   ```

2. **Use file exclusions:**
   ```yaml
   files: 'src/**/*.js,!src/**/*.test.js,!node_modules/**'
   ```

3. **Parallel execution:**
   ```yaml
   strategy:
     matrix:
       path: ['src/components', 'src/utils', 'src/pages']
   steps:
     - uses: ddnetters/string-validator-action@v1
       with:
         files: '${{ matrix.path }}/**/*.js'
   ```

4. **Incremental validation:**
   ```yaml
   - name: Get changed files
     id: changed
     uses: tj-actions/changed-files@v39
     with:
       files: 'src/**/*.js'
       
   - name: Validate only changed files
     if: steps.changed.outputs.any_changed == 'true'
     uses: ddnetters/string-validator-action@v1
     with:
       files: ${{ steps.changed.outputs.all_changed_files }}
   ```

## Debugging Techniques

### Enable Debug Logging

```yaml
- name: Validate strings
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
  env:
    ACTIONS_STEP_DEBUG: true  # Enable debug logging
```

### Inspect Action Outputs

```yaml
- name: Validate strings
  id: validate
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
    
- name: Debug outputs
  run: |
    echo "Pass: ${{ steps.validate.outputs.pass }}"
    echo "Summary: ${{ steps.validate.outputs.summary }}"
    echo "Results: ${{ steps.validate.outputs.results }}"
```

### Test Action Locally

Use [act](https://github.com/nektos/act) to test locally:

```bash
# Install act
npm install -g @nektos/act

# Run workflow locally
act -j validate-strings

# Run with specific event
act pull_request -j validate-strings
```

### Minimal Test Case

Create a minimal test to isolate issues:

```yaml
# .github/workflows/debug.yml
name: Debug String Validation
on: workflow_dispatch

jobs:
  debug:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Create test file
        run: echo 'const msg = "Hello world";' > test.js
        
      - name: Test validation
        uses: ddnetters/string-validator-action@v1
        with:
          files: 'test.js'
          checker: 'char_count'
          decider: 'threshold'
```

## Error Recovery

### Graceful Degradation

```yaml
- name: Try strict validation
  id: strict
  continue-on-error: true
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'noCritical'
    
- name: Fallback to lenient validation
  if: steps.strict.outcome == 'failure'
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
    decider-options: '{"minValidRatio": 0.5}'
```

### Conditional Validation

```yaml
- name: Check if validation should run
  id: should-validate
  run: |
    if [[ "${{ github.event_name }}" == "pull_request" ]] && [[ "${{ github.base_ref }}" == "main" ]]; then
      echo "run=true" >> $GITHUB_OUTPUT
    else
      echo "run=false" >> $GITHUB_OUTPUT
    fi
    
- name: Validate strings
  if: steps.should-validate.outputs.run == 'true'
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
```

## Getting Help

### Collect Diagnostic Information

When reporting issues, include:

1. **Workflow file:**
   ```yaml
   # Your complete workflow configuration
   ```

2. **Action version:**
   ```yaml
   uses: ddnetters/string-validator-action@v1.2.3  # Specific version
   ```

3. **Error messages:**
   ```
   Complete error output from GitHub Actions logs
   ```

4. **File structure:**
   ```
   Repository structure and file types being validated
   ```

5. **Sample files:**
   ```javascript
   // Example files that cause issues
   ```

### Report Issues

1. **GitHub Issues:** [Create an issue](https://github.com/ddnetters/string-validator-action/issues)
2. **Discussions:** [Start a discussion](https://github.com/ddnetters/string-validator-action/discussions)
3. **Security Issues:** Email security@ddnetters.com

### Community Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Action Template](https://github.com/actions/typescript-action)
- [Action Debugging Guide](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)

## Known Limitations

### File Size Limits

- Maximum file size: 50MB per file
- Maximum total content: 500MB per run
- Large repositories may need chunking

### Pattern Matching

- Glob patterns use minimatch syntax
- Some advanced regex features not supported
- Case sensitivity varies by runner OS

### Custom Logic Constraints

- No access to external APIs or file system
- Limited to JavaScript expressions
- No async operations in custom logic
- Execution timeout: 30 seconds per expression

### Memory Usage

- High memory usage with large codebases
- Consider file filtering for repositories >10k files
- Runner memory limits may cause failures

## Next Steps

- [Examples](examples.md) - See working examples
- [API Reference](api.md) - Detailed API documentation
- [Contributing](../CONTRIBUTING.md) - Help improve the action