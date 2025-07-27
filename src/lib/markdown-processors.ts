import type { MarkdownInstance } from 'astro';

export interface LinkPreviewMatch {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export function processMarkdownForLinkPreviews(content: string): {
  processedContent: string;
  linkPreviews: LinkPreviewMatch[];
} {
  const linkPreviews: LinkPreviewMatch[] = [];
  
  // Match link preview syntax: [preview](url "title|description|image")
  const linkPreviewRegex = /\[preview\]\(([^)]+)(?:\s+"([^"]*?)(?:\|([^"]*?))?(?:\|([^"]*?))?")?\)/g;
  
  const processedContent = content.replace(linkPreviewRegex, (match, url, title, description, image) => {
    linkPreviews.push({
      url: url.trim(),
      title: title?.trim(),
      description: description?.trim(),
      image: image?.trim(),
    });
    
    // Return a placeholder that will be replaced by Astro component
    return `<LinkPreview url="${url.trim()}"${title ? ` title="${title.trim()}"` : ''}${description ? ` description="${description.trim()}"` : ''}${image ? ` image="${image.trim()}"` : ''} />`;
  });

  // Also match standard URLs that should be converted to previews
  const urlRegex = /(?:^|\s)(https?:\/\/[^\s<>"{}|\\^`\[\]]+)(?=\s|$)/g;
  
  const finalContent = processedContent.replace(urlRegex, (match, url) => {
    // Don't convert URLs that are already in markdown links or previews
    if (match.includes('[') || match.includes('<LinkPreview')) {
      return match;
    }
    
    linkPreviews.push({ url: url.trim() });
    return match.replace(url, `<LinkPreview url="${url.trim()}" />`);
  });

  return {
    processedContent: finalContent,
    linkPreviews,
  };
}

export function enhanceMarkdownWithComponents(content: string): string {
  let processedContent = content;

  // Process quotes - convert > blockquotes to custom quote components
  processedContent = processedContent.replace(
    /^>\s+(.+?)(?=\n(?!>)|$)/gm,
    '<div class="quote">$1</div>'
  );

  // Process YouTube embeds
  processedContent = processedContent.replace(
    /(?:^|\s)(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)(?=\s|$)/g,
    (match, url) => {
      return match.replace(url, `<LinkPreview url="${url}" />`);
    }
  );

  // Process Twitter embeds
  processedContent = processedContent.replace(
    /(?:^|\s)(https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+)(?=\s|$)/g,
    (match, url) => {
      return match.replace(url, `<LinkPreview url="${url}" />`);
    }
  );

  // Process GitHub links
  processedContent = processedContent.replace(
    /(?:^|\s)(https?:\/\/github\.com\/[\w-]+\/[\w-]+)(?=\s|$)/g,
    (match, url) => {
      return match.replace(url, `<LinkPreview url="${url}" />`);
    }
  );

  return processedContent;
}