# Redux Usage Guide

## ✅ Redux Setup Complete

Redux has been successfully reimplemented with:

- ✅ Store configured (`store/store.js`)
- ✅ Auth slice (`store/slices/authSlice.js`)
- ✅ Posts slice (`store/slices/postsSlice.js`)
- ✅ Provider wrapped in `index.jsx`

## 📖 How to Use Redux in Components

### **1. Using Auth State**

```javascript
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, setUser } from "../store/slices/authSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Login
  const handleLogin = async () => {
    dispatch(loginUser({ email: "user@example.com", password: "password" }));
  };

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Set user manually (e.g., from Firebase auth state)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
}
```

### **2. Using Posts State**

```javascript
import { useSelector, useDispatch } from "react-redux";
import {
  setPosts,
  createPost,
  likePostAsync,
  setComments,
} from "../store/slices/postsSlice";
import { getStatus, listenForComments } from "../api/FirestoreAPI";

function PostsComponent() {
  const dispatch = useDispatch();
  const { posts, comments, loading } = useSelector((state) => state.posts);

  // Load posts from Firestore
  useEffect(() => {
    getStatus((allPosts) => {
      dispatch(setPosts(allPosts));
    });
  }, [dispatch]);

  // Create a post
  const handleCreatePost = async () => {
    dispatch(
      createPost({
        status: "Hello world!",
        email: "user@example.com",
        userName: "John Doe",
        userID: "user123",
        files: null,
      })
    );
  };

  // Like a post
  const handleLike = (postID) => {
    dispatch(likePostAsync({ userID: "user123", postID }));
  };

  // Listen for comments (real-time)
  useEffect(() => {
    if (postID) {
      const unsubscribe = listenForComments(postID, (comments) => {
        dispatch(setComments({ postID, comments }));
      });
      return () => unsubscribe();
    }
  }, [postID, dispatch]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.status}</p>
          <button onClick={() => handleLike(post.id)}>Like</button>
          {comments[post.id] && (
            <div>
              {comments[post.id].map((comment) => (
                <p key={comment.id}>{comment.text}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### **3. Available Actions**

#### **Auth Actions:**

- `loginUser({ email, password })` - Login user
- `registerUser({ email, password })` - Register user
- `googleSignIn()` - Google sign in
- `logoutUser()` - Logout user
- `setUser(user)` - Set user manually
- `clearError()` - Clear error state

#### **Posts Actions:**

- `createPost({ status, email, userName, userID, files })` - Create post
- `likePostAsync({ userID, postID })` - Like/unlike post
- `addCommentAsync({ postID, userID, userName, text })` - Add comment
- `deleteCommentAsync({ postID, commentID })` - Delete comment
- `setPosts(posts)` - Set posts array
- `setComments({ postID, comments })` - Set comments for a post
- `clearError()` - Clear error state

### **4. State Structure**

```javascript
// Auth State
{
  auth: {
    user: null | UserObject,
    loading: boolean,
    error: null | string
  }
}

// Posts State
{
  posts: {
    posts: Post[],
    comments: { [postID]: Comment[] },
    loading: boolean,
    error: null | string
  }
}
```

## 🔧 Integration with Firebase

### **Syncing Firebase Auth with Redux:**

```javascript
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setUser } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

function AuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Optionally merge with Firestore user data
        getCurrentUserData((firestoreUser) => {
          const mergedUser = { ...user, ...firestoreUser };
          dispatch(setUser(mergedUser));
        });
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
```

### **Syncing Firestore Posts with Redux:**

```javascript
import { getStatus } from "../api/FirestoreAPI";
import { setPosts } from "../store/slices/postsSlice";

useEffect(() => {
  getStatus((allPosts) => {
    dispatch(setPosts(allPosts));
  });
}, [dispatch]);
```

## 📝 Notes

- **Firebase Objects**: The store is configured with `serializableCheck: false` to handle Firebase objects
- **Real-time Updates**: Use Firestore listeners (`onSnapshot`) and dispatch Redux actions when data changes
- **Async Actions**: All async operations use `createAsyncThunk` for proper loading/error states
