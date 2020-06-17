import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSigned: false,
    name: '',
    email: '',
    photo: ''
  });

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then( (res) => {
      const {displayName, email, photoURL} = res.user;
      const signedIn = {
        isSigned: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedIn);
  
    })
    .catch( (err) => {
      console.log(err)
    }) 
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( (res) => {
      const signedOut = {
        isSigned: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        isValid: false,
        existingUser: false
      }
      setUser(signedOut);
    })
    .catch((err) => {
      console.log(err.message);
    })
  }

  const createAccount = (event) => {
    if(user.isValid){
     firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
     .then( res => {
      //  console.log(res)
       const createdUser = {...user};
       createdUser.isSigned = true;
       createdUser.error = '';
       setUser(createdUser);
     })
     .catch( err => {
       console.log(err.message)
       const createdUser = {...user};
       createdUser.isSigned = false;
       createdUser.error = err.message;
       setUser(createdUser);
     })
    }
    event.preventDefault();
    event.target.reset();
  }

  const is_valid_email = email =>   /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber =  input => /\d/.test(input);
  
  const switchForm = e => {
  const createdUser = {...user};
  createdUser.existingUser = e.target.checked;
  setUser(createdUser);
  }

  const handleChange = (e) => {
    const newUserInfo = {
      ...user,
    };

    //Perform validation
    

    let isValid = true;
    if(e.target.name === "email"){
      isValid = is_valid_email(e.target.value);
    }

    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

    const signInUser = event => {
      if(user.isValid){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then( res => {
         //  console.log(res)
          const createdUser = {...user};
          createdUser.isSigned = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch( err => {
          console.log(err.message)
          const createdUser = {...user};
          createdUser.isSigned = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
       }
    event.preventDefault();
    event.target.reset();
  }

  return(
    <div className="App">
      {
        user.isSigned && <div>
            <img src={user.photo} alt=""/>
            <p>{user.email}</p>
            <h3>Welcome, {user.name}</h3>
        </div>

      }
      {
        user.isSigned ? <button onClick={handleSignOut}>Sign Out</button> :
         <button onClick={handleSignIn}>Sign In</button>
      }

     <h1>Our Own Authentication</h1>
     <input type="checkbox" id="switchForm" name="switchForm" onChange={switchForm}/>
     <label htmlFor="switchForm">Returning User </label>

     <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="SignIn"/>
     </form>

     <form  style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Enter your name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
     </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  )

}

export default App;
