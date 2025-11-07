# GitHub Repository Setup

## Quick Setup

After creating the repository on GitHub:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/next-content-toolkit.git

# Push to GitHub
git push -u origin main
```

## Recommended Repository Settings

### Repository Description
```
Reusable Next.js components and utilities for content-driven websites - MongoDB, Analytics, MDX, Forms, and more
```

### Topics (Tags)
```
nextjs, react, typescript, mongodb, mdx, newsletter, analytics, components, toolkit, reusable
```

### About Section
- ✅ Website: (optional - add docs site later)
- ✅ Topics: Add the tags above
- ✅ Include in the home page: Yes
- ✅ Releases: Yes
- ✅ Packages: Yes

### Repository Settings

1. **Branch Protection** (optional, but recommended):
   - Protect `main` branch
   - Require pull request reviews before merging
   - Require status checks to pass

2. **GitHub Actions** (future):
   - CI/CD for automated testing
   - Automated npm publishing
   - Automated changelog generation

3. **README Badges** (add to README.md):
```markdown
[![npm version](https://badge.fury.io/js/@joaocarreira%2Fnext-content-toolkit.svg)](https://badge.fury.io/js/@joaocarreira%2Fnext-content-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
```

## Publishing to npm

### First Time Setup
```bash
# Login to npm
npm login

# Publish the package
npm publish --access public
```

### Future Updates
```bash
# Update version
npm version patch  # or minor, or major

# Build and publish
npm run build
npm publish
```

## Release Workflow

1. Make changes in feature branches
2. Update CHANGELOG.md
3. Bump version in package.json (or use `npm version`)
4. Commit changes
5. Create GitHub release with tag
6. Publish to npm

## License

MIT - See LICENSE file (create one if needed)

## Contributing

Currently a personal toolkit, but open to suggestions and improvements!
