import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postStatus, getStatus, likePost, addComment, deleteComment, getCommentsForPost } from '../../api/FirestoreAPI';

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ status, email, userName, userID, files }, { rejectWithValue }) => {
    try {
      await postStatus(status, email, userName, userID, files);
      return { status, email, userName, userID };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async ({ userID, postID }, { rejectWithValue }) => {
    try {
      await likePost(userID, postID);
      return { userID, postID };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getComments = createAsyncThunk(
  'posts/getComments',
  async ({ postID }, { rejectWithValue }) => {
    try {
      const comments = await getCommentsForPost(postID);
      return { postID, comments };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  'posts/addComment',
  async ({ postID, userID, userName, text }, { rejectWithValue }) => {
    try {
      await addComment(postID, userID, userName, text);
      return { postID, userID, userName, text };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'posts/deleteComment',
  async ({ postID, commentID }, { rejectWithValue }) => {
    try {
      await deleteComment(postID, commentID);
      return { postID, commentID };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    comments: {},  // Store comments by postID
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setComments: (state, action) => {
      const { postID, comments } = action.payload;
      state.comments[postID] = comments;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(getComments.fulfilled, (state, action) => {
        const { postID, comments } = action.payload;
        state.comments[postID] = comments;
      })
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePostAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add Comment
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Comment
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setPosts, clearError } = postsSlice.actions;
export default postsSlice.reducer;
