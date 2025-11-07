# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-11-07

### Added

#### Utils Module ✅
- `cn()` - Tailwind CSS class merger using clsx + tailwind-merge
- `handleSmoothScroll()` - Smooth scroll to target element
- `scrollToTop()` - Scroll to top of page
- `formatDate()`, `formatDateShort()`, `getRelativeTime()` - Date formatting utilities

#### Database Module ✅
- `connectToDatabase()` - MongoDB connection with pooling and health checks
- `NewsletterService` - Complete newsletter subscription management
  - `subscribe()` - Add new subscribers with metadata
  - `unsubscribe()` - Soft delete subscribers
  - `getActiveSubscribers()` - Query active subscribers
  - `getSubscriberCount()` - Get subscriber count
- TypeScript types for subscribers and config

#### Analytics Module ✅
- `useAnalytics()` - Hook for Simple Analytics event tracking
- `<PageTracker>` - Automatic page view tracking component
- `<ArticleTracker>` - Article-specific view tracking
- `<CategoryTracker>` - Category page tracking

#### Content Module ✅
- `<Mdx>` - Pre-styled MDX component renderer with:
  - Typography (h1-h3, paragraphs)
  - Lists (ul, ol, li)
  - Links with Next.js router
  - Images with Next.js Image optimization
  - Code blocks and inline code
  - Tables
  - Blockquotes
- `<XEmbed>` - Twitter/X post embeds with lazy loading
- `<YouTubeEmbed>` - YouTube video embeds with lazy loading

### Coming Soon

- Forms module (newsletter + contact forms)
- UI module (countdown timer + ShadcnUI components)
- Ads module (AdSense integration)
