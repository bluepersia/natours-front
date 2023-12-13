import { useState } from "react";

export default function ()
{
    const [isLoading, setIsLoading] = useState (false);
    const [error, setError] = useState (null);
    const [data, setData] = useState (null);

    async function run (url, method = 'GET', body = {}, contentType= 'application/json')
    {

        if (contentType == 'application/json')
            body = JSON.stringify (body);
        
        const config = {
            method,
            mode: 'cors',
            body: (method == 'GET' || method == 'HEAD') ? null : body,
            headers: contentType == 'application/json' ? {
                'Content-Type': contentType
            } : {},
            credentials: 'include'
        }

        setIsLoading (true);
        setError (null);

        try {
            const res = await fetch (url, config);

            if (!res.ok)
                throw new Error (res.statusText);


            const data = await res.json ();
            
            setData (data); 
        }
        catch (err)
        {
            console.error (err);
            setError (err);
        }
        finally {
            setIsLoading (false);
        }
    }

    return {isLoading, error, data, run};
}