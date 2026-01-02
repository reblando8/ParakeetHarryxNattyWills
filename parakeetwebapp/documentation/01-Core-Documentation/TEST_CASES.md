# 🧪 Test Cases Documentation

## Parakeet - Comprehensive Test Suite

**Version:** 1.0.0  
**Last Updated:** 2024

---

## Test Case Format

Each test case includes:

- **Test ID:** Unique identifier
- **Test Name:** Descriptive name
- **Priority:** High, Medium, or Low
- **Preconditions:** Required setup
- **Test Steps:** Step-by-step instructions
- **Expected Result:** What should happen
- **Actual Result:** (To be filled during testing)
- **Status:** Pass/Fail/Blocked

---

## 1. Authentication Test Cases

### TC-AUTH-001: User Registration with Email and Password

**Priority:** High  
**Preconditions:** User is on registration page, not logged in

**Test Steps:**

1. Navigate to `/register`
2. Enter valid full name: "John Doe"
3. Enter valid email: "john.doe@example.com"
4. Enter valid password: "password123"
5. Click "Agree and Join"

**Expected Result:**

- User account is created
- Success toast notification appears
- User is redirected to `/home`
- User is logged in
- Redux auth state contains user data
- User profile is created in Firestore

**Test Data:**

- Name: "John Doe"
- Email: "john.doe@example.com"
- Password: "password123"

---

### TC-AUTH-002: User Registration with Google OAuth

**Priority:** High  
**Preconditions:** User is on registration page, not logged in

**Test Steps:**

1. Navigate to `/register`
2. Click "Sign Up with Google"
3. Select Google account in popup
4. Grant permissions

**Expected Result:**

- User account is created with Google credentials
- Success toast notification appears
- User is redirected to `/home`
- User is logged in
- Google account information is stored

---

### TC-AUTH-003: User Login with Email and Password

**Priority:** High  
**Preconditions:** User account exists

**Test Steps:**

1. Navigate to `/login`
2. Enter registered email: "john.doe@example.com"
3. Enter correct password: "password123"
4. Click "Log In to Parakeet"

**Expected Result:**

- Success toast notification appears
- User is redirected to `/home`
- User is logged in
- Redux auth state contains user data
- Session persists after page refresh

---

### TC-AUTH-004: User Login with Invalid Credentials

**Priority:** High  
**Preconditions:** User account exists

**Test Steps:**

1. Navigate to `/login`
2. Enter registered email: "john.doe@example.com"
3. Enter incorrect password: "wrongpassword"
4. Click "Log In to Parakeet"

**Expected Result:**

- Error toast notification appears: "Please Check Your Credentials"
- User remains on login page
- User is not logged in
- Redux auth state shows error

---

### TC-AUTH-005: User Logout

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Navigate to any authenticated page
2. Click profile menu (top right or sidebar)
3. Click "Logout"

**Expected Result:**

- Success toast notification appears
- User is redirected to `/login`
- User session is terminated
- Redux auth state is cleared (user = null)
- Protected pages are no longer accessible

---

### TC-AUTH-006: Protected Route Access (Unauthenticated)

**Priority:** High  
**Preconditions:** User is not logged in

**Test Steps:**

1. Navigate directly to `/home`
2. Observe behavior

**Expected Result:**

- User is redirected to `/login`
- Cannot access protected page
- Login page displays

---

### TC-AUTH-007: Protected Route Access (Authenticated)

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Navigate to `/home`
2. Observe behavior

**Expected Result:**

- User can access the page
- Home page content displays
- No redirect occurs

---

### TC-AUTH-008: Session Persistence

**Priority:** Medium  
**Preconditions:** User is logged in

**Test Steps:**

1. Log in successfully
2. Refresh the page (F5 or Ctrl+R)
3. Observe behavior

**Expected Result:**

- User remains logged in after refresh
- Redux state is restored
- No redirect to login page
- User data is still accessible

---

## 2. Profile Management Test Cases

### TC-PROF-001: View Own Profile

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Navigate to `/profile`
2. Observe profile display

**Expected Result:**

- Profile displays all user information
- Edit button is visible (top right)
- User's posts are displayed
- All profile fields are populated

---

### TC-PROF-002: Edit Profile

**Priority:** High  
**Preconditions:** User is logged in, viewing own profile

**Test Steps:**

1. Navigate to `/profile`
2. Click "Edit" button
3. Update "About Me" field: "Updated bio text"
4. Update "Sport" field: "Basketball"
5. Click "Save Changes"

**Expected Result:**

- Edit form displays with current values
- Changes are saved to Firestore
- Success toast notification appears
- Profile view displays updated information
- Redux state updates with new data

---

### TC-PROF-003: View Other User's Profile

**Priority:** High  
**Preconditions:** User is logged in, multiple users exist

**Test Steps:**

1. Navigate to `/search`
2. Search for an athlete
3. Click on a search result profile card
4. Observe profile display

**Expected Result:**

- Other user's profile displays
- Edit button is NOT visible (not own profile)
- Other user's information is displayed
- Other user's posts are shown
- Can navigate back to search

---

### TC-PROF-004: Profile Field Validation

**Priority:** Medium  
**Preconditions:** User is logged in, in edit mode

**Test Steps:**

1. Navigate to `/profile`
2. Click "Edit"
3. Clear required field (Name)
4. Click "Save Changes"

**Expected Result:**

- Validation error appears
- Changes are not saved
- User remains in edit mode
- Error message is clear

---

## 3. Social Features Test Cases

### TC-SOC-001: Create Text Post

**Priority:** High  
**Preconditions:** User is logged in, on home page

**Test Steps:**

1. Navigate to `/home`
2. Click "Start a post"
3. Enter post text: "This is my first post!"
4. Click "Post"

**Expected Result:**

- Modal opens for post creation
- Post is saved to Firestore
- Success toast notification appears
- Post appears in feed immediately
- Post shows correct author and timestamp
- Redux posts state updates

---

### TC-SOC-002: Create Post with Image

**Priority:** Medium  
**Preconditions:** User is logged in, on home page

**Test Steps:**

1. Navigate to `/home`
2. Click "Start a post"
3. Enter post text: "Check out this image!"
4. Click "Photo" button
5. Select an image file
6. Click "Post"

**Expected Result:**

- Image uploads to Firebase Storage
- Post is created with image URL
- Post displays with image in feed
- Image is visible and properly sized

---

### TC-SOC-003: View Posts in Feed

**Priority:** High  
**Preconditions:** User is logged in, posts exist

**Test Steps:**

1. Navigate to `/home`
2. Observe post feed

**Expected Result:**

- Posts display in chronological order
- Each post shows:
  - Author name (clickable)
  - Timestamp
  - Post content
  - Like button and count
  - Comment button
- Posts load from Redux store

---

### TC-SOC-004: Like a Post

**Priority:** Medium  
**Preconditions:** User is logged in, posts exist

**Test Steps:**

1. Navigate to `/home`
2. Find a post
3. Click the heart icon (like button)
4. Observe like count and button state

**Expected Result:**

- Heart icon turns red (filled)
- Like count increases by 1
- Like is saved to Firestore
- Redux action dispatches successfully
- Like persists after page refresh

---

### TC-SOC-005: Unlike a Post

**Priority:** Medium  
**Preconditions:** User is logged in, has liked a post

**Test Steps:**

1. Navigate to `/home`
2. Find a post you've liked (red heart)
3. Click the heart icon again
4. Observe like count and button state

**Expected Result:**

- Heart icon turns gray (outline)
- Like count decreases by 1
- Like is removed from Firestore
- Redux action dispatches successfully

---

### TC-SOC-006: Add Comment to Post

**Priority:** Medium  
**Preconditions:** User is logged in, posts exist

**Test Steps:**

1. Navigate to `/home`
2. Find a post
3. Click "Comment" button
4. Comment section expands
5. Type comment: "Great post!"
6. Click "Post" button

**Expected Result:**

- Comment section expands
- Comment is saved to Firestore subcollection
- Comment appears immediately in list
- Comment shows author name and text
- Redux comments state updates
- Comment persists after page refresh

---

### TC-SOC-007: Delete Own Comment

**Priority:** Medium  
**Preconditions:** User is logged in, has commented on a post

**Test Steps:**

1. Navigate to `/home`
2. Find a post with your comment
3. Click "Comment" to expand
4. Find your comment
5. Click "Delete" next to your comment

**Expected Result:**

- Comment is removed from Firestore
- Comment disappears from list immediately
- Redux comments state updates
- Delete button only appears on own comments

---

### TC-SOC-008: Real-Time Post Updates

**Priority:** High  
**Preconditions:** Two users logged in, same browser or different browsers

**Test Steps:**

1. User A creates a new post
2. User B observes feed (without refreshing)

**Expected Result:**

- User B sees new post appear automatically
- No page refresh needed
- Post appears in real-time
- Firestore listener updates Redux state

---

## 4. Search Functionality Test Cases

### TC-SRCH-001: Text Search by Name

**Priority:** High  
**Preconditions:** User is logged in, athletes exist in database

**Test Steps:**

1. Navigate to `/search`
2. Enter athlete name in search bar: "John"
3. Press Enter or wait for results

**Expected Result:**

- Search executes
- Results display matching athletes
- Results show profile cards with names
- Search is case-insensitive
- Results update as user types

---

### TC-SRCH-002: Filter by Sport

**Priority:** High  
**Preconditions:** User is logged in, athletes with different sports exist

**Test Steps:**

1. Navigate to `/search`
2. In filter panel, select "Sport" = "Basketball"
3. Observe results

**Expected Result:**

- Results filter to show only Basketball athletes
- Results update automatically
- Filter persists during session
- Clear indication of active filter

---

### TC-SRCH-003: Multiple Filters Combined

**Priority:** High  
**Preconditions:** User is logged in, diverse athlete data exists

**Test Steps:**

1. Navigate to `/search`
2. Set Sport = "Basketball"
3. Set Location = "Miami"
4. Set Position = "Point Guard"
5. Observe results

**Expected Result:**

- Results show only athletes matching ALL filters
- Results update as each filter is applied
- All active filters are visible
- Results are accurate

---

### TC-SRCH-004: Search History

**Priority:** Medium  
**Preconditions:** User is logged in, has performed searches

**Test Steps:**

1. Navigate to `/search`
2. Perform a search with filters
3. Observe right sidebar
4. Click on a previous search in history

**Expected Result:**

- Search history displays on right sidebar
- History shows query and filters
- Clicking history item repeats the search
- Results match previous search
- History is limited to recent searches

---

### TC-SRCH-005: Clear Search

**Priority:** Medium  
**Preconditions:** User is logged in, has active search/filters

**Test Steps:**

1. Navigate to `/search`
2. Apply filters and perform search
3. Clear search text
4. Remove all filters
5. Observe results

**Expected Result:**

- Search text clears
- Filters can be removed
- Results update to show all athletes (or empty if no query)
- No errors occur

---

## 5. AI Chatbot Test Cases

### TC-AI-001: Basic Natural Language Search

**Priority:** High  
**Preconditions:** User is logged in, on search page, chatbot initialized

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot (click chat icon)
3. Type: "Find me basketball players"
4. Press Enter or click send
5. Observe response and results

**Expected Result:**

- Chatbot responds with acknowledgment
- Search executes with sport filter = "Basketball"
- Results display basketball players
- Response is helpful and clear

---

### TC-AI-002: Complex Multi-Filter Query

**Priority:** High  
**Preconditions:** User is logged in, chatbot initialized

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot
3. Type: "Find basketball players in Miami who went to Duke"
4. Press Enter
5. Observe response and results

**Expected Result:**

- Chatbot extracts all filters:
  - Sport: Basketball
  - Location: Miami
  - Education: Duke
- Search executes with all filters
- Results match all criteria
- Response explains what was found

---

### TC-AI-003: RAG Context Retrieval

**Priority:** High  
**Preconditions:** User is logged in, athletes indexed in vector store

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot
3. Type: "Find me tall point guards"
4. Press Enter
5. Check browser console for RAG results

**Expected Result:**

- RAG searches vector store
- Finds semantically similar athletes (by meaning, not keywords)
- Context is injected into AI prompt
- AI response references real athletes from database
- No hallucinations (made-up athletes)

---

### TC-AI-004: Follow-Up Question

**Priority:** Medium  
**Preconditions:** User is logged in, has had a conversation with chatbot

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot
3. Type: "Find basketball players"
4. Wait for results
5. Type: "What about in Miami?"
6. Observe response

**Expected Result:**

- Chatbot understands context from previous query
- Applies location filter to previous search
- Results show basketball players in Miami
- Conversation flows naturally

---

### TC-AI-005: Help Request

**Priority:** Medium  
**Preconditions:** User is logged in, chatbot initialized

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot
3. Type: "How do filters work?"
4. Press Enter
5. Observe response

**Expected Result:**

- Chatbot provides helpful explanation
- Lists available filters
- Explains how to use filters
- May provide examples
- Response is clear and educational

---

### TC-AI-006: Chatbot Error Handling

**Priority:** Medium  
**Preconditions:** User is logged in, chatbot initialized

**Test Steps:**

1. Navigate to `/search`
2. Open chatbot
3. Type: "asdfghjkl" (nonsensical input)
4. Press Enter
5. Observe response

**Expected Result:**

- Chatbot handles error gracefully
- Provides helpful response or asks for clarification
- No application crash
- User can continue conversation

---

## 6. Real-Time Updates Test Cases

### TC-RT-001: Real-Time Post Creation

**Priority:** High  
**Preconditions:** Two users logged in (different browsers/devices)

**Test Steps:**

1. User A creates a new post
2. User B observes feed (no refresh)

**Expected Result:**

- User B sees new post appear automatically
- Post appears within 1-2 seconds
- No page refresh needed
- Firestore listener triggers Redux update

---

### TC-RT-002: Real-Time Like Updates

**Priority:** Medium  
**Preconditions:** Two users logged in, post exists

**Test Steps:**

1. User A likes a post
2. User B observes the same post (no refresh)

**Expected Result:**

- User B sees like count update automatically
- Update happens within 1 second
- No page refresh needed
- Real-time synchronization works

---

### TC-RT-003: Real-Time Comment Updates

**Priority:** Medium  
**Preconditions:** Two users logged in, post exists

**Test Steps:**

1. User A adds a comment to a post
2. User B has comment section open (no refresh)

**Expected Result:**

- User B sees new comment appear automatically
- Comment appears within 1-2 seconds
- No page refresh needed
- Real-time synchronization works

---

## 7. Redux State Management Test Cases

### TC-REDUX-001: Auth State Update on Login

**Priority:** High  
**Preconditions:** User is not logged in

**Test Steps:**

1. Open Redux DevTools
2. Navigate to `/login`
3. Log in successfully
4. Observe Redux state

**Expected Result:**

- `auth.user` is populated with user data
- `auth.loading` changes from true to false
- `auth.error` is null
- State persists across page refreshes

---

### TC-REDUX-002: Posts State Update on Post Creation

**Priority:** High  
**Preconditions:** User is logged in, Redux DevTools open

**Test Steps:**

1. Navigate to `/home`
2. Create a new post
3. Observe Redux state

**Expected Result:**

- `posts.posts` array includes new post
- State updates immediately
- Post data is correct
- No duplicate posts

---

### TC-REDUX-003: Comments State Update

**Priority:** Medium  
**Preconditions:** User is logged in, post exists, Redux DevTools open

**Test Steps:**

1. Navigate to `/home`
2. Add a comment to a post
3. Observe Redux state

**Expected Result:**

- `posts.comments[postID]` array includes new comment
- State updates immediately
- Comment data is correct
- Comments organized by postID

---

## 8. UI/UX Test Cases

### TC-UI-001: Responsive Design - Desktop

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Open application on desktop (1920x1080)
2. Navigate through all pages
3. Observe layout

**Expected Result:**

- Three-column layout displays correctly
- All components visible
- No horizontal scrolling
- Proper spacing and alignment

---

### TC-UI-002: Responsive Design - Mobile

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Open application on mobile (375x667)
2. Navigate through all pages
3. Observe layout

**Expected Result:**

- Layout adapts to mobile
- Sidebars hidden or collapsible
- Single column layout
- Touch-friendly buttons
- No horizontal scrolling

---

### TC-UI-003: Loading States

**Priority:** Medium  
**Preconditions:** User is logged in

**Test Steps:**

1. Navigate to `/home`
2. Observe during page load
3. Create a post and observe

**Expected Result:**

- Loading spinner displays during initial load
- Loading states show during async operations
- No blank screens
- Smooth transitions

---

### TC-UI-004: Error Messages

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Attempt invalid actions (e.g., login with wrong password)
2. Observe error messages

**Expected Result:**

- Error messages are clear and helpful
- Toast notifications display errors
- Errors don't crash the application
- User can recover from errors

---

## 9. Integration Test Cases

### TC-INT-001: Firebase Authentication Integration

**Priority:** High  
**Preconditions:** Firebase configured correctly

**Test Steps:**

1. Register new user
2. Verify user in Firebase Console
3. Log in
4. Verify session

**Expected Result:**

- User appears in Firebase Auth
- Session persists
- Auth state syncs with Redux
- Logout clears session

---

### TC-INT-002: Firestore Data Integration

**Priority:** High  
**Preconditions:** Firebase configured correctly

**Test Steps:**

1. Create a post
2. Check Firestore Console
3. Verify data structure

**Expected Result:**

- Post appears in Firestore `posts` collection
- Data structure is correct
- Timestamps are accurate
- User IDs are correct

---

### TC-INT-003: OpenAI API Integration

**Priority:** High  
**Preconditions:** OpenAI API key configured

**Test Steps:**

1. Use chatbot for search
2. Check network tab for API calls
3. Verify responses

**Expected Result:**

- Embeddings API called for RAG
- Chat API called for responses
- Responses are appropriate
- Errors handled gracefully if API fails

---

### TC-INT-004: Redux-Firebase Integration

**Priority:** High  
**Preconditions:** User is logged in

**Test Steps:**

1. Create a post
2. Observe Redux state
3. Check Firestore
4. Refresh page

**Expected Result:**

- Post saves to Firestore
- Redux state updates
- Firestore listener updates Redux
- State persists after refresh

---

## 10. Performance Test Cases

### TC-PERF-001: Page Load Time

**Priority:** Medium  
**Preconditions:** User is logged in

**Test Steps:**

1. Clear browser cache
2. Navigate to `/home`
3. Measure load time (Lighthouse or DevTools)

**Expected Result:**

- Initial load < 3 seconds
- Time to Interactive < 5 seconds
- No blocking resources

---

### TC-PERF-002: Search Response Time

**Priority:** Medium  
**Preconditions:** User is logged in, on search page

**Test Steps:**

1. Perform a search
2. Measure time from query to results display

**Expected Result:**

- Search results display < 2 seconds
- No noticeable lag
- Smooth user experience

---

### TC-PERF-003: RAG Search Performance

**Priority:** Low  
**Preconditions:** User is logged in, vector store initialized

**Test Steps:**

1. Use chatbot for semantic search
2. Measure vector search time (console logs)

**Expected Result:**

- Vector search < 100ms
- RAG context retrieval < 500ms
- Total chatbot response < 3 seconds

---

## 11. Security Test Cases

### TC-SEC-001: Unauthorized Access Prevention

**Priority:** High  
**Preconditions:** User is not logged in

**Test Steps:**

1. Try to access `/home` directly
2. Try to access `/profile` directly
3. Try to access `/search` directly

**Expected Result:**

- All attempts redirect to `/login`
- No data is accessible
- No errors exposed to user

---

### TC-SEC-002: Data Access Control

**Priority:** High  
**Preconditions:** Two users logged in

**Test Steps:**

1. User A tries to edit User B's profile
2. User A tries to delete User B's post

**Expected Result:**

- User A cannot edit User B's profile
- User A cannot delete User B's post
- Only own data is editable
- Firestore security rules enforce this

---

### TC-SEC-003: API Key Security

**Priority:** High  
**Preconditions:** Application is running

**Test Steps:**

1. Check source code for API keys
2. Check network requests
3. Verify environment variables

**Expected Result:**

- No API keys in source code
- API keys in environment variables only
- Keys not exposed in client-side code
- Secure API communication

---

## 12. Browser Compatibility Test Cases

### TC-BROWS-001: Chrome Compatibility

**Priority:** High  
**Preconditions:** Chrome browser installed

**Test Steps:**

1. Open application in Chrome
2. Test all major features
3. Check console for errors

**Expected Result:**

- All features work correctly
- No console errors
- UI displays properly
- Performance is good

---

### TC-BROWS-002: Firefox Compatibility

**Priority:** High  
**Preconditions:** Firefox browser installed

**Test Steps:**

1. Open application in Firefox
2. Test all major features
3. Check console for errors

**Expected Result:**

- All features work correctly
- No console errors
- UI displays properly
- Performance is good

---

### TC-BROWS-003: Safari Compatibility

**Priority:** High  
**Preconditions:** Safari browser installed

**Test Steps:**

1. Open application in Safari
2. Test all major features
3. Check console for errors

**Expected Result:**

- All features work correctly
- No console errors
- UI displays properly
- Performance is good

---

## Test Execution Summary

### Test Coverage

- **Total Test Cases:** 50+
- **High Priority:** 30+
- **Medium Priority:** 15+
- **Low Priority:** 5+

### Test Execution Status

| Category           | Total | Passed | Failed | Blocked | Not Run |
| ------------------ | ----- | ------ | ------ | ------- | ------- |
| Authentication     | 8     | -      | -      | -       | 8       |
| Profile Management | 4     | -      | -      | -       | 4       |
| Social Features    | 8     | -      | -      | -       | 8       |
| Search             | 5     | -      | -      | -       | 5       |
| AI Chatbot         | 6     | -      | -      | -       | 6       |
| Real-Time          | 3     | -      | -      | -       | 3       |
| Redux              | 3     | -      | -      | -       | 3       |
| UI/UX              | 4     | -      | -      | -       | 4       |
| Integration        | 4     | -      | -      | -       | 4       |
| Performance        | 3     | -      | -      | -       | 3       |
| Security           | 3     | -      | -      | -       | 3       |
| Browser            | 3     | -      | -      | -       | 3       |

**Note:** Fill in actual results during test execution.

---

## Test Environment

### Test Data Requirements

- **Test Users:** At least 5 test accounts
- **Test Posts:** At least 10 test posts
- **Test Athletes:** At least 20 athlete profiles with diverse data
- **Test Comments:** At least 5 comments per post

### Test Tools

- **Browser DevTools:** For debugging and performance
- **Redux DevTools:** For state inspection
- **Firebase Console:** For data verification
- **Lighthouse:** For performance testing
- **Network Tab:** For API call verification

---

## Document Control

**Version History:**

- v1.0.0 - Initial test cases documentation

**Last Updated:** 2024
