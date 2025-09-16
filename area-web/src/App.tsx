import CreatePage from "./pages/CreatePage";
import {Routes, Route} from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UnfindPage from "./pages/UnfindPage";
import SecurityPage from "./pages/SecurityPage";
import SignUpPage from "./pages/SignUpPage";
import ExplorePage from "./pages/ExplorePage";
import OAuthRedirect from "./pages/OAuthRedirect";
import LoginOauthWaiting from "./pages/LoginOauthWaiting";
import "./App.css";
import { ThemeProvider } from "@mui/system";
import { useContext, createContext, useEffect} from "react";
import { AuthProvider } from "./Context/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const Context = createContext(undefined);
function App() {
  return  (
    <GoogleOAuthProvider clientId="537198270562-54d4cmp4rrjr2ecbnce1ur61d80rhf9b.apps.googleusercontent.com">
    <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/spotifyLogin" element={<LoginOauthWaiting type={"spotify"}/>}></Route>
          <Route path="/googleLogin" element={<LoginOauthWaiting type={"google"}/>}></Route>
          <Route path="/profile" element={<ProfilePage/>}></Route>
          <Route path="/create" element={<CreatePage/>}></Route>
          <Route path="/forgotPassword" element={<ForgotPassword/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/signUp" element={<SignUpPage/>}></Route>
          <Route path="/Security" element={<SecurityPage/>}></Route>
          <Route path="/explore" element={<ExplorePage/>}></Route>
          <Route path="/profile" element={<ProfilePage/>}></Route>
          <Route path="/oauthredirect" element={<OAuthRedirect/>}></Route>
          <Route path="/*" element={<UnfindPage/>}></Route>
        </Routes>
    </AuthProvider>
    </GoogleOAuthProvider>
    )
}

export default App
