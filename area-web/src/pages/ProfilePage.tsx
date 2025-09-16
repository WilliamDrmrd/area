import {RiAccountCircleFill, RiLoginBoxFill} from 'react-icons/ri';
import Header from "../Components/Header";
import ButtonAction from "../Components/ButtonAction";
import { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';

function ProfilePage() {
    const navigate = useNavigate();
    const {setCurrentUser, CurrentUser} = useContext(AuthContext);
    const logout = () => {
        setCurrentUser("");
        navigate('/login');
    }
    return (
      <>
        <Header isHome={false} isLog={false}/>
        <div className='flex flex-row'>
          <div className='flex flex-col mt-12 w-56'>
              <div className='flex flex-row bg-secondary rounded-xl items-center w-auto mb-5 cursor-pointer'>
               <RiAccountCircleFill className='text-5xl ml-5'></RiAccountCircleFill>
                <h1 className='text-2xl ml-5'>Profil</h1>
              </div>
              <div className='flex flex-row  rounded-xl items-center w-52 cursor-pointer' onClick={logout}>
               <RiLoginBoxFill className='text-5xl ml-5'></RiLoginBoxFill>
                <h1 className='text-xl ml-5'>Déconnecter</h1>
              </div>
          </div>
          <div className='flex flex-col mt-12 ml-96 w-[550px]'>
            <div>
                <h1 className='text-2xl font-bold mb-5'>Email</h1>
                <input type="text" value={CurrentUser} placeholder={"email"}
                className="bg-[#D9D9D9] border rounded-md w-full
                py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              placeholder-black placeholder-opacity-30"/>
            </div>
            <div>
            <h1 className='text-2xl font-bold mb-5'>Mot de passe</h1>
                <input type="text" placeholder={"email"}
                className="bg-[#D9D9D9] border rounded-md w-full
                py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              placeholder-black placeholder-opacity-30"/>
            </div>
            <div>
            <h1 className='text-2xl font-bold mb-5'>Nouveau mot de passe</h1>
                <input type="text" placeholder={"email"}
                className="bg-[#D9D9D9] border rounded-md w-full
                py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              placeholder-black placeholder-opacity-30"/>
            </div>
            <ButtonAction border={true} text="Changer de mot de passe" color="#27917E" onClick={
            ()=> {
                console.log("test")
            }
          }/>
          </div>
        </div>
      </>
    );
  }
  
  export default ProfilePage;