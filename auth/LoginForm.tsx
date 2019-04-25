import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps, Form } from 'formik';
import * as Yup from 'yup';
import { authorize, authorizeWithGoogle } from '../../tools/auth/auth0';
import styled from 'styled-components';
import Button from '../../../components/Button';
// import SocialButton from '../../../components/SocialButton';
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
// @todo convert it to SFC
class Login extends Component<LoginProps, LoginState> {
	LoginSchema = Yup.object().shape({
		email: Yup.string()
			.email('Oops! That looks like an invalid Email Address!')
			.required('Please fill out your email address!'),
		password: Yup.string().required('Please fill out your password!'),
	});

	render() {
		return (
			<Formik
				initialValues={{
					email: '',
					password: '',
				}}
				validationSchema={this.LoginSchema}
				// Validate only on submit
				validateOnChange={false}
				validateOnBlur={false}
				onSubmit={async (values, { setSubmitting, setStatus }) => {
					let { email, password } = values;
					// Try to login the user, if login doesn't happen throw the error
					await authorize(email, password).catch(err => {
						if (err && err.code === 'access_denied') {
							// @todo Form Status and error message update
							// @body Form Set Status & display a pretty error message above the form
							// setStatus({
							// 	message: e.graphQLErrors[0].message,
							// });
						}
						console.log(err);
					});
				}}
				render={(formikBag: FormikProps<LoginFormValues>) => (
					<React.Fragment>
						<button onClick={authorizeWithGoogle}>Sign In With Google</button>
						<Form>
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
											error={form.errors.email || ''}
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
										error={form.errors.password || ''}
									/>
								)}
							/>
							<button
								// color="black"
								type="submit"
								// design="solid"
								// large={true}
								// full={true}
								disabled={formikBag.isSubmitting}
							>
								Login
							</button>
						</Form>
					</React.Fragment>
				)}
			/>
		);
	}
}

export default Login;
