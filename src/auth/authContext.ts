import { createContext } from 'react';

const authContext = createContext({
	authenticated: false, // to check if authenticated or not
	user: {}, // store all the user details
	accessToken: '', // accessToken of user
	handleAuthentication: (args: any) => {
		return args;
	}, // to start the login process
	logout: () => {
		return;
	}, // logout the user
	loginWithGoogle: () => {
		return;
	},
	loginWithlinkedIn: () => {
		return;
	},
	handleCallback: () => {
		return;
	},
	handleSignUp: (args: any) => {
		return args;
	},
});

/* tslint:disable */
export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
