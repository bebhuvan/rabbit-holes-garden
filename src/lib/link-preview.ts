export interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type: 'link' | 'youtube' | 'twitter' | 'github';
}

export function extractLinkPreviewData(url: string): LinkPreviewData {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();

  // Determine link type based on hostname
  let type: LinkPreviewData['type'] = 'link';
  
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    type = 'youtube';
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    type = 'twitter';
  } else if (hostname.includes('github.com')) {
    type = 'github';
  }

  return {
    url,
    type,
  };
}

// Enhanced Open Graph metadata fetching
export async function fetchOpenGraphData(url: string): Promise<LinkPreviewData> {
  try {
    const baseData = extractLinkPreviewData(url);
    
    // For special types, return early with base data
    if (baseData.type !== 'link') {
      return baseData;
    }

    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
    });

    if (!response.ok) {
      return baseData;
    }

    const html = await response.text();
    
    // Extract Open Graph and meta tags
    const ogData = extractMetaTags(html);
    
    return {
      ...baseData,
      title: ogData.title || extractTitle(html),
      description: ogData.description,
      image: ogData.image ? resolveImageUrl(ogData.image, url) : undefined,
      siteName: ogData.siteName,
    };
  } catch (error) {
    console.error('Failed to fetch Open Graph data:', error);
    return extractLinkPreviewData(url);
  }
}

function extractMetaTags(html: string): {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
} {
  const metaData: any = {};

  // Open Graph tags
  const ogMatches = html.matchAll(/<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["']/gi);
  for (const match of ogMatches) {
    const property = match[1];
    const content = match[2];
    
    switch (property) {
      case 'title':
        metaData.title = content;
        break;
      case 'description':
        metaData.description = content;
        break;
      case 'image':
        metaData.image = content;
        break;
      case 'site_name':
        metaData.siteName = content;
        break;
    }
  }

  // Twitter Card tags as fallback
  const twitterMatches = html.matchAll(/<meta\s+name=["']twitter:([^"']+)["']\s+content=["']([^"']+)["']/gi);
  for (const match of twitterMatches) {
    const property = match[1];
    const content = match[2];
    
    switch (property) {
      case 'title':
        if (!metaData.title) metaData.title = content;
        break;
      case 'description':
        if (!metaData.description) metaData.description = content;
        break;
      case 'image':
        if (!metaData.image) metaData.image = content;
        break;
    }
  }

  // Standard meta tags as fallback
  if (!metaData.description) {
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) metaData.description = descMatch[1];
  }

  return metaData;
}

function extractTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : undefined;
}

function resolveImageUrl(imageUrl: string, baseUrl: string): string {
  try {
    return new URL(imageUrl, baseUrl).href;
  } catch {
    return imageUrl;
  }
}

export function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getTweetId(url: string): string | null {
  const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getGitHubRepoInfo(url: string): { owner: string; repo: string } | null {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  return match ? { owner: match[1], repo: match[2] } : null;
}