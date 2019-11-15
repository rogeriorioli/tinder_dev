import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import { Link } from 'react-router-dom'

import './main.css'

import api from '../services/api'

import logo from '../assets/tinder.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'

import itsmatch from '../assets/itsamatch.png'

export default function Main({match}) {

  const [users , setUsers ] = useState([]);

  const  [ matchDev , setMatchDev ]  = useState(null)

  useEffect(() =>{
   async function loadUsers() {
      const response = await api.get('/devs' , {
          headers : {
            user : match.params.id,
          }
        })
        setUsers(response.data)
   } 
   loadUsers();
  },[match.params.id])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query : {
          user : match.params.id
      }
    })
    socket.on('match', dev => {
      setMatchDev(dev);
    })
  
  },[match.params.id]) 

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id  }
  })

  setUsers(users.filter(user => user._id !== id));
    
  }
  async function handleDisLike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
        headers: { user: match.params.id  }
    })

    setUsers(users.filter(user => user._id !== id));
  }
  return (
       <div className="main-container">
         <Link to="/">
          <img src={logo} alt="TinderDev"/>
         </Link>
          { users.length > 0 ? (
              <ul>
              {users.map(user => (
              <li key={user._id}>
                <img src={user.avatar} alt={user.nane}/>
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
               <button type="button" onClick={() => handleDisLike(user._id)}>
                  <img src={dislike} alt=""/>
               </button>
               <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt=""/>
               </button>
              </div>
              </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              acabou :(
            </div>
          )
          }
          { matchDev && (
            <div className="match-container">
              <img src={itsmatch} alt="it's a match"/>
              <img className="avatar" src={matchDev.avatar} alt={matchDev.name}/>
              <strong>{matchDev.name}</strong>
              <p>{matchDev.bio}</p>
              <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
            </div>
          ) }
       </div>
  );
}
