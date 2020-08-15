import React, { useState, useContext, useMemo } from 'react';

import {
	View,
	TextInput,
	Text,
	StyleSheet,
	TouchableNativeFeedback,
	ScrollView,
} from 'react-native';

import { signInService } from 'services';

import { useAuthContext, } from 'container';

export default SignIn = props => {

	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const { signIn: signInContext } = useAuthContext();

	const onchangeEmail = (text) => setEmail(text);
	const onchangePass = (text) => setPassword(text);


	const onSignIn = () => {
		if ( !email || email === "" || email.trim() == "" ) return alert('please write ur email');
		if ( !password || password === "" || password.trim() == "" ) return alert('please write ur password');
		const user = {
			email: email,
			password: password,
		};
		// pass userdata, and context function, so it can update the auth state context
		signInService(user, signInContext);

	}

	return (
		<ScrollView style={styles.container} >
			<View style={styles.formContainer}>
				<Text style={styles.headerLabel}>Welcome to Firebase SimpleChat!</Text>
			</View>
			<View style={styles.formContainer}>
				<Text style={styles.emailLabel}>Email</Text>
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onchangeEmail}
					keyboardType='email-address'
					value={email} />
			</View>
			<View style={styles.formContainer}>
				<Text style={styles.emailLabel}>Password</Text>
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onchangePass}
					secureTextEntry={true}
					value={password} />
			</View>
			<View style={styles.buttonContainer}>
				<Text>Forgot Password?</Text>
				<TouchableNativeFeedback onPress={onSignIn}>
					<View style={styles.buttonSignIn}>
						<Text>SignIn</Text>
					</View>
				</TouchableNativeFeedback>
				<Text onPress={() => props.navigation.navigate('SignUp')}>Create account</Text>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex : 1,
		backgroundColor	: '#fff',
		padding : 14,
	},
	headerLabel: {
		fontSize: 28,
		fontFamily: 'SFProDisplay-Regular',
		textAlign: 'left',
		color: 'dodgerblue'
	},
	formContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	emailLabel: {
		fontSize: 20,
		color: '#000',
		fontFamily: 'SFProText-Bold'
	},
	emailTextInput: {
		alignSelf: 'stretch',
		backgroundColor: 'whitesmoke',
		borderRadius:10,
	},
	buttonContainer: {
		flex: 2,
		flexDirection:'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	buttonSignIn: {
		alignSelf: 'stretch',
		backgroundColor: 'dodgerblue',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 10,
	},
})