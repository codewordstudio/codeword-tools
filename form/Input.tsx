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
	border: 1px solid;
	border-color: ${({ error }: any) => (error ? 'red' : '#e7e7e7')};
	transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);

	&:focus {
		border-color: #000;
	}

	&:focus + label,
	&:not(:placeholder-shown) + label {
		/* &:valid + label { */
		transform: translateY(-12px);
		font-size: 75%;
	}
`;

export const FloatingLabel: any = styled.label`
	position: absolute;
	font-size: 14px;
	color: ${({ error }: any) => (error ? 'red' : '')};
	margin-left: 15px; /* Should be same as input margin left */
	line-height: 56px;
	/* To also make the label clickable */
	// @todo label is not clickable because z-index is not -1
	z-index: 1;
	transition: all 150ms ease;
`;

export const StyledInputWrapper = styled.div`
	display: flex;
	margin-bottom: 20px;
`;

interface Props {
	/**
	 * Click event handler
	 * @default null
	 */
	label: string;
	field: {};
	type: string;
	error: string;
	onChange?: () => {};
	onBlur?: () => {};
}

const Input: React.SFC<Props> = ({
	name,
	label,
	field,
	type,
	error,
	onChange,
	onBlur,
}) => (
	<StyledInputWrapper>
		<FloatingInput
			error={error}
			type={type}
			placeholder=" "
			name={field.name}
			value={field.value}
			onChange={e => {
				onChange && onChange(e);
				field.onChange(e);
			}}
			onBlur={e => {
				onBlur && onBlur(e);
				field.onBlur(e);
			}}
		/>
		<FloatingLabel error={error} htmlFor={field.name}>
			{error || label}
		</FloatingLabel>
	</StyledInputWrapper>
);

export default Input;
