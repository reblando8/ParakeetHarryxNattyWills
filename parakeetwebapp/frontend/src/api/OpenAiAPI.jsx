// OpenAI API integration for intelligent chat responses and search actions
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Add this to your .env file

export const analyzeUserQuery = async (userQuery, currentFilters = {}) => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }

        const systemPrompt = `You are an intelligent search assistant for a sports athlete discovery platform. 
        
Your job is to analyze user queries and determine if they want to:
1. SEARCH - Find athletes based on criteria
2. HELP - Get help with using the platform
3. CHAT - General conversation

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

Respond with a JSON object in this exact format:
{
    "action": "SEARCH|HELP|CHAT",
    "response": "Your response to the user",
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
    }
}

Examples:
User: "Find basketball players in Los Angeles"
Response: {"action": "SEARCH", "response": "I'll search for basketball players in Los Angeles for you!", "searchParams": {"query": "", "filters": {"sport": "Basketball", "location": "Los Angeles"}}}

User: "How do I use filters?"
Response: {"action": "HELP", "response": "I can help you with filters! You can filter athletes by sport, position, location, team, education, experience level, and physical attributes. Just use the filter panel on the left side of the screen.", "searchParams": null}}

User: "What's the weather like?"
Response: {"action": "CHAT", "response": "I'm focused on helping you find athletes and use this sports platform. Is there anything about searching for athletes I can help you with?", "searchParams": null}}`;

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
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
        
        // Parse the JSON response
        try {
            const parsedResponse = JSON.parse(content);
            return parsedResponse;
        } catch (parseError) {
            console.error('Failed to parse DeepSeek response:', content);
            return {
                action: 'CHAT',
                response: "I understand you're looking for help. I can assist you with finding athletes, using search filters, or navigating the platform. What would you like to know?",
                searchParams: null
            };
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        return {
            action: 'CHAT',
            response: "I'm having trouble connecting to my AI assistant right now. I can still help you with basic questions about using the search features!",
            searchParams: null
        };
    }
};

export const generateSearchSummary = async (searchResults, searchQuery, filters) => {
    try {
        if (!OPENAI_API_KEY || !searchResults || searchResults.length === 0) {
            return `Found ${searchResults.length} athletes matching your search criteria.`;
        }

        const systemPrompt = `You are a helpful assistant that summarizes search results for athletes. 
        
Given the search results, provide a brief, friendly summary that highlights:
- Number of results found
- Key characteristics of the athletes found
- Any notable patterns or insights

Keep it concise (1-2 sentences) and encouraging.`;

        const resultsSummary = searchResults.slice(0, 5).map(athlete => ({
            name: athlete.name || athlete.userName || 'Unknown',
            sport: athlete.sport || 'Not specified',
            position: athlete.position || 'Not specified',
            location: athlete.location || 'Not specified'
        }));

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Search query: "${searchQuery}"\nFilters: ${JSON.stringify(filters)}\nResults: ${JSON.stringify(resultsSummary)}`
                    }
                ],
                temperature: 0.5,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI summary error:', error);
        return `Found ${searchResults.length} athletes matching your search criteria. Click on any profile to learn more!`;
    }
};
