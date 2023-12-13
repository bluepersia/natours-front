import { GlobalContext } from "../App"
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from '../components/form';

export default function ()
{
    const [formData, setFormData] = useState ({
        email: '',
        name: '',
        password: '',
        passwordConfirm: ''
    })
    const {user, signup} = useContext (GlobalContext);


    function handleInputChange ({target})
    {
        const {name, value} = target;
        setFormData (prev => ({...prev, [name]: value}));
    }

    function handleSubmit (e)
    {
        e.preventDefault ();
        signup (formData);
    }

    const location = useLocation ();
    const navigate = useNavigate ();

    useEffect (()=>
    {
        if (user)
            navigate ('/account', {replace: true});
    }, []);
    
    useEffect (() => {
        if (user && location.state)
            navigate (location.state.from);

    },[user])

    return (
        <main className="main">
            <Form title={'Sign up'} onSubmit={handleSubmit}>
                <Form.Field label='Email address' id='email' type='email' placeholder="you@example.com" required={true} value={formData.email} name='email' onChange={handleInputChange}/>
                <Form.Field label='Name' id='name' type='text' placeholder="Your name" required={true} value={formData.name} name='name' onChange={handleInputChange} />
                <Form.Field label='Password' id='password' type='password' placeholder="••••••••" required={true} minLength={8} value={formData.password} name='password' onChange={handleInputChange} />
                <Form.Field label='Confirm Password' id='passwordConfirm' type='password' placeholder="••••••••" required={true} minLength={8} value={formData.passwordConfirm} name='passwordConfirm' onChange={handleInputChange} />
                <Form.Btn>Sign up</Form.Btn>
            </Form>
        </main>
    )
}