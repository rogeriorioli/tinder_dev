import React, { useState } from 'react';
import logo from '../assets/tinder.svg'
import './login.css'

import api from '../services/api'

export default function Login({history}) {

const [ username , setUsername ] =  useState('')

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username)

    const response = await api.post('/devs', {
        username,
    })

    const { _id } = response.data

    history.push(`/dev/${_id}`)
}

  return (
    <div className="login-container">
        <form>
        <img src={logo} alt="TinderDev"/>
        <input
            placeholder="digite seu usuário do Github"
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>enviar</button>
        </form>
    
    </div>
  );
}
