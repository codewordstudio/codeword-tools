"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require();
from;
'react';
const auth0_js_1 = require("auth0-js");
const react_apollo_1 = require("react-apollo");
const authContext_1 = require("./authContext");
const graphql_tag_1 = require("graphql-tag");
class Auth extends Component {
    constructor() {
        super(...arguments);
        this.auth = new auth0_js_1.default.WebAuth({
            domain: this.props.domain,
            clientID: this.props.clientId,
            redirectUri: this.props.callbackUrl,
            responseType: 'token id_token',
        });
        this.state = {
            authenticated: typeof window === 'undefined' || window.localStorage.getItem('token')
                ? true
                : false,
            user: {
                role: 'visitor',
            },
            accessToken: '',
        };
        this.handleAuthentication = ({ email, password, }) => {
            this.auth.login({
                realm: 'Username-Password-Authentication',
                email,
                password,
            }, (e) => console.log(e));
        };
        this.handleSignUp = ({ email, password }) => {
            console.log('started signup');
            this.auth.signup({
                email,
                password,
                connection: 'Username-Password-Authentication',
            }, (error, userPayload) => {
                console.log(error, userPayload);
                if (error)
                    return;
                this.auth.login({
                    email,
                    password,
                    realm: 'Username-Password-Authentication',
                }, e => {
                    console.log(e);
                    this.setSession({
                        user: { id: userPayload.sub || '' },
                        token: userPayload.accessToken,
                        login: { token: userPayload.idToken },
                    });
                });
                // TODO: find if sub is the ID of user
            });
        };
        this.setSession = (data) => {
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
        this.handleCallback = () => __awaiter(this, void 0, void 0, function* () {
            console.log('callback started');
            const SIGNUP_MUTATION = graphql_tag_1.default `
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
                            .catch((error) => console.log(error));
                        // 2. set the sessions
                        this.setSession({
                            user: { id: authResult.idTokenPayload.sub },
                            token: authResult.accessToken,
                            login: { token: authResult.idToken },
                        });
                    }
                    else if (err) {
                        console.log(err);
                    }
                    history.back();
                });
        });
        this.logout = () => {
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
    }
    loginWithGoogle() {
        this.auth.authorize({
            connection: 'google-oauth2',
        });
    }
    loginWithlinkedIn() {
        this.auth.authorize({
            connection: 'linkedin',
        });
    }
    render() {
        const authProviderValue = Object.assign({}, this.state, { handleAuthentication: this.handleAuthentication, handleSignUp: this.handleSignUp, logout: this.logout, loginWithGoogle: this.loginWithGoogle, loginWithlinkedIn: this.loginWithlinkedIn, handleCallback: this.handleCallback });
        setInterval(() => {
            // return if not in browser
            if (typeof window == 'undefined')
                return;
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
        return (<authContext_1.AuthProvider value={authProviderValue}>
				{this.props.children}
			</authContext_1.AuthProvider>);
    }
}
exports.default = react_apollo_1.withApollo(Auth);
