import { visit } from 'unist-util-visit';
import { fetchLinkMetadata, getDomainMetadata, type LinkMetadata } from '../utils/linkPreview';
import type { Plugin } from 'unified';
import type { Root, Paragraph, Text } from 'mdast';

// URL regex to detect standalone URLs
const URL_REGEX = /^https?:\/\/[^\s<>"]+$/;

// Cache for metadata during build
const metadataCache = new Map<string, LinkMetadata>();

export const remarkLinkPreview: Plugin<[], Root> = () => {
  return async (tree: Root) => {
    const transformations: Promise<void>[] = [];

    visit(tree, 'paragraph', (node: Paragraph, index: number, parent) => {
      // Check if paragraph contains only a single text node with a URL
      if (
        node.children.length === 1 &&
        node.children[0].type === 'text'
      ) {
        const textNode = node.children[0] as Text;
        const text = textNode.value.trim();
        
        if (URL_REGEX.test(text)) {
          // This is a standalone URL - convert to link preview
          const transformation = convertUrlToPreview(text, node, index, parent);
          transformations.push(transformation);
        }
      }
    });

    // Wait for all metadata fetching to complete
    await Promise.all(transformations);
  };
};

async function convertUrlToPreview(
  url: string, 
  node: Paragraph, 
  index: number, 
  parent: any
): Promise<void> {
  try {
    // Check cache first
    let metadata = metadataCache.get(url);
    
    if (!metadata) {
      // Fetch metadata with timeout
      try {
        metadata = await Promise.race([
          fetchLinkMetadata(url),
          new Promise<LinkMetadata>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]);
        metadataCache.set(url, metadata);
      } catch (error) {
        console.warn(`Failed to fetch metadata for ${url}, using fallback`);
        metadata = { 
          url,
          ...getDomainMetadata(url)
        };
        metadataCache.set(url, metadata);
      }
    }

    // Generate HTML for the link preview
    const previewHtml = generatePreviewHtml(metadata);
    
    // Replace the paragraph with HTML node
    const htmlNode = {
      type: 'html',
      value: previewHtml
    };
    
    if (parent && typeof index === 'number') {
      parent.children[index] = htmlNode;
    }
    
  } catch (error) {
    console.warn(`Error processing URL ${url}:`, error);
    // Leave original URL as-is on error
  }
}

function generatePreviewHtml(metadata: LinkMetadata): string {
  const {
    url,
    title = 'Link Preview',
    description,
    image,
    favicon,
    siteName,
    author,
    publishDate
  } = metadata;

  // Extract domain as fallback
  const domain = (() => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  })();

  const displayTitle = escapeHtml(title);
  const displayDescription = description ? escapeHtml(description) : `Visit ${domain}`;
  const displaySiteName = siteName || domain;
  const displayAuthor = author ? escapeHtml(author) : null;
  const displayDate = publishDate ? escapeHtml(publishDate) : null;

  return `
<div class="link-preview">
  <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="link-preview-card">
    ${image ? `
    <div class="link-preview-image">
      <img src="${escapeHtml(image)}" alt="${displayTitle}" />
    </div>
    ` : ''}
    <div class="link-preview-content">
      <div class="link-preview-header">
        ${favicon ? `<img src="${escapeHtml(favicon)}" alt="" class="link-preview-favicon" />` : ''}
        <span class="link-preview-domain">${escapeHtml(displaySiteName)}</span>
      </div>
      <h3 class="link-preview-title">${displayTitle}</h3>
      ${description ? `<p class="link-preview-description">${displayDescription}</p>` : ''}
      ${displayAuthor || displayDate ? `
      <div class="link-preview-meta">
        ${displayAuthor ? `<span class="link-preview-author">By ${displayAuthor}</span>` : ''}
        ${displayDate ? `<span class="link-preview-date">${displayDate}</span>` : ''}
      </div>
      ` : ''}
    </div>
  </a>
</div>`.trim();
}

function escapeHtml(text: string): string {
  const div = { innerHTML: '', textContent: text };
  return div.innerHTML || text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}