import React, { Component } from 'react';
import auth0 from 'auth0-js';
import { withApollo } from 'react-apollo';

import { AuthProvider } from './authContext';
import { AUTH_CONFIG } from './Auth0variables';
import gql from 'graphql-tag';

const auth = new auth0.WebAuth({
	domain: AUTH_CONFIG.domain,
	clientID: AUTH_CONFIG.clientId,
	redirectUri: AUTH_CONFIG.callbackUrl,
	// audience: `https://${AUTH_CONFIG.domain}/userinfo`,
	responseType: 'token id_token',
});

type AuthProps = {
	client: any; // TODO: Use Apollo type here @critical
	children: any;
};

type AuthState = {
	authenticated: boolean;
	user: {
		role: string;
	};
	accessToken: string;
};

type sessionDatatype = {
	user: { id: string };
	token: string;
	login: { token: string };
};

class Auth extends Component<AuthProps, AuthState> {
	state = {
		authenticated:
			typeof window === 'undefined' || window.localStorage.getItem('token')
				? true
				: false,
		user: {
			role: 'visitor',
		},
		accessToken: '',
	};

	handleAuthentication = ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		auth.login(
			{
				realm: 'Username-Password-Authentication',
				email,
				password,
			},
			e => console.log(e)
		);
	};

	handleSignUp = ({ email, password }: any) => {
		console.log('started signup');
		auth.signup(
			{
				email,
				password,
				connection: 'Username-Password-Authentication',
			},
			(error, userPayload) => {
				console.log(error, userPayload);
				if (error) return;

				auth.login(
					{
						email,
						password,
						realm: 'Username-Password-Authentication',
					},
					e => {
						console.log('done login');
						this.setSession({
							user: { id: userPayload.sub || '' },
							token: userPayload.accessToken,
							login: { token: userPayload.idToken },
						});
					}
				);

				// TODO: find if sub is the ID of user
			}
		);
	};

	loginWithGoogle(): void {
		auth.authorize({
			connection: 'google-oauth2',
		});
	}

	loginWithlinkedIn(): void {
		auth.authorize({
			connection: 'linkedin',
		});
	}

	setSession = (data: sessionDatatype) => {
		const user = {
			// TODO: Add correct user details here
			id: data.user.id,
			role: 'JOBSEEKER',
		};
		this.setState({
			authenticated: true,
			accessToken: data.token,
			user,
		});
		// TODO: check if localstorage is available or not and if it isn't use cookies to set session instead.
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser) {
			window.localStorage.setItem('token', data.login.token);
		}
	};

	handleCallback = async () => {
		console.log('callback started');
		const SIGNUP_MUTATION = gql`
			# Write your query or mutation here
			mutation(
				$email: String!
				$name: String!
				$authid: String!
				$authmethod: String!
			) {
				createUser(
					firstName: $name
					email: $email
					authid: $authid
					authmethod: $authmethod
				) {
					id
				}
			}
		`;
		// don't parse twice because setSession is doing a re-render
		!this.state.authenticated &&
			auth.parseHash((err, authResult) => {
				if (authResult && authResult.accessToken && authResult.idToken) {
					console.log('parseHash started');
					// 1. mutate the backend
					this.props.client
						.mutate({
							mutation: SIGNUP_MUTATION,
							variables: {
								authid: authResult.idTokenPayload.sub,
								// we only allow local now
								authmethod: 'local',
								name: authResult.idTokenPayload.nickname,
								email: authResult.idTokenPayload.email,
							},
						})
						.catch((error: any) => console.log(error));
					// 2. set the sessions
					this.setSession({
						user: { id: authResult.idTokenPayload.sub },
						token: authResult.accessToken,
						login: { token: authResult.idToken },
					});
				} else if (err) {
					console.log(err);
				}
				history.back();
			});
	};

	logout = () => {
		this.setState({
			authenticated: false,
			user: {
				role: 'visitor',
			},
			accessToken: '',
		});

		// Remove localstorage token
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser) {
			window.localStorage.removeItem('token'); // TODO: Get a better token name LOL
		}

		// clear apollo store
		this.props.client.clearStore();
	};

	render() {
		const authProviderValue = {
			...this.state,
			handleAuthentication: this.handleAuthentication,
			handleSignUp: this.handleSignUp,
			logout: this.logout,
			loginWithGoogle: this.loginWithGoogle,
			loginWithlinkedIn: this.loginWithlinkedIn,
			handleCallback: this.handleCallback,
		};

		setInterval(() => {
			// return if not in browser
			if (typeof window == 'undefined') return;
			console.log('timer running');
			// if they deleted the token but they are shown authenicated in UI
			if (!localStorage.getItem('token') && this.state.authenticated) {
				this.setState({ authenticated: false });
			}
			// if they have copy pasted token but they aren't shown authenticated in UI
			else if (localStorage.getItem('token') && !this.state.authenticated) {
				this.setState({ authenticated: true });
			}
		}, 1000 * 60);

		return (
			<AuthProvider value={authProviderValue}>
				{this.props.children}
			</AuthProvider>
		);
	}
}

export default withApollo(Auth);
