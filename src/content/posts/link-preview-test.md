---
title: "Link Preview Test - Various Content Types"
date: 2025-01-28
excerpt: "Testing different types of links and embeds to ensure proper previews and functionality across various platforms."
tags: ["testing", "links", "embeds", "meta"]
draft: false
source: "Manual Test"
discovery_context: "Testing link preview functionality"
post_type: "discovery"
author: "Test User"
---

# Link Preview Test

This is a test post to check how different types of links are handled and displayed. Let's see what works and what needs improvement.

## Article Links

Here are some interesting articles from different platforms:

**Substack Article - Inline Link:**
Check out this piece: [Against Truth - Sam Kriss](https://samkriss.substack.com/p/against-truth) (inline, no preview)

**Manual Rich Preview (using HTML):**

<div class="link-preview">
  <a href="https://samkriss.substack.com/p/against-truth" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    <div class="link-preview-content">
      <div class="link-preview-header">
        <img src="https://substack.com/favicon.ico" alt="" class="link-preview-favicon" />
        <span class="link-preview-domain">Substack</span>
      </div>
      <h3 class="link-preview-title">Against Truth</h3>
      <p class="link-preview-description">A philosophical exploration of truth in the modern world, questioning our fundamental assumptions about reality and knowledge.</p>
      <div class="link-preview-meta">
        <span class="link-preview-author">By Sam Kriss</span>
      </div>
    </div>
  </a>
</div>

**The Economist Preview:**

<div class="link-preview">
  <a href="https://www.economist.com/europe/2025/07/24/cigarettes-booze-and-petrol-bankroll-europes-welfare-empire" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    <div class="link-preview-content">
      <div class="link-preview-header">
        <img src="https://www.economist.com/favicon.ico" alt="" class="link-preview-favicon" />
        <span class="link-preview-domain">The Economist</span>
      </div>
      <h3 class="link-preview-title">Cigarettes, booze and petrol bankroll Europe's welfare empire</h3>
      <p class="link-preview-description">An analysis of how sin taxes fund European social programs and the implications for public policy.</p>
    </div>
  </a>
</div>

**GitHub Repository Preview:**

<div class="link-preview">
  <a href="https://github.com/withastro/astro" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    <div class="link-preview-content">
      <div class="link-preview-header">
        <img src="https://github.com/favicon.ico" alt="" class="link-preview-favicon" />
        <span class="link-preview-domain">GitHub</span>
      </div>
      <h3 class="link-preview-title">Astro Web Framework</h3>
      <p class="link-preview-description">Build fast websites with less client-side JavaScript. The modern web framework for content-focused websites.</p>
    </div>
  </a>
</div>

## Social Media Links

**Twitter/X Post:**
[Interesting thread about web development](https://twitter.com/dan_abramov/status/1234567890)

**LinkedIn Article:**
[The Future of Remote Work](https://www.linkedin.com/pulse/future-remote-work-example-author/)

## Technical Content

**GitHub Repository:**
[Astro Web Framework](https://github.com/withastro/astro)

**Stack Overflow Question:**
[How to implement responsive design](https://stackoverflow.com/questions/12345678/responsive-design-implementation)

**Dev.to Article:**
[Understanding React Hooks](https://dev.to/author/understanding-react-hooks-abc123)

## Media and Creative

**YouTube Video:**
[Web Development Tutorial](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

**Vimeo:**
[Creative Short Film](https://vimeo.com/123456789)

**CodePen:**
[CSS Animation Demo](https://codepen.io/username/pen/example123)

## News and Publications

**BBC News:**
[Latest Technology News](https://www.bbc.com/news/technology-12345678)

**TechCrunch:**
[Startup Funding News](https://techcrunch.com/2025/01/28/startup-funding-round/)

**Medium Article:**
[Design Principles for Modern Web](https://medium.com/@author/design-principles-modern-web-123abc)

## Academic and Research

**ArXiv Paper:**
[Machine Learning Research](https://arxiv.org/abs/2301.12345)

**Wikipedia:**
[Web Development](https://en.wikipedia.org/wiki/Web_development)

## Expected Behavior

Each link should ideally show:
- **Title** extracted from meta tags
- **Description/excerpt** from meta description
- **Author** when available
- **Publication date** when available
- **Favicon** or site logo
- **Thumbnail image** when available

Links that should embed directly:
- YouTube videos (iframe embed)
- Twitter posts (Twitter embed API)
- CodePen (iframe embed)
- GitHub Gists (script embed)

## Current Status

Let's see which of these render properly and which need additional development work.