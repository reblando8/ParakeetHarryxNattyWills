import {firestore, auth, storage} from '../firebaseConfig'
import { addDoc, collection, onSnapshot, doc, updateDoc, query, where, arrayUnion, setDoc, getDoc, deleteDoc, serverTimestamp, orderBy} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage";
import { toast } from 'react-toastify';
import { getUniqueID } from "../Helpers/getUniqueID";
import { getCurrentTimeStamp } from "../Helpers/UseMoment";

let postsRef = collection(firestore, 'posts');
let usersRef = collection(firestore, 'users');
let likesRef = collection(firestore, 'likes');

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

