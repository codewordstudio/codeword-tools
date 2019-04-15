import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps, Form } from 'formik';
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
		email: Yup.string()
			.email('Oops! That looks like an invalid Email Address!')
			.required('Please fill out your email address!'),
		password: Yup.string().required('Please fill out your password!'),
	});
	render() {
		return (
			<AuthConsumer>
				{auth => (
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={this.LoginSchema}
						// Validate only on submit
						validateOnChange={false}
						validateOnBlur={false}
						onSubmit={(values, { setSubmitting, setStatus }) => {
							let { email, password } = values;
							// Try to login the user, if login doesn't happen throw the error
							auth.handleAuthentication({
								email,
								password,
							});
							// .catch((e: any) => {
							// 	console.log(e.graphQLErrors);
							// 	setStatus({
							// 		message: e.graphQLErrors[0].message,
							// 	});
							// 	return;
							// });
							// set formic submitting to false
							setSubmitting(false);
							// Redirect people after logging in.
							// props.history.push("/");
						}}
						render={(formikBag: FormikProps<LoginFormValues>) => (
							<Form>
								<SocialButton platform="google">
									Sign In With Google
								</SocialButton>
								<StyledFormDivider>
									<StyledFormDividerContent>Or</StyledFormDividerContent>
								</StyledFormDivider>
								<Field
									name="email"
									render={({ field, form }: FieldProps<LoginFormValues>) => {
										return (
											<Input
												name="email"
												type="text"
												label="Email"
												field={field}
												error={form.errors.email}
											/>
										);
									}}
								/>
								<Field
									name="password"
									render={({ field, form }: FieldProps<LoginFormValues>) => (
										<Input
											name="password"
											type="password"
											label="Password"
											field={field}
											error={form.errors.password}
										/>
									)}
								/>
								<Button
									color="black"
									type="submit"
									design="solid"
									large={true}
									full={true}
									disabled={formikBag.isSubmitting}
								>
									Login
								</Button>
							</Form>
						)}
					/>
				)}
			</AuthConsumer>
		);
	}
}

export default Login;
