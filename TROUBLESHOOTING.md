# Backstage Troubleshooting Guide

## "TypeError: Failed to fetch" Error

This means the frontend can't connect to the backend. Here's how to fix it:

### Step 1: Check Terminal Output

Look at the terminal where you ran `yarn start`. You should see:

**Good (working):**
```
[0] webpack compiled successfully
[1] 2025-11-12T15:00:00.000Z backstage info Listening on :7007
```

**Bad (not working):**
```
[1] Error: ...
[1] TypeError: ...
[1] Failed to ...
```

### Step 2: Common Issues & Fixes

#### Issue 1: GITHUB_TOKEN not set

**Symptom:**
```
Error: Missing required config value at 'integrations.github[0].token'
```

**Fix:**
```bash
# Stop Backstage (Ctrl+C)
export GITHUB_TOKEN=$(cat ~/remember_backstage_demo_gh_token.txt)
yarn start
```

#### Issue 2: Port 7007 already in use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::7007
```

**Fix:**
```bash
# Kill process on port 7007
lsof -ti:7007 | xargs kill -9

# Restart
export GITHUB_TOKEN=$(cat ~/remember_backstage_demo_gh_token.txt)
yarn start
```

#### Issue 3: Node modules corrupted

**Symptom:**
```
Module not found
Cannot find module
```

**Fix:**
```bash
cd ~/backstage-demo
rm -rf node_modules
yarn install
export GITHUB_TOKEN=$(cat ~/remember_backstage_demo_gh_token.txt)
yarn start
```

#### Issue 4: TypeScript compilation errors

**Symptom:**
```
TypeScript error in ...
Type 'X' is not assignable to type 'Y'
```

**Fix:**
```bash
# Clean build
yarn clean
yarn install
export GITHUB_TOKEN=$(cat ~/remember_backstage_demo_gh_token.txt)
yarn start
```

### Step 3: Fresh Start

If nothing works, try a complete fresh start:

```bash
# Stop Backstage
# Press Ctrl+C in terminal

# Kill any lingering processes
lsof -ti:3000 | xargs kill -9
lsof -ti:7007 | xargs kill -9

# Clean everything
cd ~/backstage-demo
yarn clean
rm -rf node_modules
rm -rf .cache

# Reinstall
yarn install

# Start fresh
export GITHUB_TOKEN=$(cat ~/remember_backstage_demo_gh_token.txt)
yarn start
```

### Step 4: Check Health Endpoint

Once backend starts, verify it's working:

```bash
# Should return: {"status":"ok"}
curl http://localhost:7007/healthcheck
```

### Step 5: Check Frontend

Once both are running:

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Look at Console tab for errors
4. Look at Network tab to see failed requests

---

## GitHub Actions Plugin Issues

### Issue: Can't see CI/CD tab

**Check 1:** Did you add the import?

Open `packages/app/src/components/catalog/EntityPage.tsx` and verify:

```typescript
import {
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
```

**Check 2:** Did you add the route?

Look for this in `serviceEntityPage`:

```typescript
<EntityLayout.Route
  path="/ci-cd"
  title="CI/CD"
  if={isGithubActionsAvailable}
>
  <EntityGithubActionsContent />
</EntityLayout.Route>
```

**Check 3:** Is the plugin installed?

```bash
cd ~/backstage-demo
yarn --cwd packages/app add @backstage/plugin-github-actions
yarn start
```

### Issue: CI/CD tab exists but shows error

**Check:** GitHub token permissions

Your token needs these scopes:
- ✅ repo
- ✅ workflow
- ✅ read:org
- ✅ read:user
- ✅ user:email

Regenerate token at: https://github.com/settings/tokens

---

## Catalog Issues

### Issue: Can't see my component in catalog

**Wait:** First load takes 30-60 seconds

**Check 1:** Is catalog-info.yaml pushed to GitHub?

```bash
# Should show your file
curl https://raw.githubusercontent.com/srikantharun/java-typescript-bazel/main/catalog-info.yaml
```

**Check 2:** Is URL correct in app-config.yaml?

Open `app-config.yaml` and verify:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/srikantharun/java-typescript-bazel/blob/main/catalog-info.yaml
```

**Check 3:** Check backend logs

Look for:
```
Processing github:srikantharun/java-typescript-bazel
```

**Check 4:** Manually refresh catalog

In Backstage UI:
1. Go to http://localhost:3000/catalog-import
2. Click "Register Existing Component"
3. Paste: https://github.com/srikantharun/java-typescript-bazel/blob/main/catalog-info.yaml
4. Click "Analyze"

---

## Quick Diagnostic Commands

```bash
# Check if Backstage is running
ps aux | grep "yarn start"

# Check ports
lsof -i :3000 -i :7007

# Check backend health
curl http://localhost:7007/healthcheck

# Check catalog entities
curl http://localhost:7007/api/catalog/entities | jq .

# Check GitHub token
echo $GITHUB_TOKEN

# View recent logs (if running in background)
# Look at terminal output
```

---

## Nuclear Option: Complete Reset

If absolutely nothing works:

```bash
# Stop everything
lsof -ti:3000 | xargs kill -9
lsof -ti:7007 | xargs kill -9

# Delete and recreate
cd ~
rm -rf backstage-demo

# Clone fresh
cd ~/backstage-demo
# Re-run setup from scratch following QUICKSTART.md
```

---

## Get Help

If you're still stuck, check:
1. Terminal output for specific error messages
2. Browser console (F12) for frontend errors
3. Backend logs for API errors

Share the specific error message for more targeted help!

---

## For Your Interview Tomorrow

Even if Backstage doesn't fully work, you have enough knowledge to discuss it:

**What you understand:**
- ✅ Backstage architecture (frontend + backend + plugins)
- ✅ catalog-info.yaml metadata model
- ✅ Plugin pattern (GitHub Actions example)
- ✅ How GitLab CI integration would work
- ✅ Benefits for DWP (unified portal, service discovery)

**What you can say:**
> "I set up a local Backstage instance and integrated it with my GitHub repositories. While troubleshooting some configuration issues, I learned about the architecture: a React frontend consuming APIs from a Node.js backend, with plugins extending functionality. The GitLab CI plugin would follow the same pattern - backend calling GitLab API with caching, frontend displaying pipelines."

This shows initiative, technical understanding, and problem-solving skills!
