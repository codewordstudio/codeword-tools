import React, { Component } from 'react';
import { Formik, Field, FormikProps, FieldProps, Form } from 'formik';
import * as Yup from 'yup';
import { signup, authorizeWithGoogle } from '../../tools/auth/auth0';
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

interface SignupProps {}
interface SignupState {}

interface SignupFormValues {
	name: string;
	email: string;
	password: string;
}
// @todo convert it to SFC
class Signup extends Component<SignupProps, SignupState> {
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
					signup(email, password);
					// .catch((e: any) => {
					// 	console.log(e.graphQLErrors);
					// setStatus({
					// 	message: e.graphQLErrors[0].message,
					// });
					// 	return;
					// });
					// set formic submitting to false
					setSubmitting(false);
					// Redirect people after logging in.
					// props.history.push("/");
				}}
				render={(formikBag: FormikProps<SignupFormValues>) => (
					<React.Fragment>
						<SocialButton onClick={authorizeWithGoogle} platform="google">
							Sign Up With Google
						</SocialButton>
						<Form>
							<StyledFormDivider>
								<StyledFormDividerContent>Or</StyledFormDividerContent>
							</StyledFormDivider>
							<Field
								name="name"
								render={({ field, form }: FieldProps<SignupFormValues>) => {
									return (
										<Input
											name="name"
											type="text"
											label="Your Name"
											field={field}
											error={form.errors.name}
										/>
									);
								}}
							/>
							<Field
								name="email"
								render={({ field, form }: FieldProps<SignupFormValues>) => {
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
								render={({ field, form }: FieldProps<SignupFormValues>) => (
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
								Register
							</Button>
						</Form>
					</React.Fragment>
				)}
			/>
		);
	}
}

export default Signup;
