"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var authContext = react_1.createContext({
    authenticated: false,
    user: {},
    accessToken: '',
    handleAuthentication: function (_a) {
        var email = _a.email, password = _a.password;
    },
    logout: function () { },
    loginWithGoogle: function () { },
    loginWithlinkedIn: function () { },
    handleCallback: function () { },
    handleSignUp: function (_a) {
        var email = _a.email, password = _a.password;
    },
});
exports.AuthProvider = authContext.Provider;
exports.AuthConsumer = authContext.Consumer;
//# sourceMappingURL=authContext.js.map