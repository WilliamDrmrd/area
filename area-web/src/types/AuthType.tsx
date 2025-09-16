export interface AuthContextProps {
    MyAuthToken: string;
    setMyAuthToken: (token: string) => void;
}