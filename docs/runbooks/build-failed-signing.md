# Runbook: Build Failed - Code Signing

> Troubleshooting guide for code signing failures

## Quick Diagnosis

Check the error message:

| Error Contains | Platform | Go To |
|----------------|----------|-------|
| `codesign` | iOS | [iOS Signing Issues](#ios-signing-issues) |
| `provisioning profile` | iOS | [iOS Signing Issues](#ios-signing-issues) |
| `keystore` | Android | [Android Signing Issues](#android-signing-issues) |
| `jarsigner` | Android | [Android Signing Issues](#android-signing-issues) |
| `signtool` | Windows | [Windows Signing Issues](#windows-signing-issues) |

---

## iOS Signing Issues

### Error: "No provisioning profile matching"

**Cause:** The provisioning profile doesn't include the app's bundle identifier or has expired.

**Fix:**
1. Go to Apple Developer Portal
2. Check the provisioning profile includes the correct Bundle ID
3. Verify the profile hasn't expired
4. Download fresh profile and update in build config

```bash
# Check profile details
security cms -D -i /path/to/profile.mobileprovision
```

### Error: "Code signing identity not found"

**Cause:** The signing certificate isn't installed on the build agent or has expired.

**Fix:**
1. Check certificate expiry in Keychain Access
2. If expired, generate new certificate in Apple Developer Portal
3. Install new certificate on build agents:
```bash
security import cert.p12 -k ~/Library/Keychains/login.keychain -P "password" -T /usr/bin/codesign
```

### Error: "TeamCity agent can't access keychain"

**Cause:** Keychain is locked or agent doesn't have permission.

**Fix:**
```bash
# Unlock keychain (add to build step)
security unlock-keychain -p "$KEYCHAIN_PASSWORD" ~/Library/Keychains/login.keychain

# Set keychain search list
security list-keychains -s ~/Library/Keychains/login.keychain
```

### Certificate Rotation Procedure

1. Generate new certificate in Apple Developer Portal
2. Download the `.cer` file
3. Import to Keychain Access on build agent
4. Export as `.p12` with password
5. Update password in TeamCity secure parameters
6. Test with a manual build
7. Remove old certificate after confirming new one works

---

## Android Signing Issues

### Error: "Keystore was tampered with, or password was incorrect"

**Cause:** Wrong keystore password or corrupted keystore file.

**Fix:**
1. Verify the password in TeamCity parameters
2. Check the keystore file isn't corrupted:
```bash
keytool -list -v -keystore game.keystore
```
3. If corrupted, restore from backup (NEVER regenerate - you'll lose Play Store access)

### Error: "No key with alias found"

**Cause:** The key alias in build config doesn't match the keystore.

**Fix:**
```bash
# List aliases in keystore
keytool -list -keystore game.keystore

# Update build config with correct alias
```

### Error: "Cannot sign AAB, keystore not found"

**Cause:** Keystore path is wrong or file doesn't exist on agent.

**Fix:**
1. Check keystore path in build configuration
2. Verify file exists on agent at that path
3. Update path or copy keystore to correct location

### Keystore Best Practices

- **NEVER** commit keystore to version control
- Store in secure TeamCity parameters
- Keep backups in secure storage (Vault)
- Document the key alias and validity period
- Set calendar reminders for expiry

---

## Windows Signing Issues

### Error: "SignTool Error: No certificates were found"

**Cause:** Code signing certificate not installed or expired.

**Fix:**
1. Check certificate in Windows Certificate Manager
2. Verify certificate has private key
3. Install certificate if missing:
```powershell
Import-PfxCertificate -FilePath cert.pfx -CertStoreLocation Cert:\LocalMachine\My -Password (ConvertTo-SecureString -String "password" -AsPlainText -Force)
```

### Error: "SignTool Error: This file format cannot be signed"

**Cause:** Trying to sign an already-signed or unsupported file.

**Fix:**
1. Remove existing signature first:
```powershell
signtool remove /s MyGame.exe
```
2. Re-sign the file

### EV Certificate Issues

For Extended Validation certificates (hardware token required):

1. Ensure SafeNet/token driver is installed on agent
2. Token must be physically connected to the agent
3. PIN must be configured for unattended signing:
```powershell
# Set token PIN (one-time setup)
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /sha1 <thumbprint> MyGame.exe
```

---

## Prevention

### Certificate Expiry Monitoring

Add a TeamCity build that checks certificate expiry weekly:

```python
# check_certs.py
import subprocess
from datetime import datetime, timedelta

# iOS
result = subprocess.run(['security', 'find-certificate', '-c', 'iPhone Distribution', '-p'], capture_output=True)
# Parse and check expiry...

# Alert if expiring within 30 days
if expiry_date < datetime.now() + timedelta(days=30):
    print(f"##teamcity[buildProblem description='Certificate expires in {days} days']")
```

### Secure Credential Storage

All signing credentials should be in TeamCity secure parameters:

```kotlin
params {
    password("secure.ios.keychain.password", "credentialsJSON:ios-keychain")
    password("secure.android.keystore.password", "credentialsJSON:android-keystore")
    password("secure.windows.cert.password", "credentialsJSON:windows-cert")
}
```

---

## Escalation

If these steps don't resolve the issue:

1. **Collect:**
   - Full build log
   - Platform and certificate type
   - When it last worked

2. **Contact:**
   - Build team: build-support@team17.com
   - Security team (for certificate issues): security@team17.com

3. **Emergency:**
   - If release is blocked, escalate to build team lead
   - See [Escalation Path](./escalation-path.md)
