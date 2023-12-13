import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from './Footer';
export default function ()
{
    return (
        <div className="layout">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}