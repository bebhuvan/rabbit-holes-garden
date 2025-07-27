<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>RSS Feed - <xsl:value-of select="/rss/channel/title"/></title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9fafb;
          }
          .header {
            background: white;
            padding: 40px;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
          }
          .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
            color: #111827;
          }
          .header p {
            color: #6b7280;
            font-size: 1.1rem;
          }
          .info {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .info h2 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 1.2rem;
          }
          .info p {
            color: #78350f;
          }
          .info code {
            background: #fbbf24;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
          }
          .posts {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .posts h2 {
            background: #ea580c;
            color: white;
            padding: 20px;
            margin: 0;
            font-size: 1.3rem;
          }
          .post {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
          }
          .post:last-child {
            border-bottom: none;
          }
          .post h3 {
            font-size: 1.2rem;
            margin-bottom: 8px;
          }
          .post h3 a {
            color: #111827;
            text-decoration: none;
          }
          .post h3 a:hover {
            color: #ea580c;
          }
          .post .meta {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 12px;
          }
          .post .description {
            color: #4b5563;
            line-height: 1.6;
          }
          .post .tags {
            margin-top: 12px;
          }
          .tag {
            display: inline-block;
            background: #f3f4f6;
            color: #4b5563;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-right: 6px;
            margin-top: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6b7280;
            font-size: 0.9rem;
          }
          .footer a {
            color: #ea580c;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐰 <xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
        </div>
        
        <div class="info">
          <h2>📡 RSS Feed</h2>
          <p>This is an RSS feed. You can subscribe to it using your favorite RSS reader application. Copy this URL: <code><xsl:value-of select="/rss/channel/link"/>/rss.xml</code></p>
        </div>
        
        <div class="posts">
          <h2>Latest Posts (<xsl:value-of select="count(/rss/channel/item)"/> items)</h2>
          
          <xsl:for-each select="/rss/channel/item">
            <xsl:sort select="pubDate" order="descending"/>
            <div class="post">
              <h3>
                <a href="{/rss/channel/link}{link}" target="_blank">
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <div class="meta">
                Published: <xsl:value-of select="substring(pubDate, 1, 16)"/>
                <xsl:if test="author"> • by <xsl:value-of select="author"/></xsl:if>
              </div>
              <div class="description">
                <xsl:value-of select="description"/>
              </div>
              <xsl:if test="category">
                <div class="tags">
                  <xsl:for-each select="category">
                    <span class="tag">#<xsl:value-of select="."/></span>
                  </xsl:for-each>
                </div>
              </xsl:if>
            </div>
          </xsl:for-each>
        </div>
        
        <div class="footer">
          <p>Generated from <a href="{/rss/channel/link}">Rabbit Holes</a> • Last updated: <xsl:value-of select="/rss/channel/lastBuildDate"/></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>