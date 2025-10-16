import {firestore, auth, storage} from '../firebaseConfig'
import { addDoc, collection, onSnapshot, doc, updateDoc, query, where, arrayUnion, setDoc, getDoc, deleteDoc, serverTimestamp, orderBy, getDocs, limit } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage";
import { toast } from 'react-toastify';
import { getUniqueID } from "../Helpers/getUniqueID";
import { getCurrentTimeStamp } from "../Helpers/UseMoment";

let postsRef = collection(firestore, 'posts');
let usersRef = collection(firestore, 'users');
let likesRef = collection(firestore, 'likes');
let searchHistoryRef = collection(firestore, 'searchHistory');

export const postStatus = async (status, email, userName, userID, file) => {
    try {
        let imageURL = "";

        // Upload image if file is provided
        if (file) {
            const storageRef = ref(storage, `posts/${userID}/${getUniqueID()}-${file.name}`);
            await uploadBytes(storageRef, file);
            imageURL = await getDownloadURL(storageRef);
        }

        const post = {
            status: status,
            timeStamp: getCurrentTimeStamp("LLL"),
            email: email,
            userName: userName,
            postID: getUniqueID(),
            userID: userID,
            imageURL: imageURL // Store image URL if uploaded
        };

        await addDoc(postsRef, post);
        toast.success("You Successfully posted!");
    } catch (error) {
        console.log(error);
        toast.error("Failed to post!");
    }
};




export const getStatus = (setAllStatus) => {
    onSnapshot(postsRef, (response) => {
        setAllStatus(response.docs.map((docs) => {
            return { ...docs.data(), id: docs.id};
        }))
    })
}

export const postUserData = (object) => {
    addDoc(usersRef, object)
    .then(() => {
    })
    .catch((error) => {
        console.log(error)
    })
}

export const getCurrentUserData = (setCurrentUser) => {
    if (typeof setCurrentUser !== "function") {
        console.error("setCurrentUser is not a function yet, skipping execution.");
        return;
    }
    onSnapshot(usersRef, (response) => {
        setCurrentUser(response.docs
            .map((docs) => {
                return { ...docs.data(), id: docs.id};
            })
            .filter((user) => {
                return user.email === localStorage.getItem("userEmail");
            })[0]
        );
    });
}

export const updateUserData = (userID, payload) => {
    let userToUpdate = doc(usersRef, userID);
    updateDoc(userToUpdate, payload)
    .then(() => {
        toast.success("You Successfully Updated Your Profile!")
    })
    .catch((error) => {
        console.log(error)
    })
};

export const getSingleStatus = (setAllStatus, id) => {
    const singleUserQuery = query(postsRef, where("userID", "==", id));
    onSnapshot(singleUserQuery, (response) => {
        setAllStatus(response.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id
            };
        })
    );
    });
};

export const getSingleUser = (setCurrentUser, email) => {
    const singleUserQuery = query(usersRef, where("email", "==", email));
    onSnapshot(singleUserQuery, (response) => {
        setCurrentUser(response.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id
            };
        })[0]
    );
    });
};

export const likePost = async (userID, postID) => {
    try {
        const docID = `${userID}_${postID}`;  // Unique ID format
        const docToLike = doc(likesRef, docID);

        const docSnap = await getDoc(docToLike);

        if (docSnap.exists()) {
            // If the like already exists, remove it (unlike)
            await deleteDoc(docToLike);
        } else {
            // If the like does not exist, add it
            await setDoc(docToLike, { userID, postID });
        }
    } catch (error) {
        console.error("Error liking post:", error);
    }
};

export const getLikesByPost = (setLikeCount, postID) => {
    try {
        let likeQuery = query(likesRef, where('postID', '==', postID));

        onSnapshot(likeQuery, (response) => {
            const likeCount = response.docs.length;
            setLikeCount(likeCount);
        });
    } catch(error) {
        console.error("Error getting likes:", error);
    }
}

export const checkIfUserLikedPost = (setIsLiked, userID, postID) => {
    try {
        const docID = `${userID}_${postID}`;
        const likeDoc = doc(likesRef, docID);

        onSnapshot(likeDoc, (doc) => {
            setIsLiked(doc.exists());
        });
    } catch(error) {
        console.error("Error checking like status:", error);
    }
}

export const addComment = async (postID, userID, userName, text) => {
    try {
        await addDoc(collection(firestore, `posts/${postID}/comments`), {
            userID,
            userName,
            text,
            timeStamp: serverTimestamp(),
        });
        console.log("Comment added!");
    } catch (error) {
        console.error("Error adding comment: ", error);
    }
};

export const deleteComment = async (postID, commentID) => {
    try {
        await deleteDoc(doc(firestore, `posts/${postID}/comments/${commentID}`));
        console.log("Comment deleted!");
    } catch (error) {
        console.error("Error deleting comment: ", error);
    }
};

export const listenForComments = (postID, setComments) => {
    const q = query(collection(firestore, `posts/${postID}/comments`), orderBy("timeStamp", "asc"));
    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(comments);
    });
};

export const createPost = async (userID, userName, status, file) => {
    try {
        let imageUrl = null;
        
        // Upload image if a file is selected
        if (file) {
            const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            // Wait for upload to complete
            await new Promise((resolve, reject) => {
                uploadTask.on("state_changed", null, reject, async () => {
                    imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve();
                });
            });
        }

        // Add post data to Firestore
        await addDoc(collection(firestore, "posts"), {
            userID,
            userName,
            status,
            imageUrl, // Image URL (null if no file uploaded)
            timeStamp: serverTimestamp(),
        });

        console.log("Post created successfully!");
    } catch (error) {
        console.error("Error creating post:", error);
    }
};

export const searchUsers = async (searchQuery, filters = {}) => {
    try {
        const hasText = Boolean(searchQuery && searchQuery.trim() !== '');
        let uniqueResults = [];

        if (hasText) {
            const searchTerm = searchQuery.toLowerCase().trim();

            // Build base queries for username and email search
            const usernameQuery = query(
                usersRef, 
                where("userName", ">=", searchTerm),
                where("userName", "<=", searchTerm + "\uf8ff")
            );
            
            const emailQuery = query(
                usersRef,
                where("email", ">=", searchTerm),
                where("email", "<=", searchTerm + "\uf8ff")
            );

            // Execute both queries
            const [usernameSnapshot, emailSnapshot] = await Promise.all([
                getDocs(usernameQuery),
                getDocs(emailQuery)
            ]);

            // Combine results and remove duplicates
            const usernameResults = usernameSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                matchType: 'username'
            }));

            const emailResults = emailSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                matchType: 'email'
            }));

            const allResults = [...usernameResults, ...emailResults];
            uniqueResults = allResults.filter((user, index, self) => 
                index === self.findIndex(u => u.id === user.id)
            );
        } else {
            // No text: fetch all users and filter by provided filters only
            const allUsersSnapshot = await getDocs(usersRef);
            uniqueResults = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // Apply filters
        if (filters.sport && filters.sport !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.sport && user.sport.toLowerCase().includes(filters.sport.toLowerCase())
            );
        }

        if (filters.position && filters.position !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.position && user.position.toLowerCase().includes(filters.position.toLowerCase())
            );
        }

        if (filters.location && filters.location !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.location && user.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.team && filters.team !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.team && user.team.toLowerCase().includes(filters.team.toLowerCase())
            );
        }

        if (filters.education && filters.education !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.education && user.education.toLowerCase().includes(filters.education.toLowerCase())
            );
        }

        if (filters.height && filters.height !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.height && user.height.toLowerCase().includes(filters.height.toLowerCase())
            );
        }

        if (filters.weight && filters.weight !== '') {
            uniqueResults = uniqueResults.filter(user => 
                user.weight && user.weight.toLowerCase().includes(filters.weight.toLowerCase())
            );
        }

        // Experience filter (this would need to be parsed from experience field)
        if (filters.experience && filters.experience !== '') {
            uniqueResults = uniqueResults.filter(user => {
                if (!user.experience) return false;
                const exp = user.experience.toLowerCase();
                switch (filters.experience) {
                    case 'rookie':
                        return exp.includes('rookie') || exp.includes('0') || exp.includes('1 year');
                    case 'junior':
                        return exp.includes('junior') || exp.includes('1-3') || exp.includes('2 year') || exp.includes('3 year');
                    case 'mid':
                        return exp.includes('mid') || exp.includes('3-5') || exp.includes('4 year') || exp.includes('5 year');
                    case 'senior':
                        return exp.includes('senior') || exp.includes('5-10') || exp.includes('6 year') || exp.includes('7 year') || exp.includes('8 year') || exp.includes('9 year') || exp.includes('10 year');
                    case 'veteran':
                        return exp.includes('veteran') || exp.includes('10+') || exp.includes('11 year') || exp.includes('12 year') || exp.includes('15 year') || exp.includes('20 year');
                    default:
                        return true;
                }
            });
        }

        return uniqueResults;
    } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to search users");
        return [];
    }
};

export const saveSearchHistory = async ({ userID, queryText = '', filters = {} }) => {
    try {
        if (!userID) {
            console.log('No userID provided for search history');
            return;
        }
        const entry = {
            userID,
            queryText,
            filters,
            createdAt: serverTimestamp(),
        };
        console.log('Saving search history entry:', entry);
        const docRef = await addDoc(searchHistoryRef, entry);
        console.log('Search history saved with ID:', docRef.id);
    } catch (error) {
        console.error('Error saving search history:', error);
    }
};

export const getRecentSearchHistory = async (userID, count = 10) => {
    try {
        if (!userID) {
            console.log('No userID provided for fetching search history');
            return [];
        }
        console.log('Fetching search history for userID:', userID);
        
        // First try to get all search history for this user without ordering
        const q = query(searchHistoryRef, where('userID', '==', userID));
        const snap = await getDocs(q);
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by createdAt on the client side and limit
        const sortedResults = results
            .sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            })
            .slice(0, count);
            
        console.log('Fetched search history results:', sortedResults);
        return sortedResults;
    } catch (error) {
        console.error('Error fetching search history:', error);
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        return [];
    }
};

export const getUserById = async (userId) => {
    try {
        if (!userId) return null;
        const userDocRef = doc(usersRef, userId);
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error("Error fetching user by id:", error);
        return null;
    }
};

