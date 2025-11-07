# Installation Guide

## Installing from Private GitHub Repository

Since this package is currently private, install it directly from GitHub:

### Method 1: Direct Install (Recommended)

```bash
npm install git+https://github.com/joaocarreira/next-content-toolkit.git
```

### Method 2: Add to package.json

Add this to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@joaocarreira/next-content-toolkit": "git+https://github.com/joaocarreira/next-content-toolkit.git"
  }
}
```

Then run:
```bash
npm install
```

### Method 3: Install Specific Version/Branch

```bash
# Install from specific branch
npm install git+https://github.com/joaocarreira/next-content-toolkit.git#main

# Install specific commit
npm install git+https://github.com/joaocarreira/next-content-toolkit.git#commit-hash

# Install specific tag/version
npm install git+https://github.com/joaocarreira/next-content-toolkit.git#v0.1.0
```

### SSH Installation (If you prefer SSH)

```bash
npm install git+ssh://git@github.com/joaocarreira/next-content-toolkit.git
```

## Authentication

If the repository is private, you'll need:
- GitHub account with access to the repository
- GitHub authentication set up (SSH keys or token)

## Updating the Package

```bash
# Update to latest version
npm update @joaocarreira/next-content-toolkit

# Or reinstall
npm install git+https://github.com/joaocarreira/next-content-toolkit.git
```

## Verifying Installation

```bash
# Check installed version
npm list @joaocarreira/next-content-toolkit
```

## Usage After Installation

```typescript
// Import from the package
import { cn } from '@joaocarreira/next-content-toolkit/utils';
import { connectToDatabase } from '@joaocarreira/next-content-toolkit/database';
import { useAnalytics } from '@joaocarreira/next-content-toolkit/analytics';
```

## Troubleshooting

### "Repository not found" Error
- Ensure you have access to the private repository
- Check your GitHub authentication (SSH keys or personal access token)
- Try using SSH method if HTTPS doesn't work

### "Permission denied" Error
- Set up GitHub SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Or use a personal access token with appropriate permissions

### Build Errors
- Make sure peer dependencies are installed:
  ```bash
  npm install next@^14 react@^18 react-dom@^18
  ```

## When Published to npm (Future)

Once this package is published publicly to npm, you can install it normally:

```bash
npm install @joaocarreira/next-content-toolkit
```

And imports work the same way!
