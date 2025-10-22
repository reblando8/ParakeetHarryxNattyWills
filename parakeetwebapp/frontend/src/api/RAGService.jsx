// RAG Service for enhanced chatbot responses
import { searchWithRAG, indexAthleteForRAG } from './EmbeddingAPI';
import { searchUsers } from './FirestoreAPI';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Enhanced query analysis with RAG context
export const analyzeUserQueryWithRAG = async (userQuery, currentFilters = {}, recentSearchResults = []) => {
    try {
        console.log('Analyzing query with RAG:', userQuery);
        
        // First, try to get relevant context using RAG
        const ragResults = await searchWithRAG(userQuery, 3);
        console.log('RAG results:', ragResults);
        
        // Build context from RAG results
        const ragContext = ragResults.length > 0 ? 
            ragResults.map(result => result.text).join('\n\n') : 
            'No relevant athlete information found.';
        
        // Create enhanced system prompt with RAG context
        const systemPrompt = `You are an intelligent search assistant for a sports athlete discovery platform. 
        
Your job is to analyze user queries and determine if they want to:
1. SEARCH - Find athletes based on criteria
2. HELP - Get help with using the platform
3. CHAT - General conversation
4. ATHLETE_INFO - Get detailed information about a specific athlete

Available search filters:
- sport: Basketball, Soccer, Football, Baseball, Tennis, Golf, Swimming, Track & Field, Volleyball, Other
- position: Any position name (e.g., Point Guard, Striker, Quarterback)
- location: City, State, or Country
- team: Team name
- education: School or university name
- experience: rookie, junior, mid, senior, veteran
- height: Physical height
- weight: Physical weight

Current active filters: ${JSON.stringify(currentFilters)}

RELEVANT ATHLETE CONTEXT FROM DATABASE:
${ragContext}

Use this context to provide more informed and specific responses. If the user is asking about specific athletes mentioned in the context, reference them directly.

Respond with a JSON object in this exact format:
{
    "action": "SEARCH|HELP|CHAT|ATHLETE_INFO",
    "response": "Your response to the user (use the context above to be more specific)",
    "searchParams": {
        "query": "search text if searching",
        "filters": {
            "sport": "value if mentioned",
            "position": "value if mentioned", 
            "location": "value if mentioned",
            "team": "value if mentioned",
            "education": "value if mentioned",
            "experience": "value if mentioned",
            "height": "value if mentioned",
            "weight": "value if mentioned"
        }
    },
    "athleteName": "athlete name if asking about specific athlete",
    "ragContext": "Relevant context from database that informed this response"
}`;

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-1106',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userQuery
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            const parsedResponse = JSON.parse(content);
            return {
                ...parsedResponse,
                ragResults: ragResults // Include RAG results for debugging
            };
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', content);
            return {
                action: 'CHAT',
                response: "I understand you're looking for help. I can assist you with finding athletes, using search filters, or navigating the platform. What would you like to know?",
                searchParams: null,
                ragContext: ragContext
            };
        }
    } catch (error) {
        console.error('RAG query analysis error:', error);
        
        // Fallback to basic analysis without RAG
        return {
            action: 'CHAT',
            response: "I'm having trouble processing your request right now. Please try again or use the search filters directly.",
            searchParams: null,
            ragContext: 'Error occurred during processing'
        };
    }
};

// Enhanced search with RAG context
export const performRAGSearch = async (searchParams, currentFilters = {}) => {
    try {
        // Perform regular search
        const searchResults = await searchUsers(
            searchParams.query || '', 
            searchParams.filters || {}
        );
        
        // Get RAG context for the search results
        const ragContext = await searchWithRAG(
            `${searchParams.query} ${JSON.stringify(searchParams.filters)}`, 
            5
        );
        
        return {
            searchResults,
            ragContext,
            searchParams
        };
    } catch (error) {
        console.error('RAG search error:', error);
        return {
            searchResults: [],
            ragContext: [],
            searchParams
        };
    }
};

// Generate enhanced athlete information with RAG
export const getEnhancedAthleteInfo = async (athleteName, recentSearchResults = []) => {
    try {
        // First, try to find the athlete in recent search results
        let athlete = recentSearchResults.find(user => 
            user.name?.toLowerCase().includes(athleteName.toLowerCase()) ||
            user.userName?.toLowerCase().includes(athleteName.toLowerCase())
        );

        if (!athlete) {
            // If not found in search results, search for the athlete
            const searchResults = await searchUsers(athleteName, {});
            athlete = searchResults.find(user => 
                user.name?.toLowerCase().includes(athleteName.toLowerCase()) ||
                user.userName?.toLowerCase().includes(athleteName.toLowerCase())
            );
        }

        if (!athlete) {
            return `I couldn't find an athlete named "${athleteName}". Please check the spelling or try searching for them first.`;
        }

        // Get RAG context for this specific athlete
        const ragContext = await searchWithRAG(`${athleteName} ${athlete.sport} ${athlete.position}`, 3);
        
        // Generate enhanced rundown using RAG context
        const enhancedRundown = await generateRAGEnhancedAthleteRundown(athlete, ragContext);
        return enhancedRundown;

    } catch (error) {
        console.error('Error getting enhanced athlete info:', error);
        return "I'm having trouble getting athlete information right now. Please try again or use the search to find the athlete first.";
    }
};

// Generate RAG-enhanced athlete rundown
const generateRAGEnhancedAthleteRundown = async (athlete, ragContext) => {
    try {
        if (!OPENAI_API_KEY) {
            return generateBasicAthleteRundown(athlete);
        }

        const athleteData = {
            name: athlete.name || athlete.userName || 'Unknown Athlete',
            sport: athlete.sport || 'Not specified',
            position: athlete.position || 'Not specified',
            location: athlete.location || 'Not specified',
            team: athlete.team || 'Not specified',
            education: athlete.education || 'Not specified',
            experience: athlete.experience || 'Not specified',
            height: athlete.height || 'Not specified',
            weight: athlete.weight || 'Not specified',
            bio: athlete.bio || athlete.about || 'No bio available'
        };

        const ragContextText = ragContext.length > 0 ? 
            ragContext.map(result => result.text).join('\n\n') : 
            'No additional context available.';

        const systemPrompt = `You are a sports analyst writing detailed athlete profiles. Create an engaging, professional rundown of an athlete that highlights their key attributes, background, and potential.

Use the additional context provided to make the profile more specific and informative.

Format your response as a detailed athlete profile with:
- A compelling headline
- Key stats and information in an organized format
- An engaging summary that showcases the athlete's strengths and background
- Use emojis and formatting to make it visually appealing
- Keep it informative but engaging and easy to read
- Reference specific details from the context when available

Focus on what makes this athlete unique and interesting.`;

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-1106',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Create a detailed athlete profile for: ${JSON.stringify(athleteData)}

Additional Context:
${ragContextText}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error for enhanced athlete rundown:', response.status);
            return generateBasicAthleteRundown(athlete);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('Error generating RAG-enhanced athlete rundown:', error);
        return generateBasicAthleteRundown(athlete);
    }
};

// Fallback basic athlete rundown
const generateBasicAthleteRundown = (athlete) => {
    const name = athlete.name || athlete.userName || 'Unknown Athlete';
    const sport = athlete.sport || 'Not specified';
    const position = athlete.position || 'Not specified';
    const location = athlete.location || 'Not specified';
    const team = athlete.team || 'Not specified';
    const education = athlete.education || 'Not specified';
    const experience = athlete.experience || 'Not specified';
    const height = athlete.height || 'Not specified';
    const weight = athlete.weight || 'Not specified';
    const bio = athlete.bio || athlete.about || 'No bio available';

    return `🏆 **${name}** - ${sport} ${position}

📍 **Location:** ${location}
🏟️ **Team:** ${team}
🎓 **Education:** ${education}
⭐ **Experience Level:** ${experience}
📏 **Physical Stats:** ${height}, ${weight}

📝 **About:**
${bio}

💡 **Quick Summary:** ${name} is a ${experience} level ${sport} player who plays ${position} for ${team} in ${location}. ${education !== 'Not specified' ? `They studied at ${education}.` : ''} ${height !== 'Not specified' && weight !== 'Not specified' ? `Their physical stats are ${height} and ${weight}.` : ''}`;
};

// Initialize RAG with existing athlete data
export const initializeRAG = async (athletes) => {
    try {
        console.log('Initializing RAG with athlete data...');
        
        for (const athlete of athletes) {
            await indexAthleteForRAG(athlete);
        }
        
        console.log(`RAG initialized with ${athletes.length} athletes`);
    } catch (error) {
        console.error('Error initializing RAG:', error);
    }
};
