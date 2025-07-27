// Test the local API server
import { config } from 'dotenv';
config();

async function testAPICall() {
  const testData = {
    inputType: 'text',
    content: 'This interactive visualization of ocean currents shows how the Gulf Stream carries 30 times more water than all the world\'s rivers combined. These currents have been flowing for millennia, regulating Earth\'s climate.',
    metadata: {
      title: 'Ocean Currents Visualization',
      url: 'https://earth.nullschool.net'
    },
    settings: {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7
    }
  };

  try {
    console.log('🧪 Testing API call...');
    
    const response = await fetch('http://localhost:3000/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API call failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API call successful!');
      console.log('\n📝 Generated Post:');
      console.log('Title:', result.post.title);
      console.log('Excerpt:', result.post.excerpt);
      console.log('Tags:', result.post.tags);
      console.log('\nContent preview:');
      console.log(result.post.content.substring(0, 300) + '...');
      
      // Test the export format
      const slug = result.post.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      console.log('\n📄 Export format:');
      console.log('Filename:', `${slug}.md`);
      console.log('Ready for manual save! ✅');
      
    } else {
      console.error('❌ API returned error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPICall();