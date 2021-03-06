import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie';

const getQueryParams = () => {
	const params: any = {};
	window.location.href.replace(
		/([^(?|#)=&]+)(=([^&]*))?/g,
		($0, $1, $2, $3): any => {
			params[$1] = $3;
		}
	);
	return params;
};

export const setToken = (idToken: string, accessToken: string) => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) {
		return;
	}
	Cookie.set('user', jwtDecode(idToken));
	Cookie.set('idToken', idToken);
	Cookie.set('accessToken', accessToken);
};

export const unsetToken = () => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) {
		return;
	}
	Cookie.remove('idToken');
	Cookie.remove('accessToken');
	Cookie.remove('user');

	// to support logging out from all windows
	window.localStorage.setItem('logout', Date.now().toString());
};

export const getUserFromServerCookie = (req: any) => {
	if (!req.headers.cookie) {
		return undefined;
	}
	const jwtCookie = req.headers.cookie
		.split(';')
		.find((c: string) => c.trim().startsWith('idToken='));
	if (!jwtCookie) {
		return undefined;
	}
	const jwt = jwtCookie.split('=')[1];
	return jwtDecode(jwt);
};

export const getUserFromLocalCookie = () => {
	return Cookie.getJSON('user');
};
