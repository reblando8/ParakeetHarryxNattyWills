import React, { useState, useMemo } from "react";
import InfoHome from '../pages/InfoHome.jsx'

export default function InfoHomeLayout() {
    return(
        <div className="flex flex-col w-screen min-h-screen">
            <div className="bg-[#f4f2ee] min-h-screen overflow-auto overscroll-y-auto">
                <InfoHome />
            </div>
        </div>
    )
}