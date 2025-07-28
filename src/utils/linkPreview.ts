// Build-time link preview fetching - no runtime performance impact
export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  author?: string;
  publishDate?: string;
}

// Cache for build-time metadata fetching
const metadataCache = new Map<string, LinkMetadata>();

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  // Check cache first (build-time only)
  if (metadataCache.has(url)) {
    return metadataCache.get(url)!;
  }

  const metadata: LinkMetadata = { url };
  
  try {
    // Only fetch during build - this won't slow down page loads
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RabbitHoles/1.0; +https://rabbit-holes-garden.pages.dev/)'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch metadata for ${url}: ${response.status}`);
      return metadata;
    }
    
    const html = await response.text();
    
    // Extract OpenGraph and meta tags
    metadata.title = extractMeta(html, [
      /<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i,
      /<meta\s+name="title"\s+content="([^"]*)"[^>]*>/i,
      /<title[^>]*>([^<]+)<\/title>/i
    ]);
    
    metadata.description = extractMeta(html, [
      /<meta\s+property="og:description"\s+content="([^"]*)"[^>]*>/i,
      /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i
    ]);
    
    metadata.image = extractMeta(html, [
      /<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i,
      /<meta\s+name="twitter:image"\s+content="([^"]*)"[^>]*>/i
    ]);
    
    metadata.siteName = extractMeta(html, [
      /<meta\s+property="og:site_name"\s+content="([^"]*)"[^>]*>/i
    ]);
    
    metadata.author = extractMeta(html, [
      /<meta\s+name="author"\s+content="([^"]*)"[^>]*>/i,
      /<meta\s+property="article:author"\s+content="([^"]*)"[^>]*>/i
    ]);
    
    metadata.publishDate = extractMeta(html, [
      /<meta\s+property="article:published_time"\s+content="([^"]*)"[^>]*>/i,
      /<meta\s+name="date"\s+content="([^"]*)"[^>]*>/i
    ]);
    
    // Extract favicon
    const domain = new URL(url).origin;
    metadata.favicon = extractMeta(html, [
      /<link\s+rel="icon"\s+href="([^"]*)"[^>]*>/i,
      /<link\s+rel="shortcut icon"\s+href="([^"]*)"[^>]*>/i
    ]) || `${domain}/favicon.ico`;
    
    // Make relative URLs absolute
    if (metadata.image && metadata.image.startsWith('/')) {
      metadata.image = domain + metadata.image;
    }
    if (metadata.favicon && metadata.favicon.startsWith('/')) {
      metadata.favicon = domain + metadata.favicon;
    }
    
  } catch (error) {
    console.warn(`Error fetching metadata for ${url}:`, error);
  }
  
  // Cache the result (build-time only)
  metadataCache.set(url, metadata);
  return metadata;
}

function extractMeta(html: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1] && match[1].trim()) {
      return match[1].trim();
    }
  }
  return undefined;
}

// Predefined metadata for common sites (fallbacks)
export const SITE_METADATA: Record<string, Partial<LinkMetadata>> = {
  'github.com': {
    siteName: 'GitHub',
    favicon: 'https://github.com/favicon.ico'
  },
  'stackoverflow.com': {
    siteName: 'Stack Overflow',
    favicon: 'https://stackoverflow.com/favicon.ico'
  },
  'medium.com': {
    siteName: 'Medium',
    favicon: 'https://medium.com/favicon.ico'
  },
  'dev.to': {
    siteName: 'DEV Community',
    favicon: 'https://dev.to/favicon.ico'
  },
  'substack.com': {
    siteName: 'Substack',
    favicon: 'https://substack.com/favicon.ico'
  },
  'economist.com': {
    siteName: 'The Economist',
    favicon: 'https://www.economist.com/favicon.ico'
  },
  'twitter.com': {
    siteName: 'Twitter',
    favicon: 'https://twitter.com/favicon.ico'
  },
  'linkedin.com': {
    siteName: 'LinkedIn',
    favicon: 'https://linkedin.com/favicon.ico'
  }
};

export function getDomainMetadata(url: string): Partial<LinkMetadata> {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    for (const [key, metadata] of Object.entries(SITE_METADATA)) {
      if (domain.includes(key)) {
        return metadata;
      }
    }
  } catch {
    // Invalid URL
  }
  return {};
}