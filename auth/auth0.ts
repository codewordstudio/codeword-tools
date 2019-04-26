import auth0 from 'auth0-js';
import { signupOnPrisma } from './prisma';

const getAuth0 = () => {
	const config = require('../../../config.json');
	return new auth0.WebAuth({
		clientID: config.AUTH0_CLIENT_ID,
		domain: config.AUTH0_CLIENT_DOMAIN,
		responseType: 'token id_token',
		redirectUri: `${getBaseUrl()}/auth/authorized`,
		scope: 'openid profile email',
	});
};

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

export const authorize = (email: string, password: string) => {
	return new Promise((resolve, reject) => {
		getAuth0().login(
			{
				realm: 'Username-Password-Authentication',
				email,
				password,
			},
			(err, data) => {
				if (data) resolve(data);
				if (err) reject(err);
			}
		);
	});
};
export const authorizeWithGoogle = () => {
	getAuth0().authorize({
		connection: 'google-oauth2',
	});
};
export const signupWithLogin = (
	email: string,
	password: string,
	name: string,
	apolloClient: any,
	query?: any
) => {
	return new Promise((resolve, reject) => {
		getAuth0().signup(
			{
				connection: 'Username-Password-Authentication',
				email,
				password,
				user_metadata: {
					name,
				},
			},
			(err, data) => {
				if (data) {
					signupOnPrisma(email, name, data.Id, 'local', apolloClient, query)
						.then(data => {
							authorize(email, password)
								.then()
								.catch(err => {
									reject(err);
								});
						})
						.catch(err => {
							console.log('An Error Occured!');
						});
				}
				if (err) reject(err);
			}
		);
	});
};

export const signupWithoutLogin = (
	email: string,
	password: string,
	name: string,
	apolloClient: any,
	query?: any
) => {
	return new Promise((resolve, reject) => {
		getAuth0().signup(
			{
				connection: 'Username-Password-Authentication',
				email,
				password,
				user_metadata: {
					name,
				},
			},
			(err, data) => {
				if (data) {
					signupOnPrisma(email, name, data.Id, 'local', apolloClient, query)
						.then(data => {
							resolve(data);
						})
						.catch(err => {
							console.log('An Error Occured!', err);
						});
				}
				if (err) reject(err);
			}
		);
	});
};
// todo: Add polling to check for local cookies
// body: add polling to check if local sign in data is tampered with or not https://auth0.com/docs/libraries/auth0js/v9#polling-with-checksession-
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() });
export const parseHash = (callback: any) => getAuth0().parseHash(callback);
