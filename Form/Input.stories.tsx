import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Input from './Input';

storiesOf('Input', module).add(
	'simple input',
	() => <Input onClick={action('button clicked')} />,
	{
		info: { inline: true },
	}
);
