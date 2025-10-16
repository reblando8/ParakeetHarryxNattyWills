// OpenAI API integration for intelligent chat responses and search actions
import { searchUsers } from './FirestoreAPI';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Add this to your .env file

// Rate limiting and cost control
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
let requestCount = 0;
const MAX_REQUESTS_PER_SESSION = 50; // Limit requests per session

export const analyzeUserQuery = async (userQuery, currentFilters = {}) => {
    try {
        console.log('OpenAI API Key loaded:', !!OPENAI_API_KEY);
        console.log('API Key starts with:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'undefined');
        
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }

        // Check request limit
        if (requestCount >= MAX_REQUESTS_PER_SESSION) {
            console.log('Request limit reached, using fallback');
            const fallbackResponse = getFallbackResponse(userQuery);
            return {
                action: fallbackResponse.action,
                response: `⚠️ I've reached my request limit for this session. ${fallbackResponse.response}`,
                searchParams: fallbackResponse.searchParams
            };
        }

        // Rate limiting - wait if requests are too frequent
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            console.log(`Rate limiting: waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        lastRequestTime = Date.now();
        requestCount++;

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

Respond with a JSON object in this exact format:
{
    "action": "SEARCH|HELP|CHAT|ATHLETE_INFO",
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
    },
    "athleteName": "athlete name if asking about specific athlete"
}

Examples:
User: "Find basketball players in Los Angeles"
Response: {"action": "SEARCH", "response": "I'll search for basketball players in Los Angeles for you!", "searchParams": {"query": "", "filters": {"sport": "Basketball", "location": "Los Angeles"}}, "athleteName": null}

User: "Tell me about John Smith"
Response: {"action": "ATHLETE_INFO", "response": "I'll get detailed information about John Smith for you!", "searchParams": null, "athleteName": "John Smith"}

User: "How do I use filters?"
Response: {"action": "HELP", "response": "I can help you with filters! You can filter athletes by sport, position, location, team, education, experience level, and physical attributes. Just use the filter panel on the left side of the screen.", "searchParams": null, "athleteName": null}

User: "What's the weather like?"
Response: {"action": "CHAT", "response": "I'm focused on helping you find athletes and use this sports platform. Is there anything about searching for athletes I can help you with?", "searchParams": null, "athleteName": null}`;

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
            const errorText = await response.text();
            console.error('OpenAI API Error Response:', errorText);
            
            // Handle rate limiting with retry
            if (response.status === 429) {
                console.log('Rate limited, waiting 2 seconds before retry...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                // Retry once
                const retryResponse = await fetch(OPENAI_API_URL, {
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
                
                if (!retryResponse.ok) {
                    throw new Error(`OpenAI API error: ${retryResponse.status} - Rate limit exceeded. Please try again later.`);
                }
                
                const retryData = await retryResponse.json();
                console.log('OpenAI API Retry Response:', retryData);
                const retryContent = retryData.choices[0].message.content;
                
                try {
                    const parsedResponse = JSON.parse(retryContent);
                    return parsedResponse;
                } catch (parseError) {
                    console.error('Failed to parse OpenAI retry response:', retryContent);
                    return {
                        action: 'CHAT',
                        response: "I understand you're looking for help. I can assist you with finding athletes, using search filters, or navigating the platform. What would you like to know?",
                        searchParams: null
                    };
                }
            }
            
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('OpenAI API Response:', data);
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
        
        // Provide helpful fallback responses based on common queries
        const fallbackResponse = getFallbackResponse(userQuery);
        
        return {
            action: fallbackResponse.action,
            response: fallbackResponse.response,
            searchParams: fallbackResponse.searchParams
        };
    }
};

// Fallback responses when OpenAI API is unavailable
const getFallbackResponse = (userQuery) => {
    const input = userQuery.toLowerCase();
    
    // Athlete-specific queries
    if (input.includes('tell me about') || input.includes('who is') || input.includes('about this athlete') || 
        input.includes('more about') || input.includes('details about') || input.includes('rundown of')) {
        return {
            action: 'ATHLETE_INFO',
            response: "I'd be happy to tell you more about this athlete! However, I need to know which specific athlete you're asking about. You can either:\n\n1. Click on an athlete's profile card above\n2. Tell me their name\n3. Ask about a specific athlete from the search results",
            searchParams: null
        };
    }
    
    // Search-related queries
    if (input.includes('basketball') || input.includes('soccer') || input.includes('football') || input.includes('baseball')) {
        const sport = input.includes('basketball') ? 'Basketball' : 
                     input.includes('soccer') ? 'Soccer' : 
                     input.includes('football') ? 'Football' : 'Baseball';
        
        return {
            action: 'SEARCH',
            response: `I'll search for ${sport} players for you!`,
            searchParams: {
                query: '',
                filters: { sport: sport }
            }
        };
    }
    
    if (input.includes('search') || input.includes('find')) {
        return {
            action: 'SEARCH',
            response: "I'll help you search for athletes! Use the search bar above or the filters on the left to find athletes by sport, position, location, or other criteria.",
            searchParams: {
                query: input.replace(/search|find/gi, '').trim(),
                filters: {}
            }
        };
    }
    
    if (input.includes('filter') || input.includes('sport') || input.includes('position')) {
        return {
            action: 'HELP',
            response: "You can filter athletes by:\n• Sport (Basketball, Soccer, Football, etc.)\n• Position (Point Guard, Striker, etc.)\n• Location (City, State)\n• Team name\n• Education level\n• Experience level\n• Physical attributes (Height, Weight)\n\nUse the filter panel on the left side of the screen!",
            searchParams: null
        };
    }
    
    if (input.includes('profile') || input.includes('click')) {
        return {
            action: 'HELP',
            response: "Yes! You can click on any athlete's profile card to view their full profile. This will show you their detailed information, posts, and more. Just click anywhere on the athlete's card in the search results.",
            searchParams: null
        };
    }
    
    if (input.includes('history') || input.includes('recent')) {
        return {
            action: 'HELP',
            response: "Your recent searches are saved and displayed on the right side of the screen. You can click on any previous search to quickly repeat it with the same filters. This makes it easy to find athletes you've searched for before!",
            searchParams: null
        };
    }
    
    if (input.includes('help') || input.includes('how')) {
        return {
            action: 'HELP',
            response: "I'm here to help! This platform helps you discover and connect with athletes. You can:\n\n1. Search by name using the search bar\n2. Filter by sport, position, location, etc.\n3. Click on profiles to view details\n4. Use your search history for quick access\n\nWhat specific feature would you like to learn about?",
            searchParams: null
        };
    }
    
    // Default response
    return {
        action: 'CHAT',
        response: "I'm currently experiencing some technical difficulties with my AI assistant, but I can still help you with basic search functionality! Try using the search bar or filters to find athletes. What would you like to search for?",
        searchParams: null
    };
};

// Get detailed athlete information
export const getAthleteInfo = async (athleteName, searchResults = []) => {
    try {
        if (!athleteName) {
            return "I need to know which athlete you're asking about. Please specify their name or click on a profile card above.";
        }

        // First, try to find the athlete in recent search results
        let athlete = searchResults.find(user => 
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

        // Generate detailed athlete rundown using OpenAI
        const rundown = await generateAthleteRundown(athlete);
        return rundown;

    } catch (error) {
        console.error('Error getting athlete info:', error);
        return "I'm having trouble getting athlete information right now. Please try again or use the search to find the athlete first.";
    }
};

// Generate a detailed rundown of an athlete using OpenAI
const generateAthleteRundown = async (athlete) => {
    try {
        if (!OPENAI_API_KEY) {
            // Fallback to basic template if no API key
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

        const systemPrompt = `You are a sports analyst writing detailed athlete profiles. Create an engaging, professional rundown of an athlete that highlights their key attributes, background, and potential.

Format your response as a detailed athlete profile with:
- A compelling headline
- Key stats and information in an organized format
- An engaging summary that showcases the athlete's strengths and background
- Use emojis and formatting to make it visually appealing
- Keep it informative but engaging and easy to read

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
                        content: `Create a detailed athlete profile for: ${JSON.stringify(athleteData)}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error for athlete rundown:', response.status);
            return generateBasicAthleteRundown(athlete);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('Error generating athlete rundown with OpenAI:', error);
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
                model: 'gpt-3.5-turbo-1106',
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
