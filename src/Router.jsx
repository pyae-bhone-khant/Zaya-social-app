import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import View from "./pages/View";
import App from "./App";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/profile/:username",
				element: <Profile />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/view/:id",
				element: <View />,
			},
		],
	},
]);

export default function Router() {
    return <RouterProvider router={router} />
}
