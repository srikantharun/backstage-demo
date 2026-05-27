# Candy Crush Mobile - Build Documentation

> Auto-generated documentation for the Candy Crush Mobile build pipeline

## Overview

| Property | Value |
|----------|-------|
| **Engine** | Unity 6 (6000.0) |
| **Scripting Backend** | IL2CPP |
| **Platforms** | iOS, Android, Win64 |
| **Build System** | TeamCity |
| **VCS** | Perforce |

## Build Pipeline

```
Compile → Cook (Android, iOS) → Tests → Quality Gate → Package → Store Upload
```

### Build Configurations

| Configuration | Trigger | Duration | Artifacts |
|---------------|---------|----------|-----------|
| **Full Build** | VCS change | ~50 min | All platforms |
| **Android Only** | Manual | ~25 min | APK, AAB |
| **iOS Only** | Manual | ~30 min | IPA |
| **Nightly** | Scheduled (2 AM) | ~60 min | All + reports |

## For Artists

### Syncing a Build

1. Open the Artist Dashboard in Backstage
2. Find "Candy Crush Mobile"
3. Check the Ready badge is green ✅
4. Click "Sync This Build"

### What You Get

- Pre-compiled Unity editor
- All assets (textures, audio, prefabs)
- Latest code changes

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "No Ready badge" | Build is running or failed. Wait or check #build-support |
| "Sync failed" | Check Perforce credentials |
| "Missing assets" | Run full sync, not incremental |

## For Developers

### Local Development

```bash
# Clone from Perforce
p4 sync //Game/CandyCrush/Main/...

# Open in Unity Hub
# Select Unity 6000.0.0f1

# Build locally
Unity.exe -batchmode -executeMethod BuildScript.BuildAndroid
```

### Assembly Definitions

The project uses `.asmdef` files for incremental compilation:

| Assembly | Contents |
|----------|----------|
| `CandyCrush.Runtime` | Core gameplay |
| `CandyCrush.UI` | User interface |
| `CandyCrush.Audio` | Sound system |
| `CandyCrush.Analytics` | Telemetry |
| `CandyCrush.Editor` | Editor tools |
| `CandyCrush.Tests` | Unit tests |

### IL2CPP Notes

- All managed code is transpiled to C++
- Reflection-heavy code needs `link.xml` entries
- Build time: ~15 min for Android, ~20 min for iOS

## Build Parameters

### Android

| Parameter | Value |
|-----------|-------|
| Min SDK | 24 (Android 7.0) |
| Target SDK | 34 (Android 14) |
| Architecture | arm64-v8a |
| Scripting Backend | IL2CPP |
| App Bundle | Yes (AAB) |

### iOS

| Parameter | Value |
|-----------|-------|
| Min iOS | 14.0 |
| Architecture | arm64 |
| Bitcode | Disabled |
| Scripting Backend | IL2CPP |

## Release Process

1. **Code Freeze** - 2 weeks before release
2. **RC Build** - Create Release Candidate
3. **QA Sign-off** - Full regression testing
4. **Store Submission** - Via fastlane
5. **Rollout** - Staged (1% → 10% → 50% → 100%)

## Contacts

| Role | Contact |
|------|---------|
| Producer | alice@team17.com |
| Tech Lead | bob@team17.com |
| Build Support | #build-support |
