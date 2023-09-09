import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout() {
    return (
        <div className="py-6 px-10 flex flex-col min-h-screen">
            <Header />
            <Outlet />
        </div>
    )
}