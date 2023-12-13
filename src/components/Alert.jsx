import { useState } from "react"

export default function ({alert})
{
    const [message, setMessage] = useState ('');
    const [timeoutId, setTimeoutId] = useState (0);
    const[style, setStyle] =  useState ({opacity: '0%'});

    if (message != alert.msg)
    {
        clearTimeout (timeoutId);
        setStyle ({opacity: '100%'});
        setTimeoutId (setTimeout (() => {
            setStyle ({opacity: '0%'})
        }, 5000));
        setMessage (alert.msg);
    }

    return <p className={`alert alert--${alert.type}`} style={style}>{alert.msg}</p>
}