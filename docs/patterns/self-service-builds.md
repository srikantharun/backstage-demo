# Pattern: Self-Service Builds

> Enabling teams to manage their own build pipelines

## Overview

The self-service model shifts build ownership from a central team to individual project teams, while maintaining consistency through templates and guardrails.

```
┌─────────────────────────────────────────────────────────────────┐
│                   CENTRALISED MODEL (Before)                     │
│                                                                  │
│  Project Team ──request──► Build Team ──configure──► TeamCity   │
│                                                                  │
│  Bottleneck: Build team handles all requests                    │
│  Lead time: Days to weeks                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   SELF-SERVICE MODEL (After)                     │
│                                                                  │
│  Project Team ──use template──► Backstage ──auto-create──►      │
│                                              TeamCity            │
│                                                                  │
│  Build Team: Maintains templates, not individual projects       │
│  Lead time: Minutes                                             │
└─────────────────────────────────────────────────────────────────┘
```

## How It Works

### 1. Templates Define the Standard

Build engineers create and maintain templates:

```yaml
# scaffolder/templates/unreal-game-project/template.yaml
parameters:
  - title: Project Details
    properties:
      projectName: { type: string }
      engineVersion: { enum: ['4.27', '5.3', '5.4'] }
      targetPlatforms: { type: array }

steps:
  - id: fetch-base
    action: fetch:template
    input:
      url: ./skeleton
      values:
        projectName: ${{ parameters.projectName }}
```

### 2. Developers Self-Serve

Developers create new projects without build team involvement:

1. Open Backstage → Create
2. Select "Unreal Game Project"
3. Fill in parameters
4. Click "Create"
5. Project is ready with full CI/CD

### 3. Guardrails Prevent Mistakes

Templates include validation:

```yaml
validation:
  custom: |
    if (values.targetPlatforms.includes('iOS') &&
        !values.team.includes('ios-licensed')) {
      errors.push('iOS builds require iOS developer license');
    }
```

### 4. Build Team Maintains Templates

Instead of configuring individual projects, build engineers:

- Update templates when best practices change
- Add new platform support to templates
- Fix issues in templates (fixes all future projects)
- Monitor template usage and feedback

## Benefits

| Stakeholder | Benefit |
|-------------|---------|
| **Project Teams** | Faster setup, no waiting for build team |
| **Build Team** | Focus on tooling, not repetitive config |
| **Organization** | Consistency across all projects |
| **External Partners** | Same process, isolated access |

## Implementation Steps

### Phase 1: Audit Current State
- Document existing build configurations
- Identify common patterns
- Note project-specific customizations

### Phase 2: Create Base Templates
- Start with most common project type (e.g., Unreal PC/Console)
- Extract common configurations into template
- Test with a pilot project

### Phase 3: Enable Self-Service
- Deploy Backstage with templates
- Document the process
- Train teams on usage

### Phase 4: Iterate
- Gather feedback
- Add more templates
- Refine guardrails

## Template Structure

```
scaffolder/templates/
├── unreal-game-project/
│   ├── template.yaml          # Parameter definitions
│   └── skeleton/
│       ├── catalog-info.yaml  # Backstage registration
│       ├── .teamcity/
│       │   └── settings.kts   # TeamCity Kotlin DSL
│       └── Build/
│           └── Graph/*.xml    # BuildGraph definitions
│
├── unity-mobile-project/
│   └── ...
│
└── back-catalogue-port/
    └── ...
```

## Common Patterns

### Parameterised Platform Selection

```yaml
properties:
  targetPlatforms:
    type: array
    items:
      enum: [Win64, Android, iOS, PS5, Xbox, Switch]
    minItems: 1
```

Generates platform-specific build configurations dynamically.

### Conditional SDK Requirements

```yaml
steps:
  - id: validate-console
    if: ${{ parameters.targetPlatforms.includes('PS5') }}
    action: catalog:check
    input:
      entityRef: resource:ps5-sdk-license
```

### Version Pinning

```yaml
properties:
  engineVersion:
    enum: ['4.27', '5.3', '5.4']
    default: '5.4'
```

Ensures consistency and prevents untested version combinations.

## Metrics to Track

| Metric | Target | Why |
|--------|--------|-----|
| Time to first build | < 1 hour | Measure onboarding speed |
| Template usage rate | > 90% | Adoption of standards |
| Build failures from config | < 5% | Template quality |
| Build team tickets | ↓ 50% | Reduced support burden |

## FAQ

**Q: What if a project needs something not in the template?**
A: Start with the template, then request a custom extension. Build team reviews and may add to template if broadly useful.

**Q: Can teams modify their generated config?**
A: Yes, but changes should be proposed back to the template. Drift is tracked and flagged.

**Q: How do we handle legacy projects?**
A: Migrate incrementally. Import existing config, align with template patterns over time.

**Q: What about external partners?**
A: Same templates, but with:
- Isolated Perforce depots
- Restricted TeamCity permissions
- No access to other projects
