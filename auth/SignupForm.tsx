import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps, Form } from 'formik';
import * as Yup from 'yup';
import { withApollo } from 'react-apollo';
import { signupWithLogin, authorizeWithGoogle } from '../../tools/auth/auth0';
import styled from 'styled-components';
import Button from '../../../components/Button';
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

interface SignupState {}

interface SignupFormValues {
	name: string;
	email: string;
	password: string;
}
// @todo convert it to SFC
// @todo add props definition
class Signup extends Component<any, SignupState> {
	SignupSchema = Yup.object().shape({
		name: Yup.string().required('Please fill out your name!'),
		email: Yup.string()
			.email('Oops! That looks like an invalid Email Address!')
			.required('Please fill out your email address!'),
		password: Yup.string().required('Please fill out your password!'),
	});

	render() {
		return (
			<Formik
				initialValues={{
					name: '',
					email: '',
					password: '',
				}}
				validationSchema={this.SignupSchema}
				// Validate only on submit
				validateOnChange={false}
				validateOnBlur={false}
				onSubmit={(values, { setSubmitting, setStatus }) => {
					let { email, password, name } = values;
					// Try to Signup the user, if Signup doesn't happen throw the error
					signupWithLogin(
						email,
						password,
						name,
						this.props.client,
						this.props.query
					).catch(err => {
						console.log(err);
					});
					setSubmitting(false);
				}}
				render={(formikBag: FormikProps<SignupFormValues>) => (
					<Form className="signup-form">
						<div className="signup-input-wrapper">
							<Field
								name="name"
								render={({ field, form }: FieldProps<SignupFormValues>) => {
									return (
										<Input
											className="signup-input-name"
											name="name"
											type="text"
											label="Your Name"
											field={field}
											error={form.errors.name || ''}
										/>
									);
								}}
							/>
						</div>
						<div className="signup-input-wrapper">
							<Field
								name="email"
								render={({ field, form }: FieldProps<SignupFormValues>) => {
									return (
										<Input
											className="signup-input-email"
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
						<div className="signup-input-wrapper">
							<Field
								name="password"
								render={({ field, form }: FieldProps<SignupFormValues>) => (
									<Input
										className="signup-input-password"
										name="password"
										type="password"
										label="Password"
										field={field}
										error={form.errors.password || ''}
									/>
								)}
							/>
						</div>
						<button
							className="signup-button"
							type="submit"
							disabled={formikBag.isSubmitting}
						>
							Register
						</button>
					</Form>
				)}
			/>
		);
	}
}

export default withApollo(Signup);
