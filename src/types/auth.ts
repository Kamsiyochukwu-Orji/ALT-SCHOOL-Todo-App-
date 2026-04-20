export interface LoginPayload{
    email: string;
    password: string;
}

export interface RegisterPayload{
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse{
    accessToken: string;
    refreshToken: string;
    user: User;
}
export interface User{
    id: string;
    email: string;
    name: string;
}

export interface Tokens {
    accessToken?: string;
    refreshToken?: string;
}

export interface RefreshResponse{
    accessToken: string;
    refreshToken: string;
}

export interface User{
    id: string;
    email: string;
    name: string;
}

export interface AuthContextValue{
    user: User | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
    loginWithEmail: (email: string, password: string)=>Promise<User | null>;
    signupWithEmail:(
        email:string,
        password:string,
        name: string
    )=>Promise<User | null>;
    logout: ()=> void;
}