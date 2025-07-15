import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
// Removed imports from _cofounder/dev
// import FirstLaunch from "@/_cofounder/dev/firstlaunch.tsx";
// import Cmdl from "@/_cofounder/dev/cmdl.tsx";

const AppWrapper: React.FC = () => {
	return (
		<BrowserRouter>
			{/* Removed FirstLaunch and Cmdl components */}
			<App />
		</BrowserRouter>
	);
};

export default AppWrapper;
