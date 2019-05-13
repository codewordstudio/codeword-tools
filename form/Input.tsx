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
	/* height: 56px; */
	padding-left: 0;
	padding-bottom: 0.65rem;
	/* padding-left: 15px;  Should be same as Label Margin left */
	font-size: 100%;
	/* padding-top: 29px; */
	position: relative;
	border: none;
	border-bottom: solid 2px #434343;
	color: #cdcdcd;
	/* border-color: ${({ error }: any) => (error ? 'red' : '#e7e7e7')}; */
	transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);

	&:focus {
		border-color: #787878;
	}

	&:focus + label,
	&:not(:placeholder-shown) + label {
		/* &:valid + label { */
		transform: translateY(-32px);
		font-size: 100%;
	}
`;

export const FloatingLabel: any = styled.label`
	position: absolute;
	font-size: 100%;
	color: ${({ error }: any) => (error ? 'red' : '')};
	line-height: 56px;
	z-index: 1;
	color: #787878;
	pointer-events: none;
	transition: all 150ms ease;
`;

export const StyledInputWrapper = styled.div`
	display: flex;
	/* margin-bottom: 20px; */
`;

interface Props {
	/**
	 * Click event handler
	 * @default null
	 */
	name: string;
	label: string;
	field: any;
	type: string;
	error: string;
	onChange?: any;
	onBlur?: any;
}

const Input: React.SFC<Props & React.HTMLProps<HTMLInputElement>> = ({
	name,
	label,
	field,
	type,
	error,
	onChange,
	onBlur,
	...props
}) => (
	<StyledInputWrapper>
		<FloatingInput
			error={error}
			type={type}
			placeholder=" "
			// @todo: Remove this name, because we're already getting it in field
			// @body: this will break components,
			name={name || field.name}
			value={field.value}
			onChange={(e: any) => {
				onChange && onChange(e);
				field && field.onChange(e);
			}}
			onBlur={(e: any) => {
				onBlur && onBlur(e);
				field && field.onBlur && field.onBlur(e);
			}}
			{...props}
		/>
		<FloatingLabel error={error} htmlFor={field.name}>
			{error || label}
		</FloatingLabel>
	</StyledInputWrapper>
);

export default Input;
