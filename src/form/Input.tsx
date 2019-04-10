import * as React from 'react';

interface Props {
	/**
	 * Click event handler
	 * @default null
	 */
	onClick?: () => void;
}

const Input: React.SFC<Props> = ({ children, onClick }) => (
	<input type="button" onClick={onClick}>
		{children}
	</input>
);

export default Input;
