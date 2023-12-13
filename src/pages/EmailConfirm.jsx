import { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch"
import { useSearchParams } from "react-router-dom";
import URL from '../utils/URL';
import { GlobalContext } from "../App";
export default function ()
{
    const {user, setUser} = useContext (GlobalContext);
    const {run, isLoading, data} = useFetch ();
    const [searchParams, setSearchParams] = useSearchParams ();

    useEffect (() =>
    {   
        if (data?.data?.user)
            setUser (data.data.user);
        
    }, [data])

    useEffect (() =>{
        const token = searchParams.get ('token');

        if (token)
        {
            run (`${URL}/api/v1/users/confirm-email/${token}`, 'POST');
        }
    }, [])
    return (
        <main className="main">
            <h2 className="heading-secondary ma-bt-lg">Email confirmation</h2>
            {isLoading && <p className="p">...Loading</p>}
            {data && data.status == 'success' && <p className="p">Successfully confirmed email!</p>}
        </main>
    )
}