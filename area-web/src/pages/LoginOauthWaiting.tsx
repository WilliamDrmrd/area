import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import OauthService from '../Services/Oauth2';
import { useNavigate } from 'react-router-dom';

const LoginOauthWaiting = (type : any) => {
    const navigate = useNavigate();
  const {setCurrentUser, CurrentUser} = useContext(AuthContext);
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('code');
            if (code){
              console.log(code);
              if (type.type === "spotify") {
                  const res = await OauthService.getAccessTokenSpotify(code);
                  const user = await OauthService.fetchUserInfos(res.access_token);
                  const token = await OauthService.connectWithOAuth(res.access_token, user.email);
                  setCurrentUser(token.access_token);
                  navigate("/");
              }
            }
          } catch (e) {
            console.log(e);
          }
        };
        fetchUserData();
        }, []);
    return (
        <div>
            <h1>Waiting for OAuth</h1>
        </div>
    );
}
export default LoginOauthWaiting;