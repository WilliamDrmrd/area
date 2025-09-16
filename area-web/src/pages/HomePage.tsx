// import Box from '@mui/material/Box';
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from "react";
import "./style/HomePage.css";
import OauthService from "../Services/Oauth2";



function HomePage() {
  const {setCurrentUser, CurrentUser} = useContext(AuthContext);
  useEffect(() => {
    if (!window.opener) return;
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    window.opener.postMessage({code: code, state: state}, "*");
    console.log(code, state);
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code');
        if (code){
          const data  : any = await OauthService.getAccessToken(code);
          const user = await OauthService.getUserData(data.access_token); // todo
          const res = await OauthService.connectWithOAuth(data.access_token, "valentinduban675@gmail.com");
          setCurrentUser(res.access_token);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserData();
  }, []);
  return (
    <div className="h-[100vh] bg-hero-image bg-cover text-white">
      <div className="bg-black bg-opacity-50 h-full">
        <Header isHome={true} isLog={false}/>
        <div className="flex flex-col md:pl-24 h-[90%] justify-center md:items-start sm:items-center items-center">
          <h1 className="lg:text-7xl md:text-5xl sm:text-5xl text-3xl font-bold pb-10">
            Automatisez vos actions
          </h1>
          <h2 className="text-3xl md:text-5xl pb-10">
            Changez, Innovez, Créez
          </h2>
          <Link to={"/create"}>
            <div className="flex text-xl justify-center border-4 rounded-full px-2 py-5 md:w-96">
              Commencez dès maintenant
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;