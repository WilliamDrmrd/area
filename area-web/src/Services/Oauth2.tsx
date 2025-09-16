import { generateKey } from "crypto";
import { redirect } from "react-router-dom";


export default class OauthService {
  static async getUserData(accessToken: string)  {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
    return res.json();
  }

  static async connectWithOAuth (token : string, email: string) {

    const ip = process.env.REACT_APP_DB_ADDRESS;
      const res = await fetch(`http://${ip}/auth/oauth/login`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "token": token,
          "username": "test",
          "firstname": "test",
          "lastname": "test",
        })
      });
      return await res.json();
  }

  static async getAccessToken(code: string) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET!;
  const redirectUri = "http://localhost:8081";
  const tokenEndpoint = 'https://accounts.google.com/o/oauth2/token';
  const formData = new URLSearchParams();
  formData.append('code', code);
  formData.append('client_id', clientId);
  formData.append('scope', 'https://www.googleapis.com/auth/userinfo.profile');
  formData.append('client_secret', clientSecret);
  formData.append('redirect_uri', redirectUri);
  formData.append('grant_type', 'authorization_code');
  const res =  await fetch("https://accounts.google.com/o/oauth2/token", {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return res.json();
  }
  static async getAccessGoogle() {
    const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID!;
    const redirect_uri =  "http://localhost:8081";
    const scope = "https://www.googleapis.com/auth/userinfo.profile";
    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      scope,
      response_type: "code"
    });

    const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
    return authUrl;
  }
  static async getAccessSpotify() {
    const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
    const redirect_uri =  "http://localhost:8081/spotifyLogin";
    const scope = 'user-read-private user-read-email';
    const res ="https://accounts.spotify.com/authorize?"
    + "client_id=" + client_id + "&"+ "response_type=code&" + "redirect_uri=" + redirect_uri + "&" + "scope=" + scope;
    return res;
  }
   static async fetchUserInfos (accessToken : string)  {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    return data;
  }
  static async getAccessTokenSpotify(code : string) {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET!;
  const redirectUri = "http://localhost:8081/spotifyLogin";
  const formData = new URLSearchParams();
  formData.append('code', code);
  formData.append('client_secret', clientSecret);
  formData.append('redirect_uri', redirectUri);
  formData.append('grant_type', 'authorization_code');
  const res =  await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
  })
  return res.json();
  }
}
