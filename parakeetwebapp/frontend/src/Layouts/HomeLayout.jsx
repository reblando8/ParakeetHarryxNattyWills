import React from 'react'
import Home from '../pages/Home'
import TopBar from '../components/common/TopBar'

export default function HomeLayout() {
    return(
        <div className="flex-col w-screen">
            <TopBar />
            <Home />
        </div>
    )
}