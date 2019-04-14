import React, { Component } from 'react';
import { Formik, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { AuthConsumer } from './authContext';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Input from '../form/Input';

const Form = styled.form``;
const Status = styled.span`
	color: red;
	margin-bottom: 1rem;
	transition: all 200ms ease-in-out;
`;
interface LoginProps {
	handleAuthentication: any;
}
interface LoginState {}

interface LoginFormValues {
	email: string;
	password: string;
}
class Login extends Component<LoginProps, LoginState> {
	LoginSchema = Yup.object().shape({
		email: Yup.string().required('Required'),
		password: Yup.string().required('Required'),
	});
	render() {
		return (
			<AuthConsumer>
				{({ handleAuthentication }: any) => (
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						render={(formikBag: FormikProps<LoginFormValues>) => (
							<React.Fragment>
								<Field
									name="email"
									render={({ field, form }: FieldProps<LoginFormValues>) => (
										<Input
											name="email"
											type="text"
											label="Email"
											field={field}
										/>
									)}
								/>
								<Field
									name="password"
									render={({ field, form }: FieldProps<LoginFormValues>) => (
										<Input type="password" label="Password" field={field} />
									)}
								/>
							</React.Fragment>
						)}
					/>
				)}
			</AuthConsumer>
		);
	}
}

export default Login;
