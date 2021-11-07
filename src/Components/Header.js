import React from 'react'
import '../Styles/Home.css' 
import { useHistory } from "react-router";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Modal from "react-modal"
import {useState} from 'react'

function Header() {
    const [loginModal, setLoginModal] = useState(false);
    const [isAuthenticated, setAuthentication] = useState(false)
    const [user, setUser] = useState(undefined)

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid black',
            height: '400px',
            width:'360px',
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            alignItems: 'center'
        },
    };
    
    const responseGoogle = (response) =>{
        console.log(response)
        setUser(response.profileObj.name) 
        console.log(user)
        setAuthentication(true)
        setLoginModal(false)
    }
    const responseFacebook = (response) =>{
        console.log(response)
        setUser(response.name) 
        console.log(user)
        setAuthentication(true)
        setLoginModal(false)
    }

    const componentClicked = (response) =>{
        console.log(response)
    }

    let history = useHistory();
    return (
        <div>
         <div className="header">
                <div onClick={() => history.push('/')} className="logo">V!</div>
                   {isAuthenticated?
                   <div class="HomeLogin_options">
                        <div class="login" style={{marginRight :"-60px"}}> {user}</div>
                        <div class="new_account" onClick={ () =>{
                             setAuthentication(false)
                        } }> Logout </div>
                   </div> :
                   <div class="HomeLogin_options">
                        <div class="new_account" onClick={() => setLoginModal(true) }> Login</div>
                     
                   </div>}
                   
                   
         </div>
         <Modal
            isOpen={loginModal}
            style={customStyles}            
        >
             <div className="loginFont">LOGIN</div>
             <div className="fas fa-times cross" onClick={() => setLoginModal(false)}></div>
            
            <div>
            <GoogleLogin
                className="google"
                clientId="406381790404-om7lulp99lgfhj4givpflnmevvk8msqt.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            </div>
            
            <div className="facebook">
              <FacebookLogin
                appId="275938174460051"
                autoLoad={false}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={responseFacebook}
             />
             </div>
         </ Modal> 
        </div>
    )
}

export default Header
