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

export const authorize = (email, password) =>
	getAuth0().login(
		{
			realm: 'Username-Password-Authentication',
			email,
			password,
		},
		err => {
			console.log(err);
		}
	);
export const authorizeWithGoogle = () => {
	getAuth0().authorize({
		connection: 'google-oauth2',
	});
};
export const signup = (email, password) => {
	// @todo save name as meta deta in auth0 database
	return getAuth0().signup(
		{ connection: 'Username-Password-Authentication', email, password },
		(err, userPayload) => {
			console.log(userPayload);
			console.log(err);
		}
	);
};
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() });
export const parseHash = callback => getAuth0().parseHash(callback);
