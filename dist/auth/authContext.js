import { createContext } from 'react';
const authContext = createContext({
    authenticated: false,
    user: {},
    accessToken: '',
    handleAuthentication: (args) => {
        return args;
    },
    logout: () => {
        return;
    },
    loginWithGoogle: () => {
        return;
    },
    loginWithlinkedIn: () => {
        return;
    },
    handleCallback: () => {
        return;
    },
    handleSignUp: (args) => {
        return args;
    },
});
/* tslint:disable */
export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
//# sourceMappingURL=authContext.js.map