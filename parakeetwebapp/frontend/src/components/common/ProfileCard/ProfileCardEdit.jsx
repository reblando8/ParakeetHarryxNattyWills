import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/authSlice";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { updateUserData } from "../../../api/FirestoreAPI";

export default function ProfileCardEdit({ onEdit }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        name: currentUser?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || "",
        aboutMe: currentUser?.aboutMe || "",
        sport: currentUser?.sport || "",
        position: currentUser?.position || "",
        team: currentUser?.team || "",
        location: currentUser?.location || "",
        height: currentUser?.height || "",
        weight: currentUser?.weight || "",
        achievements: currentUser?.achievements || "",
        careerHighlights: currentUser?.careerHighlights || "",
        stats: currentUser?.stats || "",
        experience: currentUser?.experience || "",
        education: currentUser?.education || "",
        interests: currentUser?.interests || "",
        email: currentUser?.user?.email || currentUser?.email || "",
        updatedAt: new Date().toISOString()
    });

    // Update form data when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || "",
                aboutMe: currentUser?.aboutMe || "",
                sport: currentUser?.sport || "",
                position: currentUser?.position || "",
                team: currentUser?.team || "",
                location: currentUser?.location || "",
                height: currentUser?.height || "",
                weight: currentUser?.weight || "",
                achievements: currentUser?.achievements || "",
                careerHighlights: currentUser?.careerHighlights || "",
                stats: currentUser?.stats || "",
                experience: currentUser?.experience || "",
                education: currentUser?.education || "",
                interests: currentUser?.interests || "",
                email: currentUser?.user?.email || currentUser?.email || "",
                updatedAt: new Date().toISOString()
            });
        }
    }, [currentUser]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Update profile function
    const handleUpdateProfile = async () => {
        const userID = currentUser?.id || currentUser?.userID;
        if (!userID) return;
        
        await updateUserData(userID, formData);
        
        // Update Redux state with new data
        const updatedUser = { ...currentUser, ...formData };
        dispatch(setUser(updatedUser));
        
        onEdit();
    };

    return (
        <>
            <div className="relative bg-white border border-gray-300 shadow-md rounded-lg p-8 w-full mb-16">
                <button 
                    onClick={onEdit} 
                    className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer hover:bg-gray-600"
                >
                    Go Back
                </button>
                
                <div className="space-y-8">
                    {/* Name Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., John Smith"
                        />
                    </div>

                    {/* About Me Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                        <textarea
                            name="aboutMe"
                            value={formData.aboutMe}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Share a brief bio about yourself, your journey in sports, and what motivates you..."
                        />
                    </div>

                    {/* Sport and Position */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <input
                                type="text"
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., Basketball, Soccer, Tennis"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position/Specialty</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., Point Guard, Forward, Midfielder"
                            />
                        </div>
                    </div>

                    {/* Team and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Team</label>
                            <input
                                type="text"
                                name="team"
                                value={formData.team}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., Golden State Warriors, Real Madrid"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., Los Angeles, CA"
                            />
                        </div>
                    </div>

                    {/* Physical Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                            <input
                                type="text"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., 6'2&quot; (188 cm)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., 185 lbs (84 kg)"
                            />
                        </div>
                    </div>

                    {/* Career Highlights */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Career Highlights</label>
                        <textarea
                            name="careerHighlights"
                            value={formData.careerHighlights}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="List your major career achievements, championships, awards..."
                        />
                    </div>

                    {/* Stats */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Statistics</label>
                        <textarea
                            name="stats"
                            value={formData.stats}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Share your key performance statistics (e.g., Points per game, Goals scored, Win rate)"
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Athletic Experience</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="List your previous teams, leagues, or significant competitions..."
                        />
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., University of Kentucky, Class of 2022"
                        />
                    </div>

                    {/* Interests/Hobbies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interests & Activities</label>
                        <textarea
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Share your interests outside of sports, community involvement, hobbies..."
                        />
                    </div>

                    {/* Bottom Save Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleUpdateProfile}
                            className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-bold cursor-pointer hover:bg-purple-600 transition-colors shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
