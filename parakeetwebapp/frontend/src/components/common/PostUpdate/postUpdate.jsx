import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FaRegImage, FaVideo, FaPen } from "react-icons/fa";
import ModalComponent from "../Modal/Modal";
import Post from "../Post";
import { useNavigate } from "react-router-dom";
import logo from '../../../images/profile-user-svgrepo-com.svg';
import { createPost } from '../../../redux/slices/postsSlice';
import { getPaginatedPosts } from '../../../api/FirestoreAPI'; // ✅ import the new paginated API
import { store } from '../../../redux/store';
import { testingData } from '../../../api/FirestoreAPI';

export default function PostStatus() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();
    const navigate = useNavigate();

    const goToRoute = (route, state) => {
        navigate(route, state);
    };

    const goToProfile = () => {
        goToRoute('/profile', {
            state: {
                id: user?.uid,
                email: user?.email
            }
        });
    };

    const loadInitialPosts = async () => {
        const { posts, lastVisible, hasMore } = await getPaginatedPosts();
        setPosts(posts);
        setLastVisible(lastVisible);
        setHasMore(hasMore);
    };

    const loadMorePosts = useCallback(async () => {
        if (!hasMore || !lastVisible) return;
        const { posts: newPosts, lastVisible: newLast, hasMore: more } = await getPaginatedPosts({ lastVisible });
        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(newLast);
        setHasMore(more);
    }, [hasMore, lastVisible]);

    // 👇 IntersectionObserver to load more when bottom is visible
    const lastPostRef = useCallback(node => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loadMorePosts, hasMore]);

    const sendStatus = () => {
        const user = store.getState().auth.user;
        if (!status || !user) return;
        dispatch(createPost({
            status,
            email: user.email,
            userName: user.name,
            userID: user.userID,
            files: selectedFiles
        }));
        setModalOpen(false);
        setStatus("");
        setSelectedFiles([]);
    };

    useEffect(() => {
        if (user) {
            testingData(user.email).then((data) => {
                console.log("User data:", data);
            });
        }
    }, [user]);

    useEffect(() => {
        loadInitialPosts();
    }, []);

    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[110px]";
    const profileImgClass = "w-16 h-16 rounded-full cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-300";
    const inputBoxClass = "flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer text-gray-600";
    const buttonClass = "flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer";

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className={`${outerCardClass} mt-8`}>
                <div className="flex items-center space-x-4">
                    <img
                        src={logo}
                        alt="Profile"
                        className={profileImgClass}
                        onClick={goToProfile}
                    />
                    <div className={inputBoxClass} onClick={() => setModalOpen(true)}>
                        Start a post
                    </div>
                </div>

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

            {/* Render Posts */}
            <div className="w-full">
                {posts.map((post, index) => {
                    const isLast = index === posts.length - 1;
                    return (
                        <div ref={isLast ? lastPostRef : null} key={post.id}>
                            <Post posts={post} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
