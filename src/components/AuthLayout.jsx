import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../App";
export default function ()
{
    const {user} = useContext (GlobalContext);

    if (user)
        return <Outlet />;
    
    const location = useLocation ();

    return <Navigate to='/login' replace={true} state={{from:location.pathname}} />
}