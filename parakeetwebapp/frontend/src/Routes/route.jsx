import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomeLayout from "../Layouts/HomeLayout";
import ProfileLayout from "../Layouts/ProfileLayout";
import InfoHomeLayout from "../Layouts/InfoHomeLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: < Login />     
    },
    {
        path: "/register",
        element: < Register />     
    },
    {
        path: "/home",
        element: < HomeLayout />     
    },

    {
        path: "/profile",
        element: < ProfileLayout />
    },
    {
        path: "/",
        element: < InfoHomeLayout />
    }

]);