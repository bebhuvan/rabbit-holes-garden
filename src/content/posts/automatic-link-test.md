---
title: "Testing Automatic Link Previews"
date: 2025-01-28
excerpt: "Testing the new automatic link preview system that converts standalone URLs into rich preview cards."
tags: ["testing", "automation", "links"]
draft: false
source: "Test"
discovery_context: "Testing automatic link preview functionality"
post_type: "discovery"
author: "Test User"
---

# Automatic Link Preview Test

This post tests the new automatic link preview system. When you put a URL on its own line, it should automatically become a rich preview card.

## Regular Inline Links

Here's a regular inline link: [GitHub](https://github.com) that stays as normal text.

## Automatic Preview Links

The following URLs should automatically become rich preview cards:

https://github.com/withastro/astro

https://samkriss.substack.com/p/against-truth

https://www.economist.com/europe/2025/07/24/cigarettes-booze-and-petrol-bankroll-europes-welfare-empire

https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags

## Mixed Content

You can still use regular text and inline links like [this one](https://example.com) mixed with automatic previews.

https://dev.to/t/webdev

More text continues normally after the preview.

## Multiple Links

Here are several links that should each get their own preview:

https://medium.com/@username/example-article

https://techcrunch.com/2025/01/28/example-startup-news

Each should render as a separate preview card with fetched metadata including titles, descriptions, favicons, and images where available.

## What Should Happen

- **Inline links**: Stay as regular clickable text
- **Standalone URLs**: Automatically become rich preview cards
- **Metadata fetching**: Happens at build time (no performance impact)
- **Fallbacks**: If fetching fails, shows basic preview with domain info
- **Mobile friendly**: Cards adapt to smaller screens