
import { createContext, useEffect, useState } from 'react'
import './App.css'
import useFetch from './hooks/useFetch';
import url from './utils/URL';
import  { BrowserRouter, Routes, Route }  from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Tour from './pages/Tour';
import Account from './pages/Account';
import AuthLayout from './components/AuthLayout';
import MyTours from './pages/MyTours';
import EmailConfirm from './pages/EmailConfirm';
import MyReviews from './pages/MyReviews';
import Alert from './components/Alert';

const GlobalContext = createContext ();

function App() {

  const [user, setUser] = useState (() => JSON.parse (localStorage.getItem ('user')));
  const [alert, setAlert] = useState ({
    msg: '',
    type: ''
  });
  const {data, run} = useFetch ();

  function login (data)
  {
    run (`${url}/api/v1/users/login`, 'POST', data);
  }

  function signup (data)
  {
    run (`${url}/api/v1/users/signup`, 'POST', data);
  }

  function logout ()
  {
    setUser (null);
  }

 


  useEffect (() => {
    if (data)
      setUser (data.data.user);
    
  },[data])

  useEffect (() => {
    localStorage.setItem ('user', JSON.stringify (user));
  }, [user])


  return (
  <GlobalContext.Provider value={{user, setUser, setAlert, login, signup, logout}}>
    <Alert alert={alert}/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Overview/>} />
          <Route path='signup' element={<Signup />}/>
          <Route path='login' element={<Login/>} />
          <Route path='tour/:tourId' element={<Tour />}/>
          <Route path='confirm-email' element={<EmailConfirm/>}/> 
          <Route element={<AuthLayout/>}>
            <Route path ='account' element={<Account/>}/>
            <Route path='my-tours' element={<MyTours />}/>
            <Route path='my-reviews' element={<MyReviews/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </GlobalContext.Provider>);
}
export default App

export {GlobalContext};