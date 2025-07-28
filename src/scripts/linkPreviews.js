// Client-side automatic link preview system
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLinkPreviews);
  } else {
    initLinkPreviews();
  }

  function initLinkPreviews() {
    console.log('🔌 Initializing automatic link previews...');
    
    // Find all paragraphs in post content
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const paragraphs = postContent.querySelectorAll('p');
    let convertedCount = 0;

    paragraphs.forEach(paragraph => {
      // Check if paragraph contains only a single link where text = href
      const links = paragraph.querySelectorAll('a');
      if (links.length === 1 && paragraph.textContent.trim() === links[0].href) {
        const link = links[0];
        const url = link.href;
        
        console.log('✅ Converting standalone link:', url);
        convertedCount++;
        
        // Replace paragraph with preview card
        const previewCard = createPreviewCard(url);
        paragraph.parentNode.replaceChild(previewCard, paragraph);
        
        // Fetch metadata asynchronously and update
        fetchMetadata(url).then(metadata => {
          updatePreviewCard(previewCard, metadata);
        }).catch(error => {
          console.warn('Failed to fetch metadata for:', url, error);
        });
      }
    });

    console.log(`🚀 Converted ${convertedCount} links to previews`);
  }

  function createPreviewCard(url) {
    const domain = getDomain(url);
    
    const previewDiv = document.createElement('div');
    previewDiv.className = 'link-preview';
    previewDiv.innerHTML = `
      <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="link-preview-card">
        <div class="link-preview-content">
          <div class="link-preview-header">
            <span class="link-preview-domain">${escapeHtml(domain)}</span>
          </div>
          <h3 class="link-preview-title">Loading...</h3>
          <p class="link-preview-description">Fetching preview...</p>
        </div>
      </a>
    `;
    
    return previewDiv;
  }

  async function fetchMetadata(url) {
    try {
      // Use a CORS proxy to fetch metadata
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.contents;
      
      // Extract metadata from HTML
      const metadata = {
        title: extractFromHtml(html, [
          /<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i,
          /<meta\s+name="title"\s+content="([^"]*)"[^>]*>/i,
          /<title[^>]*>([^<]+)<\/title>/i
        ]),
        description: extractFromHtml(html, [
          /<meta\s+property="og:description"\s+content="([^"]*)"[^>]*>/i,
          /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i
        ]),
        image: extractFromHtml(html, [
          /<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i,
          /<meta\s+name="twitter:image"\s+content="([^"]*)"[^>]*>/i
        ]),
        siteName: extractFromHtml(html, [
          /<meta\s+property="og:site_name"\s+content="([^"]*)"[^>]*>/i
        ])
      };
      
      return metadata;
    } catch (error) {
      console.warn('Error fetching metadata:', error);
      return {};
    }
  }

  function updatePreviewCard(previewDiv, metadata) {
    const domain = getDomain(previewDiv.querySelector('a').href);
    const title = metadata.title || 'Link Preview';
    const description = metadata.description || `Visit ${domain}`;
    const siteName = metadata.siteName || domain;
    
    const titleEl = previewDiv.querySelector('.link-preview-title');
    const descEl = previewDiv.querySelector('.link-preview-description');
    const domainEl = previewDiv.querySelector('.link-preview-domain');
    
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
    if (domainEl) domainEl.textContent = siteName;
    
    // Add image if available
    if (metadata.image) {
      const contentDiv = previewDiv.querySelector('.link-preview-content');
      const imageDiv = document.createElement('div');
      imageDiv.className = 'link-preview-image';
      imageDiv.innerHTML = `<img src="${escapeHtml(metadata.image)}" alt="${escapeHtml(title)}" />`;
      
      const card = previewDiv.querySelector('.link-preview-card');
      card.insertBefore(imageDiv, contentDiv);
    }
  }

  function extractFromHtml(html, patterns) {
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].trim()) {
        return match[1].trim();
      }
    }
    return null;
  }

  function getDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();