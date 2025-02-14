import {firestore, auth} from '../firebaseConfig'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { toast } from 'react-toastify';

let dbRef = collection(firestore, 'posts');
export const postStatus = (status) => {
    let object = {
        status: status
    }
    addDoc(dbRef, object)
    .then((res) => {
        toast.success("You Successfully posted!")
    })
    .catch((error) => {
        console.log(error)
    })
}


export const getStatus = (setAllStatus) => {
    onSnapshot(dbRef, (response) => {
        setAllStatus(response.docs.map((docs) => {
            return { ...docs.data(), id: docs.id};
        }))
    })
}