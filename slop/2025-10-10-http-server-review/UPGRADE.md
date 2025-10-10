# Upgrade Guide: http-server v14.1.1 → v15.0.0

> **⚠️ CRITICAL: This is a MAJOR RELEASE with BREAKING CHANGES after 3 years without updates**
>
> **DO NOT UPGRADE IN PRODUCTION WITHOUT TESTING**

## 🚨 Critical Breaking Changes - Action Required

### 1. Node.js Version Requirement
- **Old**: Node.js >=12
- **New**: Node.js >=16.20.2
- **Impact**: Server will not start on Node.js versions below 16.20.2
- **Action**: Upgrade Node.js before upgrading http-server

### 2. IPv6 Default Binding
- **Old**: Default host `0.0.0.0` (IPv4 only)
- **New**: Default host `::` (dual-stack IPv4+IPv6)
- **Impact**: Server now listens on both IPv4 and IPv6 by default
- **Security Risk**: May expose services on IPv6 that were previously IPv4-only
- **Action**:
  - Review firewall rules to include IPv6 restrictions
  - To maintain IPv4-only: use `-a 0.0.0.0` flag
  - Update monitoring to include IPv6 endpoints

### 3. Development Dependencies (Contributors Only)
- **Old**: TAP v14
- **New**: TAP v21
- **Impact**: Test syntax and dependencies completely changed
- **Action**: Contributors must update development environment

## ⚠️ Security Warnings

### Header Injection Vulnerability Risk
The new `-H/--header` option can be dangerous if used with untrusted input:
```bash
# DANGEROUS - DO NOT DO THIS
http-server -H "$USER_INPUT"

# SAFE - Validate first
if [[ "$HEADER" =~ ^[A-Za-z0-9-]+:\ [^[:cntrl:]]+$ ]]; then
  http-server -H "$HEADER"
fi
```

### WebSocket Proxy Security
New WebSocket support in proxy mode introduces new attack vectors:
- Long-lived connections consume more resources
- No built-in rate limiting for WebSocket connections
- Authentication bypasses possible if not properly configured

### CORS Wildcard Warning
`--cors` sets `Access-Control-Allow-Origin: *` allowing any origin. Only use for truly public resources.

## 🔄 Quick Decision Tree

```
Should I upgrade?
├─ Are you on Node.js 16.20.2+?
│  ├─ No → Upgrade Node.js first or stay on v14.1.1
│  └─ Yes → Continue ↓
├─ Do you have IPv6 restrictions/firewall rules?
│  ├─ Yes → Update rules before upgrading
│  └─ No → Review security implications ↓
├─ Using http-server in production?
│  ├─ Yes → Test in staging first (2-4 weeks recommended)
│  └─ No → Safe to upgrade with testing
└─ Ready to upgrade? → Follow migration steps below
```

## 📋 Pre-Upgrade Checklist

- [ ] Document current configuration (all flags, environment variables)
- [ ] Backup current http-server version: `npm list -g http-server`
- [ ] Test Node.js version: `node --version` (must be >=16.20.2)
- [ ] Review firewall/security group rules for IPv6
- [ ] Identify all services connecting to http-server
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window
- [ ] Notify stakeholders

## 🚀 Step-by-Step Migration

### Step 1: Test Environment Setup
```bash
# Create test directory
mkdir http-server-upgrade-test
cd http-server-upgrade-test

# Install new version locally for testing
npm install http-server@15.0.0

# Test with your configuration
npx http-server [your-flags-here]
```

### Step 2: Test Connectivity
```bash
# Test IPv4
curl -4 http://localhost:8080

# Test IPv6
curl -6 http://[::1]:8080

# If IPv6 fails and you need IPv4-only:
npx http-server -a 0.0.0.0
```

### Step 3: Update Deployment Scripts
```bash
# Old deployment
http-server /path/to/files

# New deployment (IPv4-only for compatibility)
http-server /path/to/files -a 0.0.0.0

# Or embrace dual-stack (recommended)
http-server /path/to/files  # Now serves both IPv4 and IPv6
```

### Step 4: Update Reverse Proxy Configuration

#### nginx
```nginx
# Add IPv6 upstream
upstream http_server {
    server 127.0.0.1:8080;  # IPv4
    server [::1]:8080;      # IPv6
}
```

#### Apache
```apache
# Update ProxyPass for dual-stack
ProxyPass / http://[::1]:8080/
ProxyPassReverse / http://[::1]:8080/
```

### Step 5: Update Monitoring
```bash
# Update health checks to test both protocols
curl -4 http://localhost:8080/health && \
curl -6 http://[::1]:8080/health
```

### Step 6: Production Deployment
```bash
# Global installation
sudo npm install -g http-server@15.0.0

# Verify installation
http-server --version

# Start with explicit IPv4 if unsure
http-server -a 0.0.0.0 [other-options]
```

## 🆕 New Features Reference

### --base-dir
Serve files from a subdirectory:
```bash
http-server --base-dir api/v1
# Files now served from /api/v1/* instead of /*
```
**Warning**: This changes all URLs - update clients accordingly!

### -H / --header
Add custom response headers:
```bash
http-server -H "X-Custom: Value" -H "Cache-Control: no-store"
```
**Security**: Never pass untrusted input to this flag!

### WebSocket Proxy Support
When using `-P/--proxy`, WebSocket connections are now proxied:
```bash
http-server -P http://backend:3000
# WebSocket upgrade requests are forwarded
```

### Docker Support
```dockerfile
FROM node:20-alpine  # Note: Dockerfile uses node:16 - update recommended
VOLUME /public
WORKDIR /srv/http-server
COPY . .
RUN npm install --production
EXPOSE 8080
CMD ["node", "./bin/http-server"]
```

## 🛠️ Platform-Specific Issues

### macOS
- IPv6 localhost might show as `::1` or `fe80::1%lo0`
- Firewall prompts may appear for IPv6 binding

### Windows
- Windows Firewall requires separate IPv6 rules
- WSL2 has IPv6 quirks - test thoroughly

### Linux
- systemd services need updating:
```ini
# /etc/systemd/system/http-server.service
[Service]
# Add if restricting to IPv4
ExecStart=/usr/bin/http-server -a 0.0.0.0
# Remove IPv4-only restrictions
# RestrictAddressFamilies=AF_INET  # Remove this line
```

### Docker/Kubernetes
```yaml
# Kubernetes Service needs dual-stack
apiVersion: v1
kind: Service
spec:
  ipFamilyPolicy: PreferDualStack
  ipFamilies:
  - IPv4
  - IPv6
```

## 🔧 Troubleshooting

### Server won't start
```bash
# Error: bind EADDRNOTAVAIL ::
# Fix: Use IPv4-only mode
http-server -a 0.0.0.0

# Or check if IPv6 is enabled
sysctl net.ipv6.conf.all.disable_ipv6
```

### Can't connect on IPv6
```bash
# Test IPv6 connectivity
ping6 ::1

# Check listening ports
netstat -an | grep 8080
# Should show:
# tcp6  0  0  :::8080  :::*  LISTEN
```

### Firewall blocking IPv6
```bash
# AWS Security Group - Add IPv6 rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 8080 \
  --cidr ::/0  # IPv6 CIDR
```

## 🔄 Rollback Plan

### Immediate Rollback
```bash
# Downgrade globally
sudo npm install -g http-server@14.1.1

# Verify downgrade
http-server --version

# Start with old defaults (automatic IPv4-only)
http-server [your-options]
```

### Data to Preserve Before Rollback
1. Error logs showing failure reason
2. Network configuration at time of failure
3. System metrics (CPU, memory, connections)

## 📊 Testing Checklist

- [ ] **Connectivity Tests**
  - [ ] IPv4 HTTP requests work
  - [ ] IPv6 HTTP requests work (if enabled)
  - [ ] Existing API endpoints respond correctly
  - [ ] File downloads complete successfully

- [ ] **Security Tests**
  - [ ] Firewall rules effective for IPv6
  - [ ] No unexpected ports exposed
  - [ ] CORS headers as expected
  - [ ] Custom headers properly set

- [ ] **Performance Tests**
  - [ ] Response times comparable to v14.1.1
  - [ ] Memory usage stable
  - [ ] Can handle expected concurrent connections

- [ ] **Integration Tests**
  - [ ] Reverse proxy configuration works
  - [ ] Monitoring/health checks pass
  - [ ] CDN cache invalidation works
  - [ ] Client applications connect successfully

## 🚨 Known Issues

1. **IPv6 on systems with IPv6 disabled**: Server fails to start with default settings
   - Workaround: Use `-a 0.0.0.0`

2. **Docker image uses Node 16**: While package supports Node 22
   - Impact: Missing latest Node.js features and performance improvements

3. **Header injection risk**: No CRLF validation in `-H` option
   - Mitigation: Validate headers before passing to CLI

4. **Temporary fork dependency**: `@isaacs/ts-node-temp-fork-for-pr-2009`
   - Note: Legitimate but temporary, may change in future releases

## 📚 Resources

- **Issue Tracker**: https://github.com/http-party/http-server/issues
- **Security Reports**: security@http-party.org (if available)
- **Community Support**: Stack Overflow tag: `http-server`
- **Migration Examples**: https://github.com/http-party/http-server/examples

## 📅 Recommended Migration Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| Week -2 | 1 week | Test in development environment |
| Week -1 | 1 week | Test in staging, update documentation |
| Day 0 | 1 day | Production deployment (off-peak) |
| Week +1 | 1 week | Monitor metrics, gather feedback |

## ❓ FAQ

**Q: Is this a security update?**
A: Partially. It includes security improvements but also introduces new attack surfaces (IPv6, WebSocket proxy).

**Q: Can I stay on v14.1.1?**
A: Yes, but you won't receive security updates. Plan to upgrade within 6 months.

**Q: Why such massive dependency changes?**
A: TAP testing framework modernization (v14→v21) brings significant dependency updates.

**Q: Will this break my CI/CD pipeline?**
A: Possibly, if it assumes IPv4-only or uses Node.js <16.20.2. Test thoroughly.

**Q: How do I report issues?**
A: GitHub Issues with: version, OS, Node.js version, full command, error messages.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-10
**Next Review**: After v15.0.0 release