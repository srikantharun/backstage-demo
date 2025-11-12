# Backstage Platform

An Internal Developer Portal built with [Backstage](https://backstage.io) for managing services, APIs, and developer tooling.

## Features

- **Software Catalog**: Centralized service discovery and metadata management
- **CI/CD Integration**: GitHub Actions pipeline visibility
- **TechDocs**: Documentation as code
- **Component Relationships**: Track dependencies and ownership

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn

### Installation

```bash
yarn install
```

### Configuration

1. Create a GitHub Personal Access Token:
   - Visit: https://github.com/settings/tokens
   - Scopes: `repo`, `workflow`, `read:org`, `read:user`, `user:email`

2. Set environment variable:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

### Running

```bash
yarn start
```

Open http://localhost:3000

## Project Structure

```
backstage-demo/
├── app-config.yaml          # Main configuration
├── packages/
│   ├── app/                 # React frontend
│   └── backend/             # Node.js backend
├── plugins/                 # Custom plugins
└── package.json
```

## Adding Components

Add a `catalog-info.yaml` file to your repository:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  description: My awesome service
  annotations:
    github.com/project-slug: org/repo
spec:
  type: service
  lifecycle: production
  owner: team-name
```

Then register it in `app-config.yaml`:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/org/repo/blob/main/catalog-info.yaml
```

## Documentation

- [Backstage Documentation](https://backstage.io/docs)
- [Getting Started Guide](https://backstage.io/docs/getting-started/)
- [Plugin Development](https://backstage.io/docs/plugins/)

## License

Apache 2.0
