interface AuthenticationResponse {    
    userName: string;
    displayName: string;
    isAuthenticated: boolean;
    message: string;
    accessToken: string;
}

export default AuthenticationResponse;