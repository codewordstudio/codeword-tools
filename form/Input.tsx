import * as React from 'react';
import styled from 'styled-components';

export const ResetInput = styled.input`
	flex-shrink: 1;
	border: 0;
	padding: 8px;
	display: inline-block;
	vertical-align: middle;
	white-space: normal;
	background: none;
	line-height: 1;

	/* Browsers have different default form fonts */
	font-size: inherit;
	font-family: inherit;

	&:focus {
		outline: initial;
	}
`;

export const FloatingInput: any = styled(ResetInput)`
	width: 100%;
	height: 56px;
	padding-left: 15px; /*  Should be same as Label Margin left */
	font-size: 14px;
	padding-top: 29px;
	position: relative;
	border: 1px solid #e7e7e7;
	transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);

	&:focus {
		border: 1px solid #000;
	}

	&:focus + label,
	&:not(:placeholder-shown) + label {
		/* &:valid + label { */
		transform: translateY(-12px);
		font-size: 75%;
	}
`;

export const FloatingLabel = styled.label`
	position: absolute;
	font-size: 14px;
	margin-left: 15px; /* Should be same as input margin left */
	line-height: 56px;
	/* To also make the label clickable */
	z-index: -1;
	transition: all 150ms ease;
`;

export const StyledInputWrapper = styled.div`
	position: relative;
`;

interface Props {
	/**
	 * Click event handler
	 * @default null
	 */
	name: string;
	label: string;
	field: {};
	type: string;
}

const Input: React.SFC<Props> = ({ name, label, field, type }) => (
	<StyledInputWrapper>
		<FloatingInput type={type} placeholder=" " {...field} />
		<FloatingLabel htmlFor={name}>{label}</FloatingLabel>
	</StyledInputWrapper>
);

export default Input;
