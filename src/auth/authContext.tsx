import { createContext } from 'react';

const authContext = createContext({
	authenticated: false, // to check if authenticated or not
	user: {}, // store all the user details
	accessToken: '', // accessToken of user
	handleAuthentication: ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {}, // to start the login process
	logout: () => {}, // logout the user
	loginWithGoogle: () => {},
	loginWithlinkedIn: () => {},
	handleCallback: () => {},
	handleSignUp: ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {},
});

export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
