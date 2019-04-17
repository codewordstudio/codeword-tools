import auth0 from 'auth0-js';

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

export const authorize = (email, password) => {
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
export const signup = (email, password, name) => {
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
					authorize(email, password).catch(err => {
						reject(err);
					});
					resolve(data);
				}
				if (err) reject(err);
			}
		);
	});
};
// todo: Add polling to check for local cookies
// body: add polling to check if local sign in data is tampered with or not https://auth0.com/docs/libraries/auth0js/v9#polling-with-checksession-
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() });
export const parseHash = callback => getAuth0().parseHash(callback);
