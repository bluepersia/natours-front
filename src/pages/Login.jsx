import { GlobalContext } from "../App"
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from '../components/form';

export default function ()
{
    const [formData, setFormData] = useState ({
        email: '',
        password: ''
    })
    const {user, login, setAlert} = useContext (GlobalContext);


    function handleInputChange ({target})
    {
        const {name, value} = target;
        setFormData (prev => ({...prev, [name]: value}));
    }

    function handleSubmit (e)
    {
        e.preventDefault ();
        login (formData);
    }

    const location = useLocation ();
    const navigate = useNavigate ();

    useEffect (()=>
    {
        if (user)
            navigate ('/account', {replace: true});
    }, []);

    useEffect (() => {
        if (user)
        {
            setAlert ({msg: 'Successfully logged in!', type:'success'});
            if (location.state)
                navigate (location.state.from);
        }

    },[user])

    return (
        <main className="main">
            <Form title='Login' onSubmit={handleSubmit}>
                <Form.Field id='email' label='Email address'type='email' placeholder="you@example.com" required={true} value={formData.email} name='email' onChange={handleInputChange}/>
                <Form.Field id='password' label='Password' extraClass='ma-bt-md' type='password' placeholder="••••••••" required={true} minLength={8} value={formData.password} name='password' onChange={handleInputChange}/>
                <Form.Btn>Log in</Form.Btn>
            </Form>
        </main>
    )
}