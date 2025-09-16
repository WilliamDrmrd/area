import {Link} from 'react-router-dom';
import {useState} from 'react';
import  ButtonAction  from '../Components/ButtonAction';
import AccountService from '../Services/AccountService';

function SignUpPage() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeUser = (e: any) => {
      setUser(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirm = (e: any) => {
    setConfirmPassword(e.target.value);
  };
  const submit =  () => {
    if (password != confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    AccountService.signUp(user, password)
  }
    return (
      <div className="flex flex-col h-[100vh]">
        {/* <Header isHome={false} isLog={false}/> */}
        <div className="flex flex-col items-center px-[35%]">
          <h1 className="text-5xl font-bold text-primary mb-12 mt-40">S'inscrire</h1>
          {/* <p className="text-xl mb-5">Sélectionnez votre action</p> */}
          <input type="text" value={user} onChange={handleChangeUser} placeholder={"email"}
          className="bg-[#D9D9D9] border rounded-md w-full
          py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
          placeholder-black placeholder-opacity-30"/>
          <input type="password" value={password} onChange={handleChangePassword} placeholder={"mot de passe"}
          className="bg-[#D9D9D9] border rounded-md w-full
          py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
          placeholder-black placeholder-opacity-30"/>
          <input type="password"  value={confirmPassword} onChange={handleChangeConfirm} placeholder={"Confirmer le mot de passe"}
          className="bg-[#D9D9D9] border rounded-md w-full
          py-5 px-5 mb-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
          placeholder-black placeholder-opacity-30"/>
          {
            user !== "" && password !== "" && confirmPassword !== "" && password == confirmPassword ?
            <ButtonAction text={"S'inscrire"} color='#27917E' onClick={submit}></ButtonAction>:
            <ButtonAction text={"S'inscrire"} color='#D7F4EF' onClick={() => {}}></ButtonAction>
          }
        <div className={" flex justify-between px-5 mt-[10%] items-center"}>
            <p className={"text-text font-bold mr-5"}>Vous n'avez pas de compte ?</p>
            <Link to={"/login"}>
                <p className={"text-primary font-bold "}> Connectez-vous </p>
            </Link>
          </div>
        </div>
      </div>
    );
}

export default SignUpPage;