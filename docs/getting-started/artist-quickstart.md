# Artist Quickstart: Sync a Build in 3 Clicks

> Get the latest working build without touching a compiler

## Prerequisites

Before you start, make sure you have:

- ✅ **Project Access** - Request via #production-access if you don't see your project
- ✅ **Unreal Game Sync** installed - [Download from IT Portal](https://it.team17.com/ugs)
- ✅ **Perforce Account** - Your standard network login

## The 3-Click Process

### Step 1: Find Your Project

1. Open the **Artist Dashboard** from the Backstage sidebar
2. Your assigned projects appear as cards
3. Click on your project to select it

![Project Selection](./images/artist-select-project.png)

### Step 2: Check the Status Badge

Look at the big status indicator:

| Badge | Meaning | Action |
|-------|---------|--------|
| ✅ **Ready to Sync** | Build passed all tests | You can sync! |
| ❌ **Build Failed** | Something broke | Wait for fix or contact #build-support |
| ⏳ **Building...** | Build in progress | Wait for completion |

**Pro tip:** The platform chips (Win64 ✓ | Android ✓ | iOS ✓) show per-platform status. If only one platform failed, others might still be usable.

### Step 3: Click "Sync This Build"

1. Click the green **"Sync This Build"** button
2. Confirm in the dialog that appears
3. Unreal Game Sync opens and begins syncing
4. Wait for sync to complete (progress shown in UGS)
5. Open the project in Unreal Editor

**That's it!** No compilation, no waiting for shaders, just open and work.

## What Gets Synced?

When you click "Sync This Build", you receive:

| Component | What It Is | Size |
|-----------|------------|------|
| **Editor Binaries** | Pre-compiled Unreal Editor for Win64 | ~2 GB |
| **Cooked Content** | All game assets, ready to run | 5-50 GB |
| **Source Files** | Latest code (for reference) | ~500 MB |
| **Config** | Project settings | ~10 MB |

You do **NOT** need to:
- Compile anything
- Wait for shader compilation (they're pre-cached)
- Download the full Content folder (only changed files sync)

## Troubleshooting

### "No Ready Badge"

**Cause:** The build is still running or failed at some stage.

**Solutions:**
1. Wait 30-60 minutes for the build to complete
2. Check if a specific platform failed (you might be able to use another)
3. Ask in #build-support if it's been hours

### "Sync Failed"

**Cause:** Usually Perforce connection issues.

**Solutions:**
1. Check your Perforce credentials in UGS settings
2. Verify you're connected to the VPN (if remote)
3. Try `p4 login` in command prompt to refresh your ticket

### "Missing Assets After Sync"

**Cause:** Sync didn't complete or wrong stream synced.

**Solutions:**
1. Check UGS shows 100% complete
2. Verify you synced the Main stream, not Dev
3. Run UGS "Clean Sync" option

### "Editor Crashes on Launch"

**Cause:** Incompatible Windows/driver version or corrupted sync.

**Solutions:**
1. Check Windows is up to date
2. Update GPU drivers
3. Delete `Saved/` folder and relaunch
4. Try "Clean Sync" in UGS

## Understanding the CIS Column

In Unreal Game Sync, the **CIS** (Continuous Integration Status) column shows badges:

```
CL       Author     Description              Compile  Cook  Tests  Ready
───────────────────────────────────────────────────────────────────────
45821    john       Fix player movement         ✓       ✓      ✓     ✓  ← Sync this one!
45820    jane       WIP: New texture            ✓       ✓      ✗     -  ← Tests failed
45819    bob        Add multiplayer hook        ✓       ⏳     -     -  ← Still cooking
```

**Rule of thumb:** Only sync changelists with a green **Ready** badge.

## Best Practices

### DO:
- ✅ Sync at the start of your work session
- ✅ Check the Ready badge before syncing
- ✅ Use the Artist Dashboard instead of manual P4V
- ✅ Report persistent issues to #build-support

### DON'T:
- ❌ Sync to random changelists without Ready badge
- ❌ Try to compile locally (you don't need to!)
- ❌ Delete the `Binaries/` folder
- ❌ Modify source code files (unless you're also an engineer)

## Getting Help

| Issue | Contact |
|-------|---------|
| Can't see my project | #production-access |
| Build issues | #build-support |
| UGS installation | IT Help Desk |
| Perforce account | IT Help Desk |

## FAQ

**Q: How often do builds run?**
A: Every time an engineer submits code. Usually 5-10 builds per day per project.

**Q: Can I sync to an older build?**
A: Yes, UGS shows history. But only sync to CLs with Ready badges.

**Q: What if I need a build urgently?**
A: Post in #build-support with your project name. We can prioritize.

**Q: Do I need Visual Studio?**
A: No! That's the whole point of UGS. Pre-compiled binaries mean you never compile.
