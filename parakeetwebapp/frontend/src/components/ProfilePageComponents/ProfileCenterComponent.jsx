import React, {useState} from "react";
import { useSelector } from 'react-redux';
import ProfileCard from "../common/ProfileCard/ProfileCard";
import ProfileCardEdit from "../common/ProfileCard/ProfileCardEdit";

export default function ProfileCenterComponent() {
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = () => {
        setIsEditing(!isEditing);
    }
    return (
        <div className="flex-1 p-4 mx-16 bg-[#f4f2ee] min-w-[900px]">
            { isEditing ? (<ProfileCardEdit currentUser={user} onEdit={onEdit}/>) : (<ProfileCard currentUser={user} onEdit={onEdit}/>)}
        </div>
    )
}