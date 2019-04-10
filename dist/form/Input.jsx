"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Input = ({ children, onClick }) => (<input type="button" onClick={onClick}>
		{children}
	</input>);
exports.default = Input;
