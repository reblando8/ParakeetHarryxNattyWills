# How `analyzeUserQuery` Figures Out Filters

## 🎯 Overview

The `analyzeUserQuery` function uses **OpenAI's GPT-3.5-turbo** to analyze natural language queries and extract structured filters. It's like having an AI assistant that understands what you're asking for and converts it into search parameters.

---

## 🔄 The Process

### **Step 1: Build System Prompt** (Instructions for AI)

```javascript
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
            ...
        }
    },
    "athleteName": "athlete name if asking about specific athlete"
}

Examples:
User: "Find basketball players in Los Angeles"
Response: {"action": "SEARCH", "response": "I'll search for basketball players in Los Angeles for you!", "searchParams": {"query": "", "filters": {"sport": "Basketball", "location": "Los Angeles"}}, "athleteName": null}
`;
```

**What this does:**

- Tells OpenAI what the system is for
- Lists all available filters
- Shows the exact JSON format to return
- Provides examples for learning

---

### **Step 2: Send Query to OpenAI**

```javascript
const response = await fetch(OPENAI_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: systemPrompt, // Instructions
      },
      {
        role: "user",
        content: userQuery, // "find swimmers in Miami"
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }),
});
```

**What happens:**

- Sends the system prompt (instructions)
- Sends the user's query
- OpenAI analyzes the query using its natural language understanding

---

### **Step 3: OpenAI Analyzes and Extracts**

OpenAI's GPT-3.5-turbo uses its **trained knowledge** to:

1. **Understand intent**: "find swimmers" = user wants to search
2. **Extract entities**:
   - "swimmers" → sport: "Swimming"
   - "in Miami" → location: "Miami"
3. **Map to filters**: Matches extracted entities to available filter categories
4. **Return structured JSON**: Formats the response according to the system prompt

**Example Analysis:**

```
User Query: "find swimmers in Miami"
    ↓
OpenAI thinks:
- "find" = SEARCH action
- "swimmers" = sport filter (Swimming)
- "in Miami" = location filter (Miami)
    ↓
Returns JSON:
{
  "action": "SEARCH",
  "response": "I'll search for swimmers in Miami!",
  "searchParams": {
    "query": "",
    "filters": {
      "sport": "Swimming",
      "location": "Miami"
    }
  }
}
```

---

### **Step 4: Parse Response**

```javascript
const data = await response.json();
const content = data.choices[0].message.content;
// content = '{"action": "SEARCH", "searchParams": {...}}'

const parsedResponse = JSON.parse(content);
return parsedResponse;
```

**What happens:**

- Extracts the JSON string from OpenAI's response
- Parses it into a JavaScript object
- Returns the structured filters

---

## 🧠 How OpenAI "Understands"

OpenAI's GPT-3.5-turbo has been trained on vast amounts of text, so it understands:

### **1. Synonyms & Variations**

```
"swimmers" → sport: "Swimming"
"basketball players" → sport: "Basketball"
"football athletes" → sport: "Football"
```

### **2. Location Patterns**

```
"in Miami" → location: "Miami"
"from Los Angeles" → location: "Los Angeles"
"based in New York" → location: "New York"
```

### **3. Sport Variations**

```
"hoops players" → sport: "Basketball"
"quarterbacks" → sport: "Football", position: "Quarterback"
"soccer stars" → sport: "Soccer"
```

### **4. Position Extraction**

```
"point guards" → position: "Point Guard"
"strikers in soccer" → sport: "Soccer", position: "Striker"
```

### **5. Intent Recognition**

```
"find" → SEARCH
"show me" → SEARCH
"tell me about" → ATHLETE_INFO
"help" → HELP
```

---

## 📊 Real Examples

### **Example 1: Simple Query**

```
User: "find basketball players"

OpenAI Analysis:
- "find" = SEARCH action
- "basketball players" = sport: "Basketball"

Returns:
{
  "action": "SEARCH",
  "searchParams": {
    "filters": {"sport": "Basketball"}
  }
}
```

### **Example 2: Complex Query**

```
User: "show me swimmers in Miami who went to University of Florida"

OpenAI Analysis:
- "show me" = SEARCH action
- "swimmers" = sport: "Swimming"
- "in Miami" = location: "Miami"
- "University of Florida" = education: "University of Florida"

Returns:
{
  "action": "SEARCH",
  "searchParams": {
    "filters": {
      "sport": "Swimming",
      "location": "Miami",
      "education": "University of Florida"
    }
  }
}
```

### **Example 3: Multiple Filters**

```
User: "find veteran basketball players in Los Angeles who are point guards"

OpenAI Analysis:
- "find" = SEARCH
- "veteran" = experience: "veteran"
- "basketball players" = sport: "Basketball"
- "in Los Angeles" = location: "Los Angeles"
- "point guards" = position: "Point Guard"

Returns:
{
  "action": "SEARCH",
  "searchParams": {
    "filters": {
      "sport": "Basketball",
      "location": "Los Angeles",
      "position": "Point Guard",
      "experience": "veteran"
    }
  }
}
```

---

## 🔄 Fallback System

If OpenAI fails, the system uses a **keyword-based fallback**:

```javascript
const getFallbackResponse = (userQuery) => {
  const input = userQuery.toLowerCase();

  // Check for keywords
  if (input.includes("basketball")) {
    return {
      action: "SEARCH",
      filters: { sport: "Basketball" },
    };
  }

  if (input.includes("swim")) {
    return {
      action: "SEARCH",
      filters: { sport: "Swimming" },
    };
  }

  // ... more keyword checks
};
```

**Limitations:**

- ❌ Only matches exact keywords
- ❌ Can't handle complex queries
- ❌ No understanding of context
- ✅ Works when OpenAI is down

---

## 🎯 Key Components

### **1. System Prompt** (Lines 44-95)

- Defines the AI's role
- Lists available filters
- Shows expected format
- Provides examples

### **2. OpenAI API Call** (Lines 97-118)

- Sends prompt + query
- Uses GPT-3.5-turbo model
- Temperature: 0.7 (balanced creativity/consistency)

### **3. Response Parsing** (Lines 176-191)

- Extracts JSON from response
- Handles parse errors
- Returns structured object

### **4. Fallback Handler** (Lines 207-285)

- Keyword matching
- Basic pattern recognition
- Works when OpenAI fails

---

## 💡 Why This Works

### **Advantages:**

1. **Natural Language Understanding** - Handles complex queries
2. **Context Awareness** - Understands intent, not just keywords
3. **Flexible** - Works with variations and synonyms
4. **Robust** - Has fallback system

### **How It's Different from Simple Parsing:**

```
❌ Simple Parsing:
if (query.includes("swimmer")) {
    filters.sport = "Swimming"
}
// Only works for exact word "swimmer"

✅ OpenAI Analysis:
"find swimmers" → sport: "Swimming"
"show me aquatic athletes" → sport: "Swimming"
"competitive swimmers" → sport: "Swimming"
// Understands meaning, not just keywords
```

---

## 🔍 Inside the AI's "Brain"

When OpenAI receives:

```
System: "Extract filters from user queries"
User: "find swimmers in Miami"
```

The AI processes:

1. **Tokenization**: Breaks query into tokens
2. **Understanding**: Recognizes entities and intent
3. **Mapping**: Maps entities to filter categories
4. **Structuring**: Formats as JSON according to instructions

**It's like having a smart assistant that reads your mind!**

---

## 📝 Summary

**How filters are extracted:**

1. **System Prompt** tells OpenAI what to look for
2. **User Query** is sent to OpenAI
3. **OpenAI Analyzes** using natural language understanding
4. **Structured JSON** is returned with extracted filters
5. **Filters are used** to search the database

**The magic is in OpenAI's ability to understand natural language and extract structured data from it!** 🚀
