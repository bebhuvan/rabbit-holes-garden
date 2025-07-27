// Quick test of the AI integration
import { config } from 'dotenv';
config();

async function testAnthropicAPI() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('No API key found in environment');
    return;
  }

  console.log('Testing Anthropic API...');
  console.log('API Key found:', apiKey.substring(0, 20) + '...');

  const systemPrompt = `You are an expert content curator and writer for "Rabbit Holes", a blog that discovers and shares beautiful, thought-provoking things from across the internet.

Create a thoughtful blog post from the given content. Format your response as JSON with:
- title: Compelling, specific title
- content: Full blog post in markdown format
- excerpt: 1-2 sentence summary
- tags: 2-4 relevant tags`;

  const userPrompt = `Please analyze this text and create a thoughtful blog post:

Title: Ocean Currents Visualization
URL: https://earth.nullschool.net

Content: This interactive visualization shows global ocean currents in real-time. The Gulf Stream carries 30 times more water than all the world's rivers combined. These currents have flowed for millennia, regulating our planet's climate through invisible rivers in the ocean.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    console.log('✅ API call successful!');
    console.log('Generated content:');
    console.log('---');
    console.log(content);
    console.log('---');

    // Try to parse as JSON
    try {
      const cleaned = content.trim();
      const parsed = JSON.parse(cleaned);
      console.log('\n✅ JSON parsing successful!');
      console.log('Title:', parsed.title);
      console.log('Excerpt:', parsed.excerpt);
      console.log('Tags:', parsed.tags);
      console.log('Content length:', parsed.content.length);
    } catch (parseError) {
      console.log('\n⚠️  JSON parsing failed:', parseError.message);
      console.log('First 100 chars:', content.substring(0, 100));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnthropicAPI();