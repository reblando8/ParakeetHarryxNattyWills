// Embedding API service for RAG implementation
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Create embeddings using OpenAI's text-embedding-ada-002 model
export const createEmbeddings = async (text) => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }

        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: text,
                model: 'text-embedding-ada-002'
            })
        });

        if (!response.ok) {
            throw new Error(`Embedding API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data[0].embedding;
    } catch (error) {
        console.error('Error creating embeddings:', error);
        throw error;
    }
};

// Calculate cosine similarity between two vectors
export const cosineSimilarity = (vecA, vecB) => {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);
};

// Create text chunks from athlete data for embedding
export const createAthleteChunks = (athlete) => {
    const chunks = [];
    
    // Basic profile chunk
    if (athlete.name || athlete.userName) {
        chunks.push({
            id: `${athlete.id}_profile`,
            text: `Athlete: ${athlete.name || athlete.userName}. Sport: ${athlete.sport || 'Not specified'}. Position: ${athlete.position || 'Not specified'}. Location: ${athlete.location || 'Not specified'}. Team: ${athlete.team || 'Not specified'}. Bio: ${athlete.bio || athlete.about || 'No bio available'}`,
            metadata: {
                type: 'profile',
                athleteId: athlete.id,
                name: athlete.name || athlete.userName,
                sport: athlete.sport,
                position: athlete.position
            }
        });
    }

    // Stats chunk
    if (athlete.height || athlete.weight || athlete.experience) {
        chunks.push({
            id: `${athlete.id}_stats`,
            text: `Physical stats: Height ${athlete.height || 'Not specified'}, Weight ${athlete.weight || 'Not specified'}. Experience level: ${athlete.experience || 'Not specified'}. Education: ${athlete.education || 'Not specified'}`,
            metadata: {
                type: 'stats',
                athleteId: athlete.id,
                name: athlete.name || athlete.userName
            }
        });
    }

    return chunks;
};

// Simple in-memory vector store (for demo - in production, use a proper vector DB)
class SimpleVectorStore {
    constructor() {
        this.vectors = [];
        this.metadata = [];
    }

    addVector(embedding, metadata, text) {
        this.vectors.push(embedding);
        this.metadata.push({ ...metadata, text });
    }

    search(queryEmbedding, topK = 5) {
        const similarities = this.vectors.map((vector, index) => ({
            similarity: cosineSimilarity(queryEmbedding, vector),
            metadata: this.metadata[index],
            index
        }));

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)
            .filter(item => item.similarity > 0.1); // Filter out very low similarity
    }

    clear() {
        this.vectors = [];
        this.metadata = [];
    }
}

// Global vector store instance
export const vectorStore = new SimpleVectorStore();

// Index athlete data for RAG
export const indexAthleteForRAG = async (athlete) => {
    try {
        const chunks = createAthleteChunks(athlete);
        
        for (const chunk of chunks) {
            const embedding = await createEmbeddings(chunk.text);
            vectorStore.addVector(embedding, chunk.metadata, chunk.text);
        }
        
        console.log(`Indexed ${chunks.length} chunks for athlete: ${athlete.name || athlete.userName}`);
    } catch (error) {
        console.error('Error indexing athlete for RAG:', error);
    }
};

// Search for relevant content using RAG
export const searchWithRAG = async (query, topK = 5) => {
    try {
        const queryEmbedding = await createEmbeddings(query);
        const results = vectorStore.search(queryEmbedding, topK);
        
        return results.map(result => ({
            text: result.metadata.text,
            similarity: result.similarity,
            metadata: result.metadata
        }));
    } catch (error) {
        console.error('Error searching with RAG:', error);
        return [];
    }
};
