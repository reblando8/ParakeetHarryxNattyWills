// Simple test script for RAG integration
// Run this in the browser console to test RAG functionality

import { createEmbeddings, cosineSimilarity, createAthleteChunks, indexAthleteForRAG, searchWithRAG } from './api/EmbeddingAPI';

// Test data
const testAthlete = {
    id: 'test1',
    name: 'John Smith',
    userName: 'johnsmith',
    sport: 'Basketball',
    position: 'Point Guard',
    location: 'Los Angeles',
    team: 'Lakers',
    bio: 'Experienced point guard with excellent court vision and leadership skills.',
    height: '6\'2"',
    weight: '185 lbs',
    experience: 'Senior',
    education: 'UCLA'
};

// Test function
export const testRAG = async () => {
    try {
        console.log('🧪 Testing RAG Integration...');
        
        // Test 1: Create athlete chunks
        console.log('1. Creating athlete chunks...');
        const chunks = createAthleteChunks(testAthlete);
        console.log('Chunks created:', chunks);
        
        // Test 2: Index athlete
        console.log('2. Indexing athlete...');
        await indexAthleteForRAG(testAthlete);
        console.log('Athlete indexed successfully');
        
        // Test 3: Search with RAG
        console.log('3. Testing RAG search...');
        const searchResults = await searchWithRAG('basketball point guard', 3);
        console.log('Search results:', searchResults);
        
        // Test 4: Test cosine similarity
        console.log('4. Testing cosine similarity...');
        const vec1 = [1, 2, 3];
        const vec2 = [1, 2, 3];
        const similarity = cosineSimilarity(vec1, vec2);
        console.log('Cosine similarity test:', similarity);
        
        console.log('✅ RAG integration test completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ RAG integration test failed:', error);
        return false;
    }
};

// Export for browser console testing
window.testRAG = testRAG;
