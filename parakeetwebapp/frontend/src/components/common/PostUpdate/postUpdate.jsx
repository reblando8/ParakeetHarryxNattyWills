import { useState, useMemo} from "react";
import { FaRegImage, FaVideo, FaPen } from "react-icons/fa"; // Import icons
import ModalComponent from "../Modal/Modal"
import { postStatus, getStatus} from "../../../api/FirestoreAPI";
import Post from "../Post"

export default function PostStatus() {
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState('')
    const [allStatus, setAllStatus] = useState([]);
    const sendStatus = async () =>{
        await postStatus(status);
        await setModalOpen(false);
        await setStatus("");
    }

    useMemo(() => {
        getStatus(setAllStatus);
    }, [])

    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[110px]";
    const profileImgClass = "w-12 h-12 rounded-full"; // Profile image styling
    const inputBoxClass = "flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer text-gray-600";
    const buttonClass = "flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer";
    const modalClass = "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50";
    const modalContentClass = "bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"; // Ensures responsiveness

    return (
        <div className="max-w-3xl mx-auto w-full px-6">
            <div className={outerCardClass}>
                <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <img src="https://via.placeholder.com/50" alt="Profile" className={profileImgClass} />

                    {/* Clickable Input Box */}
                    <div className={inputBoxClass} onClick={() => setModalOpen(true)}>
                        Start a post
                    </div>
                </div>

                {/* Buttons Below Input */}
                <div className="flex justify-between mt-3 px-2">
                    <button className={buttonClass}>
                        <FaRegImage className="text-green-500" />
                        <span>Photo</span>
                    </button>
                    <button className={buttonClass}>
                        <FaVideo className="text-blue-500" />
                        <span>Video</span>
                    </button>
                    <button className={buttonClass}>
                        <FaPen className="text-orange-500" />
                        <span>Write Article</span>
                    </button>
                </div>
            </div>

            <ModalComponent modalOpen={modalOpen} setModalOpen={setModalOpen} status={status} setStatus={setStatus} sendStatus={sendStatus}/>
            {allStatus.map((posts)=> {
                return (
                    console.log(typeof posts.status),
                    Post(posts.status)
                )
            })}
        </div>
    );
}
