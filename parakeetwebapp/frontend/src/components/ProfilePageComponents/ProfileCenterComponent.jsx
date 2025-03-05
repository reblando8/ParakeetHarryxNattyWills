import React, {useState} from "react";
import ProfileCard from "../common/ProfileCard/ProfileCard";
import ProfileCardEdit from "../common/ProfileCard/ProfileCardEdit";

export default function ProfileCenterComponent({currentUser}) {
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = () => {
        setIsEditing(!isEditing);
        console.log("Current user", currentUser);
    }
    return (
        <div className="flex-1 p-4 mx-16 bg-[#f4f2ee] min-w-[900px]">
            { isEditing ? (<ProfileCardEdit currentUser={currentUser} onEdit={onEdit}/>) : (<ProfileCard currentUser={currentUser} onEdit={onEdit}/>)}
        </div>
    )
}