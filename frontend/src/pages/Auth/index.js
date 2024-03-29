import React, { useContext, useRef, useState } from 'react';

import AuthContext from '../../context/auth-context';
import { CREATE_USER } from '../../graphql/mutations';
import { LOGIN } from '../../graphql/queries';
import './index.css'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const contextType = useContext(AuthContext)

  const submitHandler = event => {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(!isLogin ?
        CREATE_USER(email, password) :
        LOGIN(email, password)
      ),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!')

      return res.json()
    }).then(resData => {
      if (resData.data.login.token) {
        contextType.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <form className="auth-form" onSubmit={submitHandler} >
      <div className="form-control">
        <label htmlFor="email">E-mail</label>

        <input type="email" id="email" ref={emailRef} />
      </div>

      <div className="form-control">
        <label htmlFor="password">Password</label>

        <input type="password" id="password" ref={passwordRef} />
      </div>

      <div className="form-actions">
        <button type="submit">Submit</button>

        <button type="button" onClick={() => setIsLogin(!isLogin)}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
      </div>
    </form>
  );
}

export default AuthPage;