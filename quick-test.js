// Quick test of the complete system
import { config } from 'dotenv';
config();

const testData = {
  inputType: 'text',
  content: 'This fascinating article explores how trees communicate through underground fungal networks, sharing resources and information across entire forests.',
  metadata: {
    title: 'Forest Communication Networks'
  },
  settings: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7
  }
};

async function quickTest() {
  try {
    console.log('🧪 Testing complete system...');
    
    const response = await fetch('http://localhost:3000/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ System working perfectly!');
      console.log(`📝 Generated: "${result.post.title}"`);
      console.log(`🏷️ Tags: ${result.post.tags.join(', ')}`);
      console.log('\n🌐 Access your admin interface at:');
      console.log('   http://localhost:4321/admin');
      console.log('\n🎯 Ready to use! Enter your API key in the interface.');
    } else {
      console.error('❌ API returned error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

quickTest();