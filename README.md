# @joaocarreira/next-content-toolkit

Reusable Next.js components and utilities for content-driven websites. Built to accelerate the development of new content sites by providing battle-tested modules for common functionality.

## 📦 Installation

**Currently Private:** Install directly from GitHub

```bash
npm install git+https://github.com/joaocarreira/next-content-toolkit.git
```

See [INSTALL.md](INSTALL.md) for more installation options and troubleshooting.

### Peer Dependencies

```bash
npm install next@^14 react@^18 react-dom@^18
```

### Optional Dependencies (install based on modules you need)

```bash
# For database module
npm install mongodb

# For forms module
npm install resend

# For content module
npm install contentlayer2 next-contentlayer2 reading-time

# For date utilities
npm install date-fns

# For UI icons
npm install lucide-react
```

## 🚀 Modules

### Utils Module

Common utilities for Tailwind CSS class merging, smooth scrolling, and date formatting.

```typescript
import { cn, handleSmoothScroll, scrollToTop, formatDate } from '@joaocarreira/next-content-toolkit/utils';

// Merge Tailwind classes
const classes = cn('text-lg', 'font-bold', { 'text-red-500': isError });

// Smooth scroll to element
<a href="#section" onClick={(e) => handleSmoothScroll(e, 'section')}>
  Go to section
</a>

// Scroll to top
<button onClick={scrollToTop}>Back to top</button>

// Format dates
const formatted = formatDate(new Date()); // "November 7, 2025"
```

### Database Module

MongoDB connection pooling and newsletter subscription management.

```typescript
import { connectToDatabase, createNewsletterService } from '@joaocarreira/next-content-toolkit/database';

// Connect to MongoDB
const { db, client } = await connectToDatabase({
  uri: process.env.MONGODB_URI,
  dbName: 'myapp'
});

// Newsletter service
const newsletter = createNewsletterService({ collectionName: 'subscribers' });

await newsletter.subscribe('user@example.com', {
  userAgent: req.headers['user-agent'],
  ip: req.headers['x-forwarded-for']
});

await newsletter.unsubscribe('user@example.com');
const count = await newsletter.getSubscriberCount();
```

### Analytics Module

Simple Analytics tracking hooks and components.

```typescript
import { useAnalytics, PageTracker, ArticleTracker } from '@joaocarreira/next-content-toolkit/analytics';

// Track custom events
function MyComponent() {
  const { track } = useAnalytics();

  return (
    <button onClick={() => track('button_click', { label: 'CTA' })}>
      Click me
    </button>
  );
}

// Auto-track page views
<PageTracker page="homepage" />

// Auto-track article views
<ArticleTracker
  slug="my-article"
  title="My Article Title"
  published={true}
/>
```

### Content Module

MDX components, social media embeds, and content utilities.

```typescript
import Mdx, { XEmbed, YouTubeEmbed } from '@joaocarreira/next-content-toolkit/content';

// Render MDX content
<Mdx code={post.body.code} />

// Embed X (Twitter) posts
<XEmbed
  id="1234567890"
  theme="dark"
  conversation="none"
/>

// Embed YouTube videos
<YouTubeEmbed
  videoId="dQw4w9WgXcQ"
  title="My Video"
  startTime={42}
/>
```

## 🎨 Styling

This package uses Tailwind CSS classes and expects Tailwind to be configured in your project. The styling can be customized by overriding the Tailwind classes or by providing custom component mappings.

## 📝 Environment Variables

```env
# Database module
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=myapp

# Forms module (coming soon)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=hello@myapp.com

# Analytics (add to your layout)
# Simple Analytics script: https://simpleanalytics.com
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run lint
```

## 📚 Examples

Check out the example projects:
- [i3atlas.com](https://github.com/your-username/i3atlas) - The original project this toolkit was extracted from

## 🤝 Contributing

This is currently a personal toolkit, but suggestions and improvements are welcome!

## 📄 License

MIT © João Carreira

---

## 🗺️ Roadmap

- [x] Utils module
- [x] Database module
- [x] Analytics module
- [x] Content module (MDX + embeds)
- [ ] Forms module (newsletter + contact forms)
- [ ] UI module (countdown timer + ShadcnUI components)
- [ ] Ads module (AdSense integration)
- [ ] Full documentation site
- [ ] Example templates

## 💡 Use Cases

Perfect for:
- Content-driven websites
- Blogs and news sites
- Documentation sites
- Marketing landing pages
- Portfolio sites with articles

---

Built with ❤️ to accelerate indie hacker projects
