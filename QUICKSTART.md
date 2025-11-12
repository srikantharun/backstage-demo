# Backstage Quick Start - Run This Tonight!

## ⏱️ Time Required: 30-45 minutes

---

## Step 1: Setup (10 min)

```bash
cd ~/backstage-demo
./setup.sh
```

Wait for installation to complete (5-10 minutes).

---

## Step 2: Get GitHub Token (5 min)

1. **Open**: https://github.com/settings/tokens
2. **Click**: "Generate new token (classic)"
3. **Name**: Backstage Demo
4. **Scopes**: Check these boxes:
   - ✅ repo
   - ✅ workflow
   - ✅ read:org
   - ✅ read:user
   - ✅ user:email
5. **Generate** and **copy** the token (starts with `ghp_`)

---

## Step 3: Add catalog-info.yaml to java-typescript-bazel (5 min)

```bash
cd ~/java-typescript-bazel
git add catalog-info.yaml
git commit -m "Add Backstage catalog metadata for IDP integration"
git push origin main
```

---

## Step 4: Start Backstage (2 min)

```bash
cd ~/backstage-demo
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
yarn dev
```

**Wait for:**
```
[0] webpack compiled successfully
[1] backstage backend has started on port 7007
```

---

## Step 5: Open Browser (1 min)

**Visit**: http://localhost:3000

You should see Backstage homepage!

---

## Step 6: View Your Catalog (5 min)

1. Click **"Catalog"** in left menu
2. Look for **"java-typescript-bazel-monorepo"**
3. Click on it
4. Explore tabs: Overview, CI/CD, API

**If you don't see it:**
- Wait 30-60 seconds (initial sync)
- Refresh the page
- Check backend logs in terminal

---

## Step 7: Enable GitHub Actions Plugin (10 min)

### Install Plugin

```bash
# In a NEW terminal (keep yarn dev running)
cd ~/backstage-demo
yarn --cwd packages/app add @backstage/plugin-github-actions
```

### Edit Entity Page

Open `packages/app/src/components/catalog/EntityPage.tsx`

**Add import at top:**
```typescript
import {
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
```

**Find `const serviceEntityPage` (around line 60) and add CI/CD route:**

```typescript
const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {/* existing overview content */}
    </EntityLayout.Route>

    {/* ADD THIS NEW ROUTE - paste right after Overview route */}
    <EntityLayout.Route
      path="/ci-cd"
      title="CI/CD"
      if={isGithubActionsAvailable}
    >
      <EntityGithubActionsContent />
    </EntityLayout.Route>

    {/* existing other routes */}
  </EntityLayout>
);
```

**Save the file.**

### Restart Backstage

In the terminal running `yarn dev`:
1. Press `Ctrl+C` to stop
2. Restart:
   ```bash
   export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
   yarn dev
   ```

### Verify

1. Go to http://localhost:3000/catalog
2. Click on **java-typescript-bazel-monorepo**
3. You should now see **CI/CD tab**!
4. Click it to see GitHub Actions workflows

---

## ✅ Success Checklist

- [ ] Backstage running at http://localhost:3000
- [ ] Can see Software Catalog
- [ ] java-typescript-bazel-monorepo appears in catalog
- [ ] CI/CD tab shows GitHub Actions
- [ ] Can navigate between Overview, CI/CD, API tabs

---

## 🎯 For Your Interview Tomorrow

**You can now say:**

> "After learning about this role, I set up a local Backstage instance last night to familiarize myself with Internal Developer Portals. I integrated it with my GitHub repositories, enabled the GitHub Actions plugin to show CI/CD status, and explored how the catalog-info.yaml metadata drives the entire portal.
>
> I can see how this architecture would extend to GitLab CI - the plugin pattern is the same: a backend service calling the GitLab API with caching, and a frontend React component displaying pipelines in the service catalog. For DWP, this would provide engineers a unified view of thousands of services, CI/CD pipelines, documentation, and APIs."

**This demonstrates:**
- 🔥 **Initiative** - Built something without being asked
- 🔥 **Fast learner** - Learned new platform in hours
- 🔥 **Technical depth** - Understand architecture
- 🔥 **Relevance** - Connected to DWP role

---

## 🐛 Quick Troubleshooting

### "Can't see my component in catalog"
- Wait 60 seconds, refresh page
- Check `catalog-info.yaml` pushed to GitHub
- Verify `app-config.yaml` has correct GitHub URL

### "Port already in use"
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:7007 | xargs kill -9
```

### "Module not found" error
```bash
cd ~/backstage-demo
yarn install
```

### "GitHub token invalid"
```bash
# Re-export in same terminal window
export GITHUB_TOKEN=ghp_your_token_here
yarn dev
```

---

## 📚 Reference Documents

- **SETUP.md** - Detailed setup guide
- **README.md** - Project overview
- **../java-typescript-bazel/BACKSTAGE_PLUGIN_GUIDE.md** - How to build GitLab plugin
- **../java-typescript-bazel/DWP_INTERVIEW_PREP.md** - Interview prep

---

## ⏭️ After Interview (Optional)

Build a custom GitLab CI plugin:

```bash
cd ~/backstage-demo

# Create backend plugin
yarn new --select backend-plugin
# ID: gitlab-ci

# Create frontend plugin
yarn new --select plugin
# ID: gitlab-ci
```

Then implement following `BACKSTAGE_PLUGIN_GUIDE.md`.

---

## 🎉 You're Ready!

You now have:
- ✅ Working Backstage instance
- ✅ GitHub integration
- ✅ CI/CD visibility
- ✅ Hands-on understanding of IDPs

**Good luck with your interview!** 🚀
