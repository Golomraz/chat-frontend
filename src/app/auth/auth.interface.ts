export interface ILoginResult {
    accessToken: string;
    refreshToken: string;
    username: string;
    id: string;
}

export interface IUser {
    username: string;
    password: string;
    role?: boolean;
}