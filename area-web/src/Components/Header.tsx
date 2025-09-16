import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';
import ButtonAction from './ButtonAction';
import {RiAccountCircleFill} from 'react-icons/ri';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {RiLoginBoxFill} from 'react-icons/ri';

function Header({isHome, isLog} : {isHome: boolean, isLog: boolean}) {
  const [menu, setMenu] = useState(false);
  const {currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = () => {
    setCurrentUser("");
    navigate('/login');
}

  const toggleMenu = () => setMenu(!menu);
  return (
    <div className={`flex flex-row justify-between py-5 px-10 items-center ${isHome ? "text-white" : "text-text"} relative`}>
      <Link to={"/"} >
        <div className=''>
          <h1 className='text-3xl font-extrabold'>Area</h1>
        </div>
      </Link>
      <ul className={`xl:flex ${!menu ? "hidden" : "flex"} flex-col absolute top-0 left-0 w-full h-[100vh] z-2 justify-center lg:h-auto bg-black bg-opacity-80 lg:bg-transparent text-center lg:w-auto xl:relative items-center xl:flex-row `}>
      <Link to={"/explore"} >
        <li className=' lg:mx-8 text-xl'>Mes Automatisations</li>
      </Link>
      {
        currentUser === "" &&
        <Link to={"/login"}>
        <li className=' lg:mx-8 text-xl'>Se connecter</li>
        </Link>
      }
      {
        currentUser === "" &&
          <Link to={"/signUp"}>
          <li className=' lg:mx-8 text-xl'>S'inscrire</li>
        </Link>
      }
      <Link to={"/create"}>
        <li ><ButtonAction color='#27917E' text='Automatiser'/></li>
      </Link>
      {
        currentUser &&
        <li>
        <RiLoginBoxFill onClick={logout} className='text-5xl ml-5 cursor-pointer'></RiLoginBoxFill>
      </li>
      }
      </ul>
      {!menu ?
        <AiOutlineMenu className='text-5xl xl:hidden'
        onClick={toggleMenu}/>:
        <AiOutlineClose className='text-5xl xl:hidden z-10'
        onClick={toggleMenu}/>
      }
    </div>
  );
}

export default Header;