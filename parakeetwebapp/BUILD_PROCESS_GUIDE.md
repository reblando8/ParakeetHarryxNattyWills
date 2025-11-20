# 🏗️ Parakeet Web App - Complete Build Process Guide

This guide walks you through building the Parakeet Web App from scratch - a social media platform for athletes with AI-powered search capabilities.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Build Process](#step-by-step-build-process)
5. [Architecture Overview](#architecture-overview)
6. [Key Features Implementation](#key-features-implementation)
7. [Deployment](#deployment)

---

## 🎯 Project Overview

**Parakeet** is a social networking platform designed specifically for athletes. It allows athletes to:

- Create profiles with sports information (sport, position, team, location, education, stats)
- Post updates with text and images
- Search for other athletes using filters
- Interact through likes and comments
- Use an AI-powered chatbot for intelligent athlete discovery

**Key Differentiator**: The app uses **RAG (Retrieval-Augmented Generation)** to provide context-aware search assistance powered by OpenAI.

---

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1** - UI framework
- **React Router DOM 6.28.0** - Routing
- **Tailwind CSS 3.4.15** - Styling
- **Firebase 11.2.0** - Authentication, Firestore, Storage
- **OpenAI API** - Embeddings & Chat Completions
- **Ant Design 5.23.4** - UI components
- **React Icons 5.4.0** - Icons
- **GSAP 3.12.7** - Animations
- **Moment.js 2.30.1** - Date formatting
- **React Toastify 11.0.3** - Notifications

### Backend

- **Node.js** - Runtime
- **Express.js** - Server framework (minimal, mostly Firebase)
- **Firebase Admin SDK** (if needed for server-side operations)

### Database & Storage

- **Firebase Firestore** - NoSQL database
- **Google Cloud Storage** (via Firebase Storage SDK) - File storage (images, videos)
  - Note: Firebase Storage is built on Google Cloud Storage buckets

### AI Services

- **OpenAI Embeddings API** (`text-embedding-ada-002`) - Vector embeddings
- **OpenAI Chat API** (`gpt-3.5-turbo-1106`) - Natural language processing

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher) and npm installed
2. **Firebase Account** - Create at [firebase.google.com](https://firebase.google.com)
3. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com)
4. **Code Editor** - VS Code recommended
5. **Git** - For version control

---

## 🚀 Step-by-Step Build Process

### Phase 1: Project Setup

#### Step 1.1: Initialize Project Structure

```bash
# Create root directory
mkdir ParakeetWebApp
cd ParakeetWebApp

# Initialize root package.json
npm init -y

# Create frontend directory
npx create-react-app frontend
cd frontend

# Install dependencies
npm install react-router-dom@^6.28.0
npm install firebase@^11.2.0
npm install tailwindcss@^3.4.15 postcss@^8.4.49 autoprefixer@^10.4.20
npm install antd@^5.23.4
npm install react-icons@^5.4.0
npm install gsap@^3.12.7
npm install moment@^2.30.1
npm install react-toastify@^11.0.3
npm install react-uuid@^2.0.0
npm install react-dropzone@^14.3.8
npm install framer-motion@^12.5.0

# Initialize Tailwind CSS
npx tailwindcss init -p
```

#### Step 1.2: Configure Tailwind CSS

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 1.3: Create Backend Structure

```bash
# From root directory
mkdir -p backend/{config,controllers,models,routes,middlewares}
cd backend
npm init -y
npm install express cors dotenv
```

---

### Phase 2: Firebase Setup

#### Step 2.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it "parakeetwebapp" (or your choice)
4. Enable Google Analytics (optional)

#### Step 2.2: Enable Firebase Services

1. **Authentication**:

   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in

2. **Firestore Database**:

   - Go to Firestore Database
   - Create database in production mode
   - Choose a location (e.g., us-central1)

3. **Storage** (Google Cloud Storage via Firebase):
   - Go to Storage
   - Get started with default rules
   - Note: This creates a Google Cloud Storage bucket that you can also manage in Google Cloud Console

#### Step 2.3: Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the Firebase configuration object

#### Step 2.4: Create Firebase Config File

Create `frontend/src/firebaseConfig.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, app, analytics, firestore, storage };
```

---

### Phase 3: Environment Variables

#### Step 3.1: Create `.env` File

Create `frontend/.env`:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

**Get OpenAI API Key**:

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys
4. Create new secret key
5. Copy and paste into `.env`

---

### Phase 4: Core Application Structure

#### Step 4.1: Create Folder Structure

```
frontend/src/
├── api/
│   ├── authAPI.jsx
│   ├── FirestoreAPI.jsx
│   ├── EmbeddingAPI.jsx
│   ├── OpenAiAPI.jsx
│   └── RAGService.jsx
├── components/
│   ├── common/
│   │   ├── Post.jsx
│   │   ├── ProfileCard/
│   │   ├── ChatBot/
│   │   ├── SearchBar/
│   │   └── ...
│   ├── HomePageComponents/
│   ├── ProfilePageComponents/
│   └── SearchPageComponents/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   └── Search.jsx
├── Layouts/
│   ├── HomeLayout.jsx
│   ├── ProfileLayout.jsx
│   └── SearchLayout.jsx
├── Routes/
│   └── route.jsx
└── Helpers/
    ├── getUniqueID.jsx
    └── UseMoment.jsx
```

#### Step 4.2: Set Up Routing

Create `frontend/src/Routes/route.jsx`:

```javascript
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLayout from "../Layouts/HomeLayout";
import ProfileLayout from "../Layouts/ProfileLayout";
import SearchLayout from "../Layouts/SearchLayout";
import InfoHomeLayout from "../Layouts/InfoHomeLayout";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <HomeLayout /> },
  { path: "/profile", element: <ProfileLayout /> },
  { path: "/profile/:userId", element: <ProfileLayout /> },
  { path: "/search", element: <SearchLayout /> },
  { path: "/", element: <InfoHomeLayout /> },
]);
```

Update `frontend/src/index.jsx`:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/route.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
```

---

### Phase 5: Authentication System

#### Step 5.1: Create Authentication API

Create `frontend/src/api/authAPI.jsx`:

```javascript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const LoginAPI = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const RegisterAPI = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const GoogleSignInAPI = () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleProvider);
};

export const LogoutAPI = async () => {
  await signOut(auth);
};
```

#### Step 5.2: Create Login Page

Create `frontend/src/pages/Login.jsx`:

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginAPI, GoogleSignInAPI } from "../api/authAPI";
import { postUserData } from "../api/FirestoreAPI";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await LoginAPI(email, password);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await GoogleSignInAPI();
      const user = res.user;

      // Check if user exists, if not create profile
      const userData = {
        email: user.email,
        userName: user.displayName || user.email.split("@")[0],
        name: user.displayName || "",
        timeStamp: new Date().toISOString(),
      };

      await postUserData(userData);
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-2 rounded mt-2"
        >
          Sign in with Google
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
```

#### Step 5.3: Create Register Page

Similar structure to Login, but uses `RegisterAPI` and collects additional user information.

---

### Phase 6: Firestore Database API

#### Step 6.1: Create FirestoreAPI

Create `frontend/src/api/FirestoreAPI.jsx` with functions for:

- **Posts**: `postStatus()`, `getStatus()`, `getSingleStatus()`
- **Users**: `postUserData()`, `getCurrentUserData()`, `updateUserData()`, `searchUsers()`
- **Likes**: `likePost()`, `getLikesByPost()`, `checkIfUserLikedPost()`
- **Comments**: `addComment()`, `deleteComment()`, `listenForComments()`
- **Search**: `searchUsers()`, `saveSearchHistory()`, `getRecentSearchHistory()`

**Key Implementation Pattern**:

```javascript
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

let postsRef = collection(firestore, "posts");
let usersRef = collection(firestore, "users");

export const postStatus = async (status, email, userName, userID, file) => {
  try {
    let imageURL = "";

    if (file) {
      // Upload to Google Cloud Storage via Firebase Storage SDK
      const storageRef = ref(
        storage,
        `posts/${userID}/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      imageURL = await getDownloadURL(storageRef);
    }

    const post = {
      status: status,
      timeStamp: new Date().toISOString(),
      email: email,
      userName: userName,
      postID: Date.now().toString(),
      userID: userID,
      imageURL: imageURL,
    };

    await addDoc(postsRef, post);
    toast.success("Post created successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to post!");
  }
};

export const getStatus = (setAllStatus) => {
  onSnapshot(postsRef, (response) => {
    setAllStatus(
      response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  });
};
```

---

### Phase 7: AI Integration - Embedding API

#### Step 7.1: Create EmbeddingAPI

Create `frontend/src/api/EmbeddingAPI.jsx`:

```javascript
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Simple in-memory vector store
class SimpleVectorStore {
  constructor() {
    this.vectors = [];
    this.metadata = [];
  }

  addVector(vector, metadata) {
    this.vectors.push(vector);
    this.metadata.push(metadata);
  }

  search(queryVector, topK = 5) {
    const similarities = this.vectors.map((vector, index) => ({
      similarity: cosineSimilarity(queryVector, vector),
      metadata: this.metadata[index],
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

export const vectorStore = new SimpleVectorStore();

// Create embeddings using OpenAI
export const createEmbeddings = async (text) => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-ada-002",
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
};

// Cosine similarity calculation
export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Index athlete for RAG
export const indexAthleteForRAG = async (athlete) => {
  const text = `${athlete.name || athlete.userName} - ${
    athlete.sport || ""
  } - ${athlete.position || ""} - ${athlete.location || ""} - ${
    athlete.team || ""
  } - ${athlete.bio || ""}`;
  const embedding = await createEmbeddings(text);

  vectorStore.addVector(embedding, {
    athleteId: athlete.id,
    text: text,
    name: athlete.name || athlete.userName,
  });
};

// Search with RAG
export const searchWithRAG = async (query, topK = 5) => {
  const queryEmbedding = await createEmbeddings(query);
  const results = vectorStore.search(queryEmbedding, topK);

  return results.map((result) => ({
    text: result.metadata.text,
    similarity: result.similarity,
    metadata: result.metadata,
  }));
};
```

---

### Phase 8: AI Integration - RAG Service

#### Step 8.1: Create RAGService

Create `frontend/src/api/RAGService.jsx`:

This service combines EmbeddingAPI and OpenAI Chat API to provide intelligent, context-aware responses.

**Key Functions**:

1. **`analyzeUserQueryWithRAG(query, filters, searchResults)`**

   - Uses EmbeddingAPI to find relevant athletes
   - Builds context from RAG results
   - Calls OpenAI to analyze user intent
   - Returns structured response with action and filters

2. **`performRAGSearch(searchParams, currentFilters)`**

   - Executes actual database search
   - Optionally enriches with RAG context
   - Returns search results

3. **`getEnhancedAthleteInfo(athleteName)`**
   - Generates detailed athlete profiles using OpenAI
   - Uses RAG context for more accurate information

**Implementation Pattern**:

```javascript
export const analyzeUserQueryWithRAG = async (
  userQuery,
  currentFilters = {}
) => {
  // Step 1: Get RAG context
  const ragResults = await searchWithRAG(userQuery, 3);
  const ragContext = ragResults.map((r) => r.text).join("\n\n");

  // Step 2: Build system prompt with context
  const systemPrompt = `You are a search assistant for athletes.
    Context: ${ragContext}
    Analyze the user query and return JSON with action and filters.`;

  // Step 3: Call OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery },
      ],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};
```

---

### Phase 9: Chatbot Component

#### Step 9.1: Create ChatPanel Component

Create `frontend/src/components/common/ChatBot/ChatPanel.jsx`:

**Key Features**:

- Message history state
- RAG initialization on mount
- Integration with RAGService
- Profile card display for search results
- Real-time typing indicators

**Implementation Flow**:

```javascript
const handleSendMessage = async () => {
  // Add user message
  setMessages((prev) => [...prev, userMessage]);
  setIsTyping(true);

  // Analyze query with RAG
  const analysis = await analyzeUserQueryWithRAG(inputText, currentFilters);

  if (analysis.action === "SEARCH") {
    // Perform search
    const searchResults = await performRAGSearch(analysis.searchParams);

    // Display results
    setMessages((prev) => [
      ...prev,
      {
        text: analysis.response,
        isBot: true,
        searchResults: searchResults.searchResults,
      },
    ]);
  }

  setIsTyping(false);
};
```

---

### Phase 10: Core UI Components

#### Step 10.1: Post Component

Create `frontend/src/components/common/Post.jsx`:

- Display post content, images, author info
- Like button functionality
- Comment section
- Timestamp formatting

#### Step 10.2: Profile Card Component

Create `frontend/src/components/common/ProfileCard/ProfileCard.jsx`:

- Display athlete information
- Edit functionality
- Image upload
- Stats display

#### Step 10.3: Search Bar Component

Create `frontend/src/components/common/SearchBar/SearchBar.jsx`:

- Text input for search
- Filter dropdowns (sport, position, location, etc.)
- Integration with FirestoreAPI.searchUsers()

---

### Phase 11: Page Layouts

#### Step 11.1: Home Layout

Create `frontend/src/Layouts/HomeLayout.jsx`:

- Three-column layout (Left sidebar, Center feed, Right sidebar)
- Post creation form
- Feed of posts
- User suggestions

#### Step 11.2: Profile Layout

Create `frontend/src/Layouts/ProfileLayout.jsx`:

- Profile header
- User posts
- Edit profile functionality

#### Step 11.3: Search Layout

Create `frontend/src/Layouts/SearchLayout.jsx`:

- Search bar with filters
- Results grid
- Chatbot integration

---

### Phase 12: Firestore Security Rules

#### Step 12.1: Configure Firestore Rules

Go to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any user, but only update their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Posts: read all, write authenticated
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.userID == request.auth.uid;

      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow delete: if request.auth != null &&
          resource.data.userID == request.auth.uid;
      }
    }

    // Likes: read all, write authenticated
    match /likes/{likeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Step 12.2: Configure Storage Rules

Go to Firebase Console → Storage → Rules:

**Note**: Firebase Storage uses Google Cloud Storage buckets. These rules control access to your GCS bucket.

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /profilePictures/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Additional Google Cloud Storage Management**:

- You can also manage your storage bucket directly in [Google Cloud Console](https://console.cloud.google.com/storage)
- Set up lifecycle policies for automatic cleanup of old files
- Configure CORS rules if needed for direct browser access
- Monitor storage usage and costs

---

### Phase 13: Testing & Refinement

#### Step 13.1: Test Authentication Flow

- Register new user
- Login with email/password
- Google sign-in
- Logout

#### Step 13.2: Test Post Creation

- Create text post
- Create post with image
- View posts in feed
- Like/unlike posts
- Add comments

#### Step 13.3: Test Search Functionality

- Text search
- Filter by sport, location, etc.
- Combined filters
- Search history

#### Step 13.4: Test Chatbot

- Natural language queries
- RAG-powered responses
- Search result display
- Athlete information requests

---

### Phase 14: Deployment

#### Step 14.1: Build Frontend

```bash
cd frontend
npm run build
```

#### Step 14.2: Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

#### Step 14.3: Environment Variables

For production, set environment variables in your hosting platform or use Firebase Functions for server-side operations.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  (React Components: Home, Profile, Search, Chat)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  - authAPI.jsx (Firebase Auth)                          │
│  - FirestoreAPI.jsx (Database operations)               │
│  - EmbeddingAPI.jsx (Vector embeddings)                 │
│  - RAGService.jsx (AI orchestration)                   │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐            ┌──────────────────────┐
│   Firebase   │            │    OpenAI API        │
│  - Auth      │            │  - Embeddings        │
│  - Firestore │            │  - Chat Completions  │
│  - Storage   │            └──────────────────────┘
└──────────────┘
```

---

## 🔑 Key Features Implementation

### 1. RAG-Powered Search

**How it works**:

1. User query → EmbeddingAPI creates vector
2. Vector search finds similar athletes
3. Context sent to OpenAI
4. OpenAI extracts filters and intent
5. Database search executed
6. Results displayed with context

### 2. Real-time Updates

**Firestore Listeners**:

- `onSnapshot()` for posts, comments, likes
- Automatic UI updates when data changes
- No manual refresh needed

### 3. Image Upload

**Firebase Storage**:

- Upload to Storage
- Get download URL
- Store URL in Firestore
- Display in components

### 4. Search Filters

**Multi-criteria Search**:

- Text search (username, email)
- Filter by sport, position, location, team, education
- Experience level filtering
- Combined filters

---

## 📝 Important Notes

1. **OpenAI API Costs**: Monitor usage - embeddings are cheap, chat completions cost more
2. **Firestore Queries**: Use indexes for complex queries (Firebase will prompt you)
3. **Vector Store**: Currently in-memory - consider persistent storage for production
4. **Security**: Always validate user input, use Firestore rules
5. **Performance**: Limit RAG initialization to first 50-100 athletes initially

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🐛 Common Issues & Solutions

### Issue: OpenAI API Key not working

**Solution**: Check `.env` file, ensure `REACT_APP_` prefix, restart dev server

### Issue: Firestore permission denied

**Solution**: Check security rules, ensure user is authenticated

### Issue: Images not uploading

**Solution**:

- Check Firebase Storage rules
- Verify file size limits (default is 32MB for Firebase Storage)
- Check Google Cloud Storage bucket permissions in GCP Console
- Ensure CORS is configured if uploading from browser directly

### Issue: RAG not finding athletes

**Solution**: Ensure `initializeRAG()` is called, check vector store has data

---

## 🚀 Next Steps

1. Add video upload support
2. Implement notifications
3. Add direct messaging
4. Enhance RAG with persistent vector database (Pinecone, Weaviate)
5. Add analytics
6. Implement caching for better performance
7. Add unit and integration tests

---

**Congratulations!** You now have a complete guide to build the Parakeet Web App. Follow each phase step-by-step, and you'll have a fully functional athlete social networking platform with AI-powered search capabilities! 🎉
