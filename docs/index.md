# Team17 Build Engineering Portal

> Self-service CI/CD for game development teams

Welcome to the Team17 Build Engineering Portal. This portal enables:

- **Artists** to sync builds with one click
- **Developers** to scaffold new projects from templates
- **External Partners** to access build pipelines safely
- **Build Engineers** to maintain consistency across 20+ projects

## Quick Links

| I want to... | Go to... |
|--------------|----------|
| Sync a build (Artist) | [Artist Dashboard](/artist) |
| Create a new project | [Software Templates](/create) |
| Check build status | [Catalog](/catalog) |
| Read documentation | Keep reading below |

## For Artists

### Sync a Build in 3 Clicks

1. **Open the Artist Dashboard** from the sidebar
2. **Find your project** and check the status badge
3. **Click "Sync This Build"** if the badge shows ✅ Ready

**Don't see your project?** Request access via #production-access Slack channel.

**Badge not ready?** The build might still be running or failed. Contact #build-support for help.

[Read the full Artist Quickstart →](getting-started/artist-quickstart.md)

## For Developers

### Create a New Project

Use our Software Templates to scaffold a new game project with:

- Pre-configured build scripts
- TeamCity CI/CD pipeline
- Perforce stream structure
- Catalog entry for tracking

Available templates:

| Template | Use When |
|----------|----------|
| **Unreal Game Project** | Starting a new Unreal Engine game |
| **Unity Mobile Project** | Building for iOS/Android with Unity |
| **Back-Catalogue Port** | Porting a legacy game to new platforms |

[Browse Templates →](/create)

### Self-Service Builds

Developers can trigger builds directly from this portal or TeamCity. No need to wait for the build team.

**What you can do:**
- Trigger builds for your projects
- View build logs and artifacts
- Download packages for testing

**What requires build team:**
- New project setup
- Platform SDK configuration
- Release builds to stores

## For External Partners

External development partners have access to:

- **Dedicated project views** - See only your assigned projects
- **Build triggering** - Start builds without internal access
- **Artifact downloads** - Get packages for testing
- **Documentation** - Platform-specific guides

[Read the External Partner Guide →](getting-started/external-partner-guide.md)

## For Build Engineers

### Templates & Consistency

All projects should use our standard templates. This ensures:

- Consistent build configurations
- Shared caching infrastructure
- Automated badge publishing to UGS
- Predictable troubleshooting

[View Template Reference →](reference/build-parameters.md)

### Troubleshooting Runbooks

Common issues and their solutions:

- [Build Failed: Code Signing](runbooks/build-failed-signing.md)
- [Cook Time Too Long](runbooks/cook-time-too-long.md)
- [Escalation Path](runbooks/escalation-path.md)

### Infrastructure

| Component | URL |
|-----------|-----|
| TeamCity | https://teamcity.team17.com |
| Perforce | ssl:perforce.team17.com:1666 |
| UGS Metadata | http://ugs-metadata.team17.com:5000 |
| Unity Accelerator | 192.168.1.100:10080 |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BACKSTAGE PORTAL                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Artist  │  │ Developer│  │ Partner  │  │ Build    │        │
│  │Dashboard │  │ Templates│  │  View    │  │ Engineer │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TEAMCITY CI/CD                              │
│  Compile → Cook → Test → Quality Gate → Package → Publish       │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORCE HELIX CORE                           │
│  //Game/Project/Main/Source  │  //Game/Project/UGS/Editor       │
│  //Game/Project/Main/Content │  //Game/Project/UGS/Cooked       │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UGS METADATA SERVER                            │
│  Badges: Compile ✓ | Cook ✓ | Tests ✓ | Ready ✓                 │
└─────────────────────────────────────────────────────────────────┘
```

## Support

- **Slack:** #build-support
- **Email:** build-team@team17.com
- **On-call:** See [Escalation Path](runbooks/escalation-path.md)
