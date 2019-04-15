import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps } from 'formik';
import * as Yup from 'yup';
import { AuthConsumer } from './authContext';
import styled from 'styled-components';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import Input from '../form/Input';

const StyledFormDivider = styled.div`
	z-index: 0;
	position: relative;
	text-align: center;
	margin: 25px 0;
	&:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		border-bottom: 1px solid #e7e7e7;
		z-index: -1;
	}
`;
const StyledFormDividerContent = styled.div`
	display: inline-block;
	padding: 0 0.5em;
	background: #fff;
`;

interface LoginProps {}
interface LoginState {}

interface LoginFormValues {
	email: string;
	password: string;
}
// TODO: convert it to SFC
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
								<SocialButton platform="google">
									Sign In With Google
								</SocialButton>
								<StyledFormDivider>
									<StyledFormDividerContent>Or</StyledFormDividerContent>
								</StyledFormDivider>
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
										<Input
											name="password"
											type="password"
											label="Password"
											field={field}
										/>
									)}
								/>
								<Button
									color="black"
									large={true}
									full={true}
									disabled={formikBag.isSubmitting}
								>
									Continue With Email
								</Button>
							</React.Fragment>
						)}
					/>
				)}
			</AuthConsumer>
		);
	}
}

export default Login;
