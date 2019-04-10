"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var auth0 = require("auth0-js");
var react_apollo_1 = require("react-apollo");
var authContext_1 = require("./authContext");
var graphql_tag_1 = require("graphql-tag");
var Auth = (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.auth = new auth0.WebAuth({
            domain: _this.props.domain,
            clientID: _this.props.clientId,
            redirectUri: _this.props.callbackUrl,
            responseType: 'token id_token',
        });
        _this.state = {
            authenticated: typeof window === 'undefined' || window.localStorage.getItem('token')
                ? true
                : false,
            user: {
                role: 'visitor',
            },
            accessToken: '',
        };
        _this.handleAuthentication = function (_a) {
            var email = _a.email, password = _a.password;
            _this.auth.login({
                realm: 'Username-Password-Authentication',
                email: email,
                password: password,
            }, function (e) { return console.log(e); });
        };
        _this.handleSignUp = function (_a) {
            var email = _a.email, password = _a.password;
            console.log('started signup');
            _this.auth.signup({
                email: email,
                password: password,
                connection: 'Username-Password-Authentication',
            }, function (error, userPayload) {
                console.log(error, userPayload);
                if (error)
                    return;
                _this.auth.login({
                    email: email,
                    password: password,
                    realm: 'Username-Password-Authentication',
                }, function (e) {
                    console.log('done login');
                    _this.setSession({
                        user: { id: userPayload.sub || '' },
                        token: userPayload.accessToken,
                        login: { token: userPayload.idToken },
                    });
                });
            });
        };
        _this.setSession = function (data) {
            var user = {
                id: data.user.id,
                role: 'JOBSEEKER',
            };
            _this.setState({
                authenticated: true,
                accessToken: data.token,
                user: user,
            });
            var isBrowser = typeof window !== 'undefined';
            if (isBrowser) {
                window.localStorage.setItem('token', data.login.token);
            }
        };
        _this.handleCallback = function () { return __awaiter(_this, void 0, void 0, function () {
            var SIGNUP_MUTATION;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('callback started');
                SIGNUP_MUTATION = graphql_tag_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\t\t\t# Write your query or mutation here\n\t\t\tmutation(\n\t\t\t\t$email: String!\n\t\t\t\t$name: String!\n\t\t\t\t$authid: String!\n\t\t\t\t$authmethod: String!\n\t\t\t) {\n\t\t\t\tcreateUser(\n\t\t\t\t\tfirstName: $name\n\t\t\t\t\temail: $email\n\t\t\t\t\tauthid: $authid\n\t\t\t\t\tauthmethod: $authmethod\n\t\t\t\t) {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t"], ["\n\t\t\t# Write your query or mutation here\n\t\t\tmutation(\n\t\t\t\t$email: String!\n\t\t\t\t$name: String!\n\t\t\t\t$authid: String!\n\t\t\t\t$authmethod: String!\n\t\t\t) {\n\t\t\t\tcreateUser(\n\t\t\t\t\tfirstName: $name\n\t\t\t\t\temail: $email\n\t\t\t\t\tauthid: $authid\n\t\t\t\t\tauthmethod: $authmethod\n\t\t\t\t) {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t"])));
                !this.state.authenticated &&
                    this.auth.parseHash(function (err, authResult) {
                        if (authResult && authResult.accessToken && authResult.idToken) {
                            console.log('parseHash started');
                            _this.props.client
                                .mutate({
                                mutation: SIGNUP_MUTATION,
                                variables: {
                                    authid: authResult.idTokenPayload.sub,
                                    authmethod: 'local',
                                    name: authResult.idTokenPayload.nickname,
                                    email: authResult.idTokenPayload.email,
                                },
                            })
                                .catch(function (error) { return console.log(error); });
                            _this.setSession({
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
                return [2];
            });
        }); };
        _this.logout = function () {
            _this.setState({
                authenticated: false,
                user: {
                    role: 'visitor',
                },
                accessToken: '',
            });
            var isBrowser = typeof window !== 'undefined';
            if (isBrowser) {
                window.localStorage.removeItem('token');
            }
            _this.props.client.clearStore();
        };
        return _this;
    }
    Auth.prototype.loginWithGoogle = function () {
        this.auth.authorize({
            connection: 'google-oauth2',
        });
    };
    Auth.prototype.loginWithlinkedIn = function () {
        this.auth.authorize({
            connection: 'linkedin',
        });
    };
    Auth.prototype.render = function () {
        var _this = this;
        var authProviderValue = __assign({}, this.state, { handleAuthentication: this.handleAuthentication, handleSignUp: this.handleSignUp, logout: this.logout, loginWithGoogle: this.loginWithGoogle, loginWithlinkedIn: this.loginWithlinkedIn, handleCallback: this.handleCallback });
        setInterval(function () {
            if (typeof window == 'undefined')
                return;
            console.log('timer running');
            if (!localStorage.getItem('token') && _this.state.authenticated) {
                _this.setState({ authenticated: false });
            }
            else if (localStorage.getItem('token') && !_this.state.authenticated) {
                _this.setState({ authenticated: true });
            }
        }, 1000 * 60);
        return (React.createElement(authContext_1.AuthProvider, { value: authProviderValue }, this.props.children));
    };
    return Auth;
}(react_1.Component));
exports.default = react_apollo_1.withApollo(Auth);
var templateObject_1;
//# sourceMappingURL=Auth.js.map