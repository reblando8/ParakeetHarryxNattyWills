# 🔧 System Documentation

## Parakeet - Technical System Documentation

**Version:** 1.0.0  
**Last Updated:** 2024

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema](#3-database-schema)
4. [API Documentation](#4-api-documentation)
5. [State Management](#5-state-management)
6. [Security Architecture](#6-security-architecture)
7. [Deployment](#7-deployment)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│  React 18.3.1 + Redux Toolkit + React Router DOM        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│   Firebase   │         │    OpenAI     │
│   Services   │         │     APIs      │
│              │         │               │
│ • Auth       │         │ • Embeddings  │
│ • Firestore  │         │ • Chat        │
│ • Storage    │         │               │
└──────────────┘         └──────────────┘
```

### 1.2 Component Architecture

**Layered Structure:**

- **Presentation Layer:** React Components
- **State Layer:** Redux Store
- **API Layer:** Service modules (authAPI, FirestoreAPI, etc.)
- **External Services:** Firebase, OpenAI

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology       | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| React            | 18.3.1  | UI Framework         |
| Redux Toolkit    | 2.10.1  | State Management     |
| React Router DOM | 6.28.0  | Client-side Routing  |
| Tailwind CSS     | 3.4.15  | Styling              |
| Firebase         | 11.2.0  | Backend Services     |
| GSAP             | 3.12.7  | Animations           |
| Framer Motion    | Latest  | Component Animations |

### 2.2 Backend Services

| Service           | Purpose           | Integration                           |
| ----------------- | ----------------- | ------------------------------------- |
| Firebase Auth     | Authentication    | Email/Password, Google OAuth          |
| Firestore         | Database          | Real-time NoSQL database              |
| Firebase Storage  | File Storage      | Images, videos (Google Cloud Storage) |
| OpenAI Embeddings | Vector Generation | text-embedding-ada-002                |
| OpenAI Chat       | AI Responses      | gpt-3.5-turbo-1106                    |

---

## 3. Database Schema

### 3.1 Firestore Collections

#### **users Collection**

```javascript
{
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  sport: "Basketball",
  position: "Point Guard",
  team: "Miami Heat",
  location: "Miami, FL",
  education: "University of Miami",
  experience: "Senior",
  height: "6'2",
  weight: "185 lbs",
  achievements: "All-Star 2023",
  careerHighlights: "Led team to championship",
  stats: "15 PPG, 8 APG",
  bio: "Professional basketball player...",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

#### **posts Collection**

```javascript
{
  id: "post456",
  status: "Just won the championship!",
  timeStamp: "January 15, 2024 10:30 AM",
  email: "john@example.com",
  userName: "John Doe",
  postID: "unique-post-id",
  userID: "user123",
  imageURL: "https://storage.googleapis.com/...",
  createdAt: Timestamp
}
```

#### **likes Collection**

```javascript
{
  id: "user123_post456",
  userID: "user123",
  postID: "post456",
  createdAt: Timestamp
}
```

#### **posts/{postID}/comments Subcollection**

```javascript
{
  id: "comment789",
  userID: "user123",
  userName: "John Doe",
  text: "Great post!",
  timeStamp: Timestamp
}
```

#### **searchHistory Collection**

```javascript
{
  id: "search123",
  userID: "user123",
  queryText: "basketball players",
  filters: {
    sport: "Basketball",
    location: "Miami"
  },
  timestamp: Timestamp
}
```

---

## 4. API Documentation

### 4.1 Authentication API (`authAPI.jsx`)

#### **LoginAPI(email, password)**

- **Method:** Firebase `signInWithEmailAndPassword`
- **Returns:** Promise<UserCredential>
- **Usage:** `await LoginAPI(email, password)`

#### **RegisterAPI(email, password)**

- **Method:** Firebase `createUserWithEmailAndPassword`
- **Returns:** Promise<UserCredential>
- **Usage:** `await RegisterAPI(email, password)`

#### **GoogleSignInAPI()**

- **Method:** Firebase `signInWithPopup` with GoogleAuthProvider
- **Returns:** Promise<UserCredential>
- **Usage:** `await GoogleSignInAPI()`

#### **LogoutAPI()**

- **Method:** Firebase `signOut`
- **Returns:** Promise<void>
- **Usage:** `await LogoutAPI()`

---

### 4.2 Firestore API (`FirestoreAPI.jsx`)

#### **searchUsers(query, filters)**

- **Purpose:** Search athletes with text and filters
- **Parameters:**
  - `query` (string): Text search term
  - `filters` (object): Filter criteria
- **Returns:** Promise<Array<Athlete>>
- **Usage:** `await searchUsers("John", { sport: "Basketball" })`

#### **postStatus(status, email, userName, userID, file)**

- **Purpose:** Create a new post
- **Parameters:**
  - `status` (string): Post content
  - `email`, `userName`, `userID`: Author info
  - `file` (File, optional): Image file
- **Returns:** Promise<void>
- **Usage:** `await postStatus("Hello!", email, name, id, imageFile)`

#### **getStatus(setAllStatus)**

- **Purpose:** Get all posts with real-time listener
- **Parameters:** `setAllStatus` (function): Callback for updates
- **Returns:** Unsubscribe function
- **Usage:** `getStatus((posts) => dispatch(setPosts(posts)))`

#### **likePost(userID, postID)**

- **Purpose:** Like or unlike a post
- **Parameters:** `userID`, `postID`
- **Returns:** Promise<void>
- **Usage:** `await likePost(userID, postID)`

#### **addComment(postID, userID, userName, text)**

- **Purpose:** Add comment to post
- **Parameters:** Post info and comment text
- **Returns:** Promise<void>
- **Usage:** `await addComment(postID, userID, name, "Great!")`

---

### 4.3 Embedding API (`EmbeddingAPI.jsx`)

#### **createEmbeddings(text)**

- **Purpose:** Convert text to vector embedding
- **Parameters:** `text` (string)
- **Returns:** Promise<Array<number>> (1536 dimensions)
- **Usage:** `await createEmbeddings("basketball player")`

#### **cosineSimilarity(vecA, vecB)**

- **Purpose:** Calculate similarity between vectors
- **Parameters:** Two vectors (arrays of numbers)
- **Returns:** number (-1 to 1)
- **Usage:** `cosineSimilarity(queryVec, athleteVec)`

#### **searchWithRAG(query, topK)**

- **Purpose:** Semantic search using RAG
- **Parameters:**
  - `query` (string): Search query
  - `topK` (number): Number of results
- **Returns:** Promise<Array<{text, similarity, metadata}>>
- **Usage:** `await searchWithRAG("tall point guard", 5)`

---

### 4.4 RAG Service API (`RAGService.jsx`)

#### **analyzeUserQueryWithRAG(userQuery, currentFilters, recentResults)**

- **Purpose:** Analyze user query with RAG context
- **Parameters:**
  - `userQuery` (string): User's natural language query
  - `currentFilters` (object): Current active filters
  - `recentResults` (array): Recent search results
- **Returns:** Promise<{action, response, searchParams, ragContext}>
- **Usage:** `await analyzeUserQueryWithRAG("find basketball players", {}, [])`

#### **performRAGSearch(searchParams, currentFilters)**

- **Purpose:** Execute search with RAG enhancement
- **Parameters:**
  - `searchParams` (object): Search parameters
  - `currentFilters` (object): Filter criteria
- **Returns:** Promise<{searchResults, ragContext, searchParams}>
- **Usage:** `await performRAGSearch({query: "", filters: {sport: "Basketball"}}, {})`

---

## 5. State Management

### 5.1 Redux Store Structure

```javascript
{
  auth: {
    user: null | UserObject,
    loading: boolean,
    error: null | string
  },
  posts: {
    posts: Array<Post>,
    comments: {
      [postID]: Array<Comment>
    },
    loading: boolean,
    error: null | string
  }
}
```

### 5.2 Auth Slice Actions

- `loginUser({ email, password })` - Async thunk for login
- `registerUser({ email, password })` - Async thunk for registration
- `googleSignIn()` - Async thunk for Google OAuth
- `logoutUser()` - Async thunk for logout
- `setUser(user)` - Sync action to set user
- `clearError()` - Clear error state

### 5.3 Posts Slice Actions

- `createPost({ status, email, userName, userID, files })` - Async thunk
- `likePostAsync({ userID, postID })` - Async thunk
- `addCommentAsync({ postID, userID, userName, text })` - Async thunk
- `deleteCommentAsync({ postID, commentID })` - Async thunk
- `setPosts(posts)` - Sync action to set posts array
- `setComments({ postID, comments })` - Sync action to set comments

---

## 6. Security Architecture

### 6.1 Authentication Security

- **Firebase Auth:** Server-side authentication
- **Session Management:** Firebase handles sessions
- **OAuth:** Google Sign-In with secure token exchange
- **Protected Routes:** Client-side route protection with auth checks

### 6.2 Data Security

**Firestore Security Rules (Example):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.userID == request.auth.uid;
    }
  }
}
```

### 6.3 API Key Security

- **Environment Variables:** API keys in `.env` file
- **Client-Side:** Only public Firebase config exposed
- **Server-Side:** OpenAI API key should be server-side (future)

---

## 7. Deployment

### 7.1 Build Process

```bash
# Install dependencies
cd frontend
npm install

# Build for production
npm run build

# Output: frontend/build/
```

### 7.2 Environment Variables

**Required:**

- `REACT_APP_OPENAI_API_KEY` - OpenAI API key
- Firebase config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)

**File:** `.env` (not committed to git)

### 7.3 Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project set up
- [ ] Firestore security rules deployed
- [ ] Firebase Storage rules configured
- [ ] Build completes without errors
- [ ] All routes accessible
- [ ] Authentication works
- [ ] Real-time features work
- [ ] AI chatbot functional

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

- **Code Splitting:** Route-based code splitting
- **Lazy Loading:** Components load on demand
- **Memoization:** Redux selectors memoized
- **Image Optimization:** Compressed images, lazy loading
- **Bundle Size:** Tree shaking, minification

### 8.2 Monitoring

- **Web Vitals:** Core Web Vitals tracking
- **Redux DevTools:** State inspection
- **Firebase Analytics:** User behavior tracking
- **Console Logging:** Error tracking

---

## 9. Error Handling

### 9.1 Error Types

- **Authentication Errors:** Displayed via toast notifications
- **API Errors:** Handled with try-catch, user-friendly messages
- **Network Errors:** Retry logic, offline detection
- **Validation Errors:** Form validation, inline messages

### 9.2 Error Recovery

- **Fallback UI:** Error boundaries for component errors
- **Retry Mechanisms:** Automatic retry for failed API calls
- **User Feedback:** Clear error messages with actions

---

## 10. Future Enhancements

### 10.1 Technical Improvements

- Migrate vector store to dedicated vector database (Pinecone, Weaviate)
- Implement server-side API proxy for OpenAI (hide API keys)
- Add comprehensive test coverage
- Implement pagination for large datasets
- Add caching layer for frequently accessed data

### 10.2 Feature Additions

- Direct messaging between users
- Video upload and playback
- Advanced analytics dashboard
- Notification system
- Email notifications
- Role-based access control

---

## Document Control

**Version History:**

- v1.0.0 - Initial system documentation

**Last Updated:** 2024
