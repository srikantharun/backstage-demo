# Backstage Demo Setup Guide

## What We're Building

A local Backstage instance that:
- Integrates with your GitHub repos (java-typescript-bazel)
- Shows GitHub Actions CI/CD status
- Demonstrates Internal Developer Portal concepts for DWP interview

---

## Step 1: Check Prerequisites

```bash
# Check Node.js version (need 18+)
node --version

# Check if yarn is installed
yarn --version

# If yarn not installed:
npm install -g yarn
```

---

## Step 2: Create Backstage App

```bash
cd ~/backstage-demo

# Create Backstage app using npx
# This will create files directly in current directory
npx @backstage/create-app@latest --skip-install

# You'll be prompted for:
# - App name: backstage-demo
# - Database: SQLite (choose this for local development)
```

**Alternative if the above doesn't work:**

```bash
# Create in a subdirectory then move files
npx @backstage/create-app@latest

# When prompted:
# App name: backstage-app
# Database: SQLite

# Then move files to root
mv backstage-app/* .
mv backstage-app/.* . 2>/dev/null || true
rmdir backstage-app
```

---

## Step 3: Install Dependencies

```bash
cd ~/backstage-demo

# Install all dependencies (takes 5-10 minutes)
yarn install
```

---

## Step 4: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `Backstage Demo`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
   - ✅ `read:user` (Read user profile data)
   - ✅ `user:email` (Access user email addresses)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_`)

---

## Step 5: Configure Backstage

Edit `app-config.yaml`:

```yaml
app:
  title: Backstage Demo - DWP
  baseUrl: http://localhost:3000

organization:
  name: DWP Interview Demo

backend:
  baseUrl: http://localhost:7007
  listen:
    port: 7007
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: http://localhost:3000
    methods: [GET, HEAD, PATCH, POST, PUT, DELETE]
    credentials: true
  database:
    client: better-sqlite3
    connection: ':memory:'

integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

catalog:
  import:
    entityFilename: catalog-info.yaml
    pullRequestBranchName: backstage-integration
  rules:
    - allow: [Component, System, API, Resource, Location, User, Group]

  locations:
    # Backstage example components
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all.yaml

    # Your java-typescript-bazel repo
    - type: url
      target: https://github.com/srikantharun/java-typescript-bazel/blob/main/catalog-info.yaml
      rules:
        - allow: [Component, API, Location]
```

---

## Step 6: Start Backstage

```bash
cd ~/backstage-demo

# Export GitHub token
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE

# Start Backstage (both frontend and backend)
yarn dev
```

**Expected output:**
```
[0] webpack compiled successfully
[1] backstage backend has started on port 7007
```

**Open in browser:**
- Frontend: http://localhost:3000
- Backend health: http://localhost:7007/healthcheck

---

## Step 7: Create catalog-info.yaml in java-typescript-bazel

```bash
cd ~/java-typescript-bazel
```

Create `catalog-info.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: java-typescript-bazel-monorepo
  description: |
    Enterprise monorepo demonstrating Bazel build system patterns for Java and TypeScript.
    Features custom Starlark rules, cross-language build orchestration, and reusable build components.
  annotations:
    github.com/project-slug: srikantharun/java-typescript-bazel
    backstage.io/techdocs-ref: dir:.
  tags:
    - bazel
    - monorepo
    - java
    - typescript
    - build-system
    - devops
    - ci-cd
  links:
    - url: https://github.com/srikantharun/java-typescript-bazel
      title: GitHub Repository
      icon: github
    - url: https://github.com/srikantharun/java-typescript-bazel/actions
      title: GitHub Actions
      icon: dashboard

spec:
  type: library
  lifecycle: production
  owner: platform-engineering
  system: build-infrastructure

  # Define what this component provides
  providesApis:
    - build-system-api

  # Define what this component depends on
  dependsOn:
    - resource:bazel-remote-cache

---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: build-system-api
  description: Bazel build system API for monorepo management
  tags:
    - bazel
    - build-api
spec:
  type: openapi
  lifecycle: production
  owner: platform-engineering
  definition: |
    openapi: 3.0.0
    info:
      title: Bazel Build System API
      version: 1.0.0
    paths:
      /build:
        get:
          summary: Trigger build
          description: Execute Bazel build command
      /test:
        get:
          summary: Run tests
          description: Execute Bazel test command

---
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: bazel-remote-cache
  description: Bazel remote cache for distributed builds
  tags:
    - cache
    - infrastructure
spec:
  type: cache
  owner: platform-engineering
  system: build-infrastructure
```

Commit and push:

```bash
git add catalog-info.yaml
git commit -m "Add Backstage catalog metadata for IDP integration"
git push origin main
```

---

## Step 8: Enable GitHub Actions Plugin

```bash
cd ~/backstage-demo

# Install GitHub Actions plugin
yarn --cwd packages/app add @backstage/plugin-github-actions
```

Edit `packages/app/src/components/catalog/EntityPage.tsx`:

Find the imports section at the top and add:

```typescript
import {
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
```

Find `const serviceEntityPage` and add a CI/CD tab:

```typescript
const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={4} xs={12}>
          <EntityLinksCard />
        </Grid>
        <Grid item md={8} xs={12}>
          <EntityHasSubcomponentsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    {/* ADD THIS CI/CD TAB */}
    <EntityLayout.Route
      path="/ci-cd"
      title="CI/CD"
      if={isGithubActionsAvailable}
    >
      <EntityGithubActionsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/api" title="API">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityProvidedApisCard />
        </Grid>
        <Grid item md={6}>
          <EntityConsumedApisCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    {/* ... rest of the routes ... */}
  </EntityLayout>
);
```

Restart Backstage:

```bash
# Stop with Ctrl+C
# Restart
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
yarn dev
```

---

## Step 9: Verify Everything Works

1. **Open Backstage**: http://localhost:3000

2. **Check Catalog**:
   - Navigate to http://localhost:3000/catalog
   - You should see your `java-typescript-bazel-monorepo` component

3. **View Component Details**:
   - Click on the component
   - See Overview, CI/CD, API tabs
   - CI/CD tab should show GitHub Actions workflows

4. **Explore Features**:
   - View component relationships
   - Check tags and filters
   - Browse APIs and Resources

---

## Troubleshooting

### Issue: "Cannot find module '@backstage/plugin-github-actions'"

```bash
cd ~/backstage-demo
yarn install
```

### Issue: Port already in use

```bash
# Kill processes on port 3000 and 7007
lsof -ti:3000 | xargs kill -9
lsof -ti:7007 | xargs kill -9
```

### Issue: GitHub token not working

```bash
# Verify token is set
echo $GITHUB_TOKEN

# Re-export in same terminal
export GITHUB_TOKEN=ghp_your_token_here

# Then start
yarn dev
```

### Issue: Can't see components in catalog

- Wait 30-60 seconds for initial catalog sync
- Check backend logs for errors
- Verify catalog-info.yaml is valid YAML
- Check GitHub token has correct permissions

---

## What You've Built

✅ Full Backstage instance running locally
✅ GitHub integration with your repos
✅ Software catalog with components, APIs, resources
✅ GitHub Actions CI/CD visibility
✅ Understanding of IDP architecture

---

## For Your Interview

**Demo talking points:**

> "I set up a local Backstage instance integrated with my GitHub repositories. Let me show you:
>
> 1. **Software Catalog** - All services are discoverable with metadata
> 2. **CI/CD Integration** - GitHub Actions status visible in the portal
> 3. **Component Relationships** - APIs, dependencies, ownership clearly defined
> 4. **catalog-info.yaml** - Metadata lives with the code
> 5. **Plugin Architecture** - I enabled the GitHub Actions plugin, and the GitLab CI plugin would follow the same pattern
>
> For DWP, this would scale to thousands of services, providing engineers a single place to discover services, view CI/CD status, access documentation, and create new projects from templates."

---

## Next Steps After Interview

If you want to build a custom GitLab CI plugin:

```bash
cd ~/backstage-demo

# Create new backend plugin
yarn new --select backend-plugin
# ID: gitlab-ci

# Create new frontend plugin
yarn new --select plugin
# ID: gitlab-ci
```

Then implement the GitLab integration following the patterns in `BACKSTAGE_PLUGIN_GUIDE.md`.

---

## Quick Commands Reference

```bash
# Start Backstage
cd ~/backstage-demo
export GITHUB_TOKEN=ghp_xxx
yarn dev

# Install new plugin
yarn --cwd packages/app add @backstage/plugin-name

# Create new plugin
yarn new

# Clean rebuild
yarn clean && yarn install

# Backend only
yarn start-backend

# Frontend only
yarn start

# View logs
# Backend: Check terminal with [1] prefix
# Frontend: Check terminal with [0] prefix
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Browser (localhost:3000)               │
│  - React Frontend                       │
│  - Software Catalog UI                  │
│  - GitHub Actions Plugin UI             │
└─────────────────────────────────────────┘
              ↓ HTTP
┌─────────────────────────────────────────┐
│  Backend (localhost:7007)               │
│  - Node.js/Express API                  │
│  - Catalog Engine                       │
│  - GitHub Integration                   │
│  - SQLite Database                      │
└─────────────────────────────────────────┘
              ↓ GitHub API
┌─────────────────────────────────────────┐
│  GitHub.com                             │
│  - srikantharun/java-typescript-bazel   │
│  - catalog-info.yaml                    │
│  - GitHub Actions workflows             │
└─────────────────────────────────────────┘
```

Good luck! 🚀
