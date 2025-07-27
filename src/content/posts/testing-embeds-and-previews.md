---
title: "Testing Embeds and Link Previews"
date: 2024-01-27
excerpt: "A comprehensive test of all embed types and link preview functionality - YouTube videos, Twitter posts, CodePen demos, GitHub Gists, and beautiful link cards."
tags: ["test", "embeds", "development", "demo"]
post_type: "discovery"
author: "Claude"
draft: false
---

<p class="no-drop-cap">This post demonstrates all the embed types and link preview functionality available on Rabbit Holes. Each section shows different ways content can be embedded and how links appear.</p>

## YouTube Videos

Here's a classic YouTube video embed:

<div class="embed-container youtube-embed">
  <iframe 
    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
    title="Rick Astley - Never Gonna Give You Up"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>

## Twitter Posts

Embedding tweets brings social context directly into posts:

<div class="embed-container twitter-embed">
  <blockquote class="twitter-tweet" data-theme="light">
    <a href="https://twitter.com/jack/status/20">just setting up my twttr</a>
  </blockquote>
</div>

## CodePen Demos

Interactive code examples come alive with CodePen embeds:

<div class="embed-container codepen-embed">
  <iframe 
    src="https://codepen.io/chriscoyier/pen/gfdDu/embed/" 
    title="CSS Animation Example"
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>

## GitHub Gists

Code snippets and configurations are perfect for Gist embeds:

<div class="embed-container gist-embed">
  <script src="https://gist.github.com/paulirish/1343518.js"></script>
</div>

## Link Previews

Regular links get beautiful preview cards:

<div class="link-preview">
  <a href="https://github.com/microsoft/vscode" target="_blank" rel="noopener noreferrer">
    <div class="preview-card">
      <div class="preview-content">
        <h3>Visual Studio Code</h3>
        <p>Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.</p>
        <span class="preview-url">github.com</span>
      </div>
      <div class="preview-image">
        <img src="https://repository-images.githubusercontent.com/41881900/52af8480-8146-11ea-9f7e-6d87b8d4e5d4" alt="VS Code" />
      </div>
    </div>
  </a>
</div>

<div class="link-preview">
  <a href="https://astro.build" target="_blank" rel="noopener noreferrer">
    <div class="preview-card">
      <div class="preview-content">
        <h3>Astro</h3>
        <p>Astro is a modern web framework for building fast, content-focused websites. Ship less JavaScript and get better performance.</p>
        <span class="preview-url">astro.build</span>
      </div>
      <div class="preview-image">
        <img src="https://astro.build/og/social.png" alt="Astro" />
      </div>
    </div>
  </a>
</div>

## Enhanced Typography

This post also showcases the refined typography and styling:

> "The important thing is not to stop questioning. Curiosity has its own reason for existing."
> 
> — Albert Einstein

Notice how the first letter of this paragraph gets a beautiful drop cap treatment, creating an elegant reading experience that draws you into the content.

### Code Examples

Both inline `code snippets` and code blocks work beautifully:

```javascript
function exploreRabbitHole(curiosity) {
  const discoveries = [];
  
  while (curiosity.hasMore()) {
    const discovery = curiosity.explore();
    discoveries.push(discovery);
    
    if (discovery.isInteresting()) {
      shareWithOthers(discovery);
    }
  }
  
  return discoveries;
}
```

### Lists and Structure

The content supports rich formatting:

- **YouTube embeds** for video content
- **Twitter embeds** for social context
- **CodePen embeds** for interactive demos
- **GitHub Gists** for code snippets
- **Link previews** for external references

1. Everything is responsive
2. Dark mode compatible
3. Touch-friendly on mobile
4. Optimized for readability

## Responsive Design

All embeds and previews are fully responsive, adapting beautifully to different screen sizes. The layout maintains readability and functionality across desktop, tablet, and mobile devices.

This comprehensive embed system makes Rabbit Holes a perfect platform for sharing discoveries that span multiple media types and sources.