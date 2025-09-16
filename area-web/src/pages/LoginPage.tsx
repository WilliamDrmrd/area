import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useContext, useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { BsSpotify } from 'react-icons/bs';
import { Link, redirect, useNavigate } from 'react-router-dom';
import ButtonAction from '../Components/ButtonAction';
import { AuthContext } from '../Context/AuthProvider';
import AccountService from '../Services/AccountService';
import OauthService from '../Services/Oauth2';
function LoginPage() {
  const {setCurrentUser, CurrentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async ()  => {
    window.location.href = await OauthService.getAccessGoogle();

  }
  const loginspotify = async ()  => {
    window.location.href = await OauthService.getAccessSpotify();

  }
  const handleChangeUser = (e: any) => {
    setUser(e.target.value);
    };
    const handleChangePassword = (e: any) => {
      setPassword(e.target.value);
    };
    const submit =  () => {
      setIsLoading(true);
      AccountService.login(user, password).then((res) => {
        if (res.statusCode === 200) {
          console.log(res);
          setCurrentUser(res.access_token);
          localStorage.setItem('accessToken', res.access_token);
          console.log(res.access_token);
          navigate('/');
        }
        setIsLoading(false);
      });
    }

    return (
        <div className="flex flex-col h-[100vh]">
        <div className="flex flex-col items-center px-5 md:px-[35%]">
          <h1 className="text-5xl font-bold text-primary mb-12 mt-40">Se connecter</h1>
          <input type="text" value={user} onChange={handleChangeUser} placeholder={"email"}
          className="bg-[#D9D9D9] border rounded-md w-full
          py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
          placeholder-black placeholder-opacity-30"/>
          <input type="password"  value={password} onChange={handleChangePassword} placeholder={"mot de passe"}
          className="bg-[#D9D9D9] border rounded-md w-full
          py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
          placeholder-black placeholder-opacity-30"/>
          {
            user !== "" && password !== "" && !isLoading ?
            <ButtonAction text={"Se connecter"} color='#27917E' onClick={submit}></ButtonAction>:
            <ButtonAction text={"Se connecter"} color='#D7F4EF' onClick={()=>{}}></ButtonAction>
          }
          <div className='h-7'></div>
          <div onClick={login} className='bg-primary cursor-pointer lg:mx-8 text-md flex items-center justify-center text-white px-9 h-12 rounded-3xl'>
          <AiOutlineGoogle className='mr-5'/>
          Se connecter avec Google
          </div>
          <div onClick={() => loginspotify()} className='bg-primary cursor-pointer lg:mx-8 text-md flex items-center justify-center text-white px-9 h-12 rounded-3xl'>
          <AiOutlineGoogle className='mr-5'/>
          Se connecter avec Spotify
          </div>
          <div className={" flex flex-col md:flex-row justify-between px-5 mt-[10%] items-center"}>
            <p className={"text-text font-bold mr-5"}>Vous n'avez pas de compte ?</p>
            <Link to={"/signup"}>
                <p className={"text-primary font-bold "}> Inscrivez-vous </p>
            </Link>
          </div>
        </div>
      </div>
    );
}

export default LoginPage;