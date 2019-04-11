import * as React from 'react';
import * as auth0 from 'auth0-js';
import { withApollo } from 'react-apollo';
import { AuthProvider } from './authContext';
import gql from 'graphql-tag';


interface AuthProps {
	client: any;
	children: any;
	domain: string;
	clientId: string;
	callbackUrl: string;
}

interface AuthState {
	authenticated: boolean;
	user: {
		role: string;
	};
	accessToken: string;
}

interface SessionDatatype {
	user: { id: string };
	token: string;
	login: { token: string };
}

class Auth extends React.Component<AuthProps, AuthState> {
	public state = {
		authenticated:
			typeof window === 'undefined' || window.localStorage.getItem('token')
				? true
				: false,
		user: {
			role: 'visitor',
		},
		accessToken: '',
	};
	private auth = new auth0.WebAuth({
		domain: this.props.domain,
		clientID: this.props.clientId,
		redirectUri: this.props.callbackUrl,
		responseType: 'token id_token',
	});

	handleAuthentication = ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		this.auth.login(
			{
				realm: 'Username-Password-Authentication',
				email,
				password,
			},
			(e: any) => console.log(e)
		);
	};

	handleSignUp = ({ email, password }: any) => {
		console.log('started signup');
		this.auth.signup(
			{
				email,
				password,
				connection: 'Username-Password-Authentication',
			},
			(error, userPayload) => {
				console.log(error, userPayload);
				if (error) {
					return;
				}

				this.auth.login(
					{
						email,
						password,
						realm: 'Username-Password-Authentication',
					},
					e => {
						console.log(e);
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
		this.auth.authorize({
			connection: 'google-oauth2',
		});
	}

	loginWithlinkedIn(): void {
		this.auth.authorize({
			connection: 'linkedin',
		});
	}

	setSession = (data: SessionDatatype) => {
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
		// TODO: check if localstorage is available or not and if it isn't use
		// cookies to set session instead.
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser) {
			window.localStorage.setItem('token', data.login.token);
		}
	};

	handleCallback = async () => {
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
		if (!this.state.authenticated) {
			this.auth.parseHash((err, authResult) => {
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
		}
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
			if (typeof window === 'undefined') {
				return;
			}
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
