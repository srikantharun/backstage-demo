# External Partner Guide

> Build access for external development studios

## Welcome, Partner!

This guide explains how to access Team17's build infrastructure as an external development partner.

## Your Access

As an external partner, you have access to:

| Feature | Access Level |
|---------|--------------|
| View assigned projects | ✅ Full |
| Trigger builds | ✅ Full |
| View build logs | ✅ Full |
| Download artifacts | ✅ Full |
| View other projects | ❌ None |
| Modify build configs | ❌ None |
| Access source code | ⚠️ Project-specific |

## Getting Started

### 1. Account Setup

You should have received:
- Backstage portal credentials (SSO via your company email)
- Perforce account (if source access is included)
- TeamCity viewer access

**Don't have credentials?** Contact your Team17 producer.

### 2. Find Your Project

1. Log in to Backstage: https://backstage.team17.com
2. Navigate to the **Catalog**
3. Your assigned project(s) will appear
4. Click on a project to see build status

### 3. Trigger a Build

1. Open your project in the Catalog
2. Click **"View in TeamCity"** link
3. In TeamCity, click **"Run"** on the desired build configuration
4. Wait for the build to complete (typically 30-60 minutes)
5. Download artifacts from the **"Artifacts"** tab

## Build Configurations

Your project typically has these build types:

| Build Type | Use Case | Frequency |
|------------|----------|-----------|
| **Full Build** | Complete build for all platforms | On demand |
| **Platform-Specific** | Build for one platform only | Quick iteration |
| **Nightly** | Scheduled overnight builds | Automatic |
| **Release Candidate** | Pre-submission build | Before milestones |

## Downloading Builds

### From Backstage
1. Go to your project in the Catalog
2. Check the build status widget
3. Click **"Download Artifacts"** if available

### From TeamCity
1. Open your project in TeamCity
2. Click on the completed build
3. Go to **"Artifacts"** tab
4. Download the platform package you need

### Artifact Types

| File | Platform | Contents |
|------|----------|----------|
| `*-Win64.zip` | Windows | Executable + data |
| `*-Android.aab` | Android | App Bundle for Play Store |
| `*-Android.apk` | Android | Direct-install APK |
| `*-iOS.ipa` | iOS | Signed IPA for TestFlight |
| `*-PS5.pkg` | PlayStation 5 | Console package |
| `*-Xbox.xvc` | Xbox | Console package |

## Communication

### Channels

| Topic | Contact |
|-------|---------|
| Build issues | build-support@team17.com |
| Production questions | Your assigned producer |
| Technical blockers | Your Team17 tech lead |

### SLA

| Priority | Response Time | Resolution Time |
|----------|---------------|-----------------|
| **Critical** (can't work) | 2 hours | 8 hours |
| **High** (blocked but workaround) | 4 hours | 24 hours |
| **Normal** (inconvenient) | 24 hours | 72 hours |

## Best Practices

### DO:
- ✅ Trigger builds during business hours (UK time) for fastest support
- ✅ Include changelist numbers when reporting issues
- ✅ Check existing builds before triggering new ones
- ✅ Use the correct build configuration for your needs

### DON'T:
- ❌ Share credentials with others (request individual accounts)
- ❌ Trigger multiple builds simultaneously (queue gets backed up)
- ❌ Modify project settings without coordination
- ❌ Access projects not assigned to you

## Troubleshooting

### "Build Failed"

1. Check the build log for error messages
2. Common issues:
   - Missing assets (sync latest from Perforce)
   - Compilation errors (check recent code changes)
   - Signing issues (certificates may need renewal)
3. If unclear, email build-support@team17.com with:
   - Project name
   - Build number
   - Error message screenshot

### "Can't Access Project"

1. Verify you're logged in with your partner email
2. Check with your producer that access was granted
3. Contact IT if access should exist but doesn't work

### "Artifacts Not Available"

1. Build must complete successfully first
2. Check the build status is green
3. Some artifact types only publish on Release builds
4. Retention period: 30 days (older builds are cleaned up)

## Milestone Builds

For milestone deliveries:

1. **Coordinate with your producer** on timing
2. **Create a Release Candidate** build (not regular build)
3. **Wait for QA approval** before downloading
4. **Use the specific CL** approved for the milestone

## Security Reminders

- Never share build artifacts publicly
- Console builds are under NDA
- Report any security concerns immediately
- Credentials should not be stored in scripts

## FAQ

**Q: Can I trigger builds outside UK business hours?**
A: Yes, but support response will be slower.

**Q: How long are builds kept?**
A: 30 days for regular builds, 90 days for Release Candidates.

**Q: Can I get direct Perforce access?**
A: Depends on your contract. Ask your producer.

**Q: What if I need a hotfix urgently?**
A: Email build-support@team17.com with "URGENT" in subject line.
