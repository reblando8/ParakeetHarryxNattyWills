import {firestore, auth} from '../firebaseConfig'
import { addDoc, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify';

let postsRef = collection(firestore, 'posts');
let usersRef = collection(firestore, 'users');
export const postStatus = (post) => {
    addDoc(postsRef, post)
    .then(() => {
        toast.success("You Successfully posted!")
    })
    .catch((error) => {
        console.log(error)
    })
}



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
                return { ...docs.data(), userID: docs.id};
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

