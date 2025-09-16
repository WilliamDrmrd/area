import { useState, useEffect } from 'react';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser"
import DatabaseService from '@services/DatabaseService';
import AccountService from '@services/AccountService';
import { useAuth } from './AuthContext';

WebBrowser.maybeCompleteAuthSession();

export const useSpotifyAuth = () => {

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [request, response, promptAsync] = useAuthRequest({
    responseType: ResponseType.Token,
    clientId: "797fabea42cb4dddad568b3297a85b1e",
    clientSecret: "79a9d87334c34e9e9b5381a4cfef5e2b",
    scopes: [
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-state",
      "user-top-read",
      "user-modify-playback-state",
      "streaming",
      "user-read-email",
      "user-read-private",
    ],
    usePKCE: false,
    redirectUri: "exp://127.0.0.1:8082/"
  }, discovery);

  // useEffect(() => {
  //   const fetchUserInfos = async (accessToken : string) => {
  //     const response = await fetch('https://api.spotify.com/v1/me', {
  //       headers: {
  //         Authorization: 'Bearer ' + accessToken
  //       }
  //     });

  //     const data = await response.json();
  //     const oAuth = await AccountService.connectWithOAuth(accessToken, data.email);
  //     return oAuth;
  //   }
  //   let accessToken = null;
  //   if (response?.type === "success") {
  //     accessToken = response?.authentication?.accessToken;
  //     fetchUserInfos(accessToken);
  //   }
  // }, [response])

//   useEffect(() => {
//     loadPersistedAuth();
//     if (requireRefresh) {
//       refreshToken(auth?.refreshToken);
//     }
//   }, [requireRefresh]);

//   const getPersistedAuth = async () => {
//     const jsonValue = await AsyncStorage.getItem("googleAuth");
//     return jsonValue ? JSON.parse(jsonValue) : null;
//   }

//   const loadPersistedAuth = async () => {
//     const persistedAuth = await getPersistedAuth();
//     if (!persistedAuth) return;
//     const isTokenFresh = AuthSession.TokenResponse.isTokenFresh({
//       expiresIn: persistedAuth.expiresIn,
//       issuedAt: persistedAuth.issuedAt
//     });
//     setAuth(persistedAuth);
//     setRequireRefresh(!isTokenFresh);
//   }

  const fetchUserInfos = async (accessToken : string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();
    const oAuth = await AccountService.connectWithOAuth(accessToken, data.email);
    return oAuth;
  }

  const spotifyAuthenticate = async () => {
    let returnValue = null;
    let accessToken = null;
    const spotifyAuthResponse = await promptAsync();
    if (spotifyAuthResponse?.type === "success") {
      accessToken = spotifyAuthResponse?.authentication?.accessToken;
      returnValue = await fetchUserInfos(accessToken);
    }
    return returnValue;
  };

//   const getUserData = async (accessToken: string) => {
//     if (!accessToken) {
//       console.log("No auth token");
//       return null;
//     }
//     const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     });

//     return userInfoResponse.json();
//   }

//   const refreshToken = async (refreshToken: string) => {
//     const client_id = await getClientId();
//     const tokenResult = await AuthSession.refreshAsync({
//       clientId: client_id ?? "",
//       refreshToken: refreshToken ?? "",
//     }, {
//       tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
//     });

//     tokenResult.refreshToken = refreshToken ?? "";
//     return tokenResult;
//   }

//   const googleLogout = async (accessToken: string) => {
//     try {
//       if (accessToken) {
//         await AuthSession.revokeAsync({
//           token: accessToken,
//         }, {
//           revocationEndpoint: "https://oauth2.googleapis.com/revoke"
//         });
//         await AsyncStorage.removeItem("googleAuth");
//       }
//     } catch (error) {
//       console.error("Erreur lors de la déconnexion : ", error);
//     }
//   }

//   const getClientId = async () => {
//     return Platform.OS === "ios" ? IOS_CLIENT_ID : ANDROID_CLIENT_ID;
//   }

  return { spotifyAuthenticate };
};
