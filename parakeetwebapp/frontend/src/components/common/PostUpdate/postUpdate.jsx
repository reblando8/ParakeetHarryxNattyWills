import { useState, useMemo} from "react";
import { FaRegImage, FaVideo, FaPen } from "react-icons/fa"; // Import icons
import ModalComponent from "../Modal/Modal"
import { postStatus, getStatus} from "../../../api/FirestoreAPI";
import Post from "../Post"
import { getUniqueID } from "../../../Helpers/getUniqueID";
import { getCurrentTimeStamp } from "../../../Helpers/UseMoment";
import { useNavigate } from "react-router-dom";
import logo from '../../../images/profile-user-svgrepo-com.svg';

export default function PostStatus({ currentUser }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [allStatus, setAllStatus] = useState([]);
    const navigate = useNavigate();

    const goToRoute = (route, state) => {
        navigate(route, state);
    }   

    const goToProfile = () => {
        goToRoute('/profile',
            {
                state: {
                    id: currentUser?.userID, 
                    email: currentUser?.email
                }
            }
        )
    };


    // I potentially need to add stuff for previews for images or something
    const sendStatus = async () =>{
        await postStatus(status, currentUser.email, currentUser.name, currentUser.id, selectedFiles);
        await setModalOpen(false);
        await setStatus("");
        await setSelectedFiles([]);
    }

    useMemo(() => {
        getStatus(setAllStatus);
    }, [])

    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[110px]";
    const profileImgClass = "w-16 h-16 rounded-full cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-300";
    const inputBoxClass = "flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer text-gray-600";
    const buttonClass = "flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer";
    const modalClass = "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50";
    const modalContentClass = "bg-white p-6 rounded-lg shadow-lg w-full max-w-lg";

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className={`${outerCardClass} mt-8`}>
                <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <img 
                        src={logo} 
                        alt="Profile" 
                        className={profileImgClass}
                        onClick={goToProfile}
                    />

                    {/* Clickable Input Box */}
                    <div className={inputBoxClass} onClick={() => setModalOpen(true)}>
                        Start a post
                    </div>
                </div>

                {/* Buttons Below Input */}
                <div className="flex gap-8 mt-3 px-2">
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

            <ModalComponent
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                status={status}
                setStatus={setStatus}
                sendStatus={sendStatus}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
            />
            <div className="w-full">
                {allStatus.map((posts)=> {
                    return <Post posts={posts} key={posts.id}/>
                })}
            </div>
        </div>
    );
}
