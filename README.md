# Rabbit Holes 🐇

A beautiful, AI-powered blog for curating and sharing thoughtful content from across the internet. Built with Astro, featuring elegant design and intelligent content generation.

## 🚨 CRITICAL ISSUES - READ BEFORE STARTING

**Current Status**: The blog has significant typography and readability issues that need immediate attention. Please read `ISSUES.md` for complete technical details.

### Immediate Problems:
- Individual post pages have broken typography (unreadable)
- Font inconsistency between homepage and individual posts
- CSS specificity conflicts causing style overrides
- Poor spacing and readability

### Quick Context for New Developers:
1. **Development server**: Run `npm run dev` - currently serves at `http://localhost:4324/`
2. **Test post available**: Visit `/posts/digital-minimalism` to see typography issues
3. **Main problem files**: 
   - `src/pages/posts/[slug].astro` (individual post layout - styles not working)
   - `src/components/PostCard.astro` (global styles causing conflicts)
4. **Recent failed attempts**: Multiple font and spacing fixes attempted but no visual changes occurred

## ✨ Features (Currently Implemented)

- **AI-Powered Content Generation**: Create posts from URLs, text, PDFs using OpenAI/Anthropic Claude ✅
- **Link Previews & Embeds**: YouTube, Twitter, GitHub, and general link previews ✅
- **Dark Mode**: Seamless theme switching with system preference detection ✅
- **Content Collections**: Organized blog posts with tags and metadata ✅
- **Individual Post Pages**: SEO-friendly URLs with share functionality ✅
- **Tag Pages**: Filter posts by topic at `/tags/[tag]` ✅  
- **Pagination**: Homepage shows 5 posts per page ✅
- **Search Page**: Client-side search functionality ✅
- **RSS Feed**: Built-in feed at `/rss.xml` ✅
- **Mobile Responsive**: Basic responsive design ✅
- **Admin Interface**: AI post generation interface at `/admin` ✅

### ⚠️ Known Issues:
- **Typography**: Individual posts have poor readability (CRITICAL)
- **Font Consistency**: Serif fonts showing instead of intended sans-serif
- **Spacing**: Inadequate paragraph and heading spacing

## 🚀 Quick Start

1. **Start Development Server**
   ```bash
   cd rabbit-holes
   npm install  # if needed
   npm run dev
   ```
   
   **Current Server**: `http://localhost:4324/` (ports 4321-4323 may be in use)

2. **Test Critical Issues**
   - Visit homepage: Shows post previews (working)
   - Visit individual post: `http://localhost:4324/posts/digital-minimalism` (BROKEN - typography issues)
   - Compare typography differences

3. **Environment Variables (Already Set)**
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_K15UGGwOKAmtF7mWlhoOLR_zbrESiyKWgVTb8YVG1rdO6TzgPkhDNVjdHm5kle5xknyrUEKQPVmNjX7vJxJZlw-KXlSDwAA
   ```

## 🔧 Current Architecture Status

### Working Components:
- **Homepage** (`src/pages/index.astro`): Displays paginated post cards ✅
- **Post Cards** (`src/components/PostCard.astro`): Preview cards with link previews ✅
- **Navigation**: Header, footer, tag links ✅
- **Link Previews** (`src/components/LinkPreview.astro`): YouTube, Twitter, GitHub embeds ✅

### Broken Components:
- **Individual Posts** (`src/pages/posts/[slug].astro`): Unreadable typography ❌
- **Font System**: CSS conflicts between global and scoped styles ❌

## 🎨 Project Structure

```
rabbit-holes/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── PostCard.astro
│   ├── content/             # Content collections
│   │   ├── config.ts        # Collection schemas
│   │   └── posts/           # Blog posts (markdown)
│   ├── layouts/             # Page layouts
│   │   └── BaseLayout.astro
│   ├── lib/                 # Utilities and integrations
│   │   └── ai-integration.ts # AI post generation logic
│   ├── pages/               # Routes and pages
│   │   ├── index.astro      # Homepage
│   │   ├── archive.astro    # Archive page
│   │   ├── admin.astro      # AI admin interface
│   │   └── api/             # API endpoints
│   └── config/              # Configuration files
└── public/                  # Static assets
```

## 🤖 AI Integration

The AI integration allows you to create thoughtful blog posts from various sources:

### Supported Input Types
- **URLs**: Extract and analyze web articles
- **Text**: Transform raw text into polished posts
- **PDFs**: Process document content (requires additional setup)
- **Files**: Handle various file formats

### AI Providers
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic Claude** (Claude 3 Sonnet, Haiku)

### Using the Admin Interface

1. Navigate to `/admin` on your site
2. Choose your input type (URL, Text, or File)
3. Configure AI settings (provider, model, creativity level)
4. Generate and preview your post
5. Edit if needed and save to your content directory

### API Usage

You can also use the API directly:

```javascript
const response = await fetch('/api/generate-post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputType: 'url',
    content: 'https://example.com/article',
    settings: {
      provider: 'openai',
      apiKey: 'your-api-key',
      model: 'gpt-4',
      temperature: 0.7
    }
  })
});

const result = await response.json();
```

## 📝 Creating Content

### Manual Posts
Create markdown files in `src/content/posts/`:

```markdown
---
title: "Your Post Title"
date: 2025-01-15
excerpt: "A brief description of your post"
tags: ["tag1", "tag2"]
image: "optional-image-url"
---

Your content here...
```

### AI-Generated Posts
Use the admin interface at `/admin` or the API to generate posts automatically.

## 🎛️ Configuration

### AI Settings
Edit `src/config/ai-config.ts` to customize:
- Default providers and models
- Content length limits
- Rate limiting
- Supported file types

### Site Settings
Modify `astro.config.mjs` for build and integration settings.

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🚀 Deployment

### Static Site Generation
This site generates as static files and can be deployed to:
- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Import project and deploy with zero configuration
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any static hosting service**

### Environment Variables
Make sure to set your API keys in your hosting platform's environment variables.

## 🎨 Customization

### Styling
The site uses CSS custom properties for theming. Edit the `:root` variables in `BaseLayout.astro` to customize colors.

### Fonts (CURRENTLY BROKEN)
**Intended Design**:
- **Manrope**: For ALL text (UI, headings, body content)

**Current Problem**: 
- Individual posts still showing serif fonts despite code changes
- CSS specificity issues preventing font changes from taking effect
- Global styles in PostCard.astro conflicting with individual post styles

**Files to investigate**:
- `src/layouts/BaseLayout.astro`: Loads both Manrope and Source Serif 4 fonts  
- `src/components/PostCard.astro`: Global `.post-content` styles (CONFLICT SOURCE)
- `src/pages/posts/[slug].astro`: Individual post styles (NOT WORKING)

### AI Prompts
Customize the AI system prompt in `src/lib/ai-integration.ts` to match your desired writing style.

## 📚 Tech Stack

### Core Framework & Build
- **[Astro v5.12.3](https://astro.build)**: Static Site Generator with hybrid rendering
- **[Node.js v22.17.0](https://nodejs.org)**: Runtime environment
- **[TypeScript](https://typescriptlang.org)**: Type safety and better DX
- **[Vite](https://vitejs.dev)**: Build tool and dev server (integrated with Astro)

### Content & Markdown
- **[MDX](https://mdxjs.com)**: Enhanced Markdown with React-like components
- **Astro Content Collections**: Type-safe content management
- **Frontmatter**: YAML metadata for posts (title, date, tags, excerpt)

### Styling & UI
- **Vanilla CSS**: No CSS framework, custom properties for theming
- **CSS Custom Properties**: For dark/light mode theming
- **CSS Modules**: Scoped styles via Astro's built-in system
- **Google Fonts**: Manrope (sans-serif) + Source Serif 4 (currently problematic)

### AI Integration
- **[OpenAI API](https://openai.com/api)**: GPT-4, GPT-3.5 models for content generation
- **[Anthropic Claude API](https://anthropic.com)**: Claude 3 Sonnet/Haiku models
- **Custom AI Integration**: `src/lib/ai-integration.ts` with provider abstraction

### Deployment & Hosting Architecture
- **Static Site Generation**: Pre-built HTML files
- **Hybrid Architecture**: 
  - Static site hosted on Cloudflare Pages (intended)
  - API functions on Vercel/Netlify (serverless)
- **Git-based Workflow**: Manual export of AI-generated posts

### Development Tools
- **npm**: Package manager
- **ESLint**: Code linting (if configured)
- **Astro Dev Toolbar**: Built-in debugging tools

### API & Serverless Functions
- **Vercel Functions**: Serverless API endpoints (`/api/*`)
- **Custom Endpoints**: 
  - `/api/generate-post.js` - AI content generation
  - `/api/random-post.json.ts` - Random post selection

### Content Features
- **RSS Feed**: Built-in XML feed generation
- **Link Previews**: Custom components for YouTube, Twitter, GitHub embeds
- **SEO**: Meta tags, Open Graph, Twitter Cards, canonical URLs
- **Search**: Client-side search implementation (basic)

### Browser Support
- **Modern browsers**: ES2020+ features used
- **Mobile responsive**: CSS media queries for responsive design
- **Dark mode**: CSS custom properties + JavaScript toggle

### File System Structure
```
src/
├── components/           # .astro components
│   ├── Header.astro     # Site navigation
│   ├── Footer.astro     # Site footer  
│   ├── PostCard.astro   # Homepage post previews
│   └── LinkPreview.astro # Embeds (YouTube, Twitter, etc.)
├── content/
│   ├── config.ts        # Content collection schemas
│   └── posts/           # Blog posts (.md, .mdx)
├── layouts/
│   └── BaseLayout.astro # HTML document template
├── lib/
│   ├── ai-integration.ts # AI providers abstraction
│   ├── link-preview.ts   # URL parsing utilities
│   └── markdown-processors.ts # Content processing
├── pages/
│   ├── index.astro      # Homepage with pagination
│   ├── posts/[slug].astro # Dynamic post pages
│   ├── tags/[tag].astro  # Tag filtering pages
│   ├── search.astro     # Search functionality
│   ├── about.astro      # About page
│   ├── 404.astro        # Custom error page
│   ├── rss.xml.ts       # RSS feed generation
│   └── api/             # Serverless functions
└── config/              # Configuration files
```

### Performance Considerations
- **Static Generation**: Pre-built pages for fast loading
- **Image Optimization**: Manual optimization required
- **Bundle Size**: Minimal JavaScript, mostly static HTML/CSS
- **CDN Ready**: Static assets can be served via CDN

### Known Technical Debt
- **CSS Architecture**: Global styles conflicting with scoped styles
- **Font Loading**: Both serif and sans-serif fonts loaded (inefficient)
- **TypeScript Coverage**: Some files still use implicit any types
- **Error Handling**: Limited error boundaries for AI generation
- **Testing**: No automated tests currently implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own blog!

## 🎯 Current Priorities

### IMMEDIATE (Critical Issues):
- [ ] **Fix individual post typography** - Make posts readable
- [ ] **Resolve CSS conflicts** - Fix global vs scoped style issues  
- [ ] **Font consistency** - Ensure Manrope is used throughout
- [ ] **Improve spacing** - Better paragraph and heading margins

### Completed Features:
- [x] Individual post pages with SEO-friendly URLs
- [x] Tag pages for filtering posts by topic  
- [x] Pagination for post listings (5 per page)
- [x] Link previews and embeds (YouTube, Twitter, GitHub)
- [x] Random post button functionality
- [x] Share options and copy link functionality
- [x] Search page with client-side functionality
- [x] RSS feed generation
- [x] Custom 404 error page
- [x] Dark mode support

### Future Roadmap:
- [ ] PDF content extraction enhancement
- [ ] Image generation for posts  
- [ ] Comment system
- [ ] Newsletter integration
- [ ] Analytics dashboard

## 📞 For New Developer Context

**Last Session Summary**: 
- Multiple attempts made to fix typography
- User feedback: "Nothing has changed :(" despite code modifications
- Likely CSS loading/specificity issues preventing changes from taking effect
- All core features are implemented but readability is critically poor

**Recommended First Step**: Use browser dev tools to inspect computed styles and understand why font changes aren't applying.

---

Happy blogging! 🎉