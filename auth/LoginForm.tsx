import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps, Form } from 'formik';
import * as Yup from 'yup';
import {
	authorize,
	authorizeWithGoogle,
	RequestChangePassword,
} from '../../tools/auth/auth0';
import Button from '../../../components/Button';
// import SocialButton from '../../../components/SocialButton';
import Input from '../form/Input';
import { Link } from 'react-router-dom';

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
					<div className="login-form">
						<Form>
							<div className="login-input-wrapper">
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
							</div>
							<div className="login-input-wrapper">
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
							</div>

							<Link to="/reset" className="forgot-password">
								Forgot Password?
							</Link>

							<button
								className="login-button"
								type="submit"
								disabled={formikBag.isSubmitting}
							>
								Sign in
							</button>
						</Form>
					</div>
				)}
			/>
		);
	}
}

export default Login;
