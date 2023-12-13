import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../App"
import URL from '../utils/URL';
import useFetch from "../hooks/useFetch";
import { Link} from 'react-router-dom';
import Form from '../components/form';
export default function ()
{

    const {user, setUser} = useContext (GlobalContext);

    const  meFetch = useFetch ();
    const passwordFetch = useFetch ();

    const [me, setMe] = useState ({
        name: user.name,
        email: user.email,
        photo: user.photo
    })

    const [passwords, setPasswords] = useState ({
      passwordCurrent: '',
      password: '',
      passwordConfirm: ''
    })

    useEffect (() => {
        if (meFetch.data)
            setUser (meFetch.data.data.user);
        
    }, [meFetch.data])

    useEffect (() => {
        setMe (user);
    }, [user])

    function handleMeInputChange ({target})
    {
        const {name, value} = target;
        setMe (prev => ({...prev, [name]: value}))
    }

    function handleMeSubmit (e)
    {
        e.preventDefault ();

        const formData = new FormData (e.target);
  
        meFetch.run (`${URL}/api/v1/users/updateMe`, 'PATCH', formData, 'multipart/form-data');
    }

    function handlePasswordChange ({target})
    {
      const {name, value} = target;

      setPasswords (prev => ({...prev, [name]: value}));
    }

    function handlePasswordsSubmit (e)
    {
      e.preventDefault ();

      passwordFetch.run (`${URL}/api/v1/users/updateMyPassword`, 'PATCH', passwords);
    }

    return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active"><a href="#">
                <svg>
                  <use xlinkHref="../src/img/icons.svg#icon-settings"></use>
                </svg>Settings</a></li>
            <li><Link to="/my-tours">
                <svg>
                  <use xlinkHref="../src/img/icons.svg#icon-briefcase"></use>
                </svg>My bookings</Link></li>
            <li><Link to="/my-reviews">
                <svg>
                  <use xlinkHref="../src/img/icons.svg#icon-star"></use>
                </svg>My reviews</Link></li>
            <li><a href="#">
                <svg>
                  <use xlinkHref="../src/img/icons.svg#icon-credit-card"></use>
                </svg>Billing</a></li>
          </ul>
        </nav>
        <div className="user-view__content">
        <Form title='Your account settings' className="user-view__form-container" headingClass="ma-bt-md" formClass="form-user-data" onSubmit={handleMeSubmit}>
            <Form.Field id='name' label='Name' type='text' value={me.name} onChange={handleMeInputChange} required={true} name="name"/>
            <Form.Field id='email' label='Email Address' type='email' value={me.email} onChange={handleMeInputChange} required={true} name="email"/>
            <Form.Photo user={user}/>
            <Form.Btn extraClass='right'>Save settings</Form.Btn>
          </Form>
          
          <div className="line">&nbsp;</div>
          <Form title='Pasword change' className="user-view__form-container" headingClass="ma-bt-md" formClass="form-user-password" onSubmit={handlePasswordsSubmit}>
            <Form.Field label='Current password' name='passwordCurrent' value={passwords.passwordCurrent} onChange={handlePasswordChange} id="password-current" type="password" placeholder="••••••••" required="required" minLength="8"/>
            <Form.Field label='New password' name='password' value={passwords.password} onChange={handlePasswordChange} id="password" type="password" placeholder="••••••••" required="required" minLength="8" />
            <Form.Field extraClass='ma-bt-lg' label='Confirm password' name='passwordConfirm' value={passwords.passwordConfirm} onChange={handlePasswordChange} id="password-confirm" type="password" placeholder="••••••••" required="required" minLength="8"/>
            <Form.Btn extraClass='right'>Save settings</Form.Btn>
          </Form>
        </div>
      </div>
    </main>
    )
}