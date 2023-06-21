import { Navigate, createBrowserRouter } from "react-router-dom";
import { Dashboard, Login, SignUp, Surveys } from "./views";
import { GuestLayout } from "./components";
import {DefaultLayout} from "./components/DefaultLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/dashboard",
                element: <Navigate to='/' />
            },
            {
                path: "/surveys",
                element: <Surveys />
            },
        ]
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <SignUp />
            },
        ]
    }

]);

export default router;