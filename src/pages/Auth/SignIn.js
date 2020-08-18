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
		<View style={styles.container} >
			<View style={styles.headerContainer}>
				
			</View>
			<View style={styles.formContainer}>
				<Text style={styles.headerLabel}> 
				SimpleChat
				</Text>
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onchangeEmail}
					keyboardType='email-address'
					placeholder='Email'
					defaultValue={email} />
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onchangePass}
					secureTextEntry={true}
					placeholder='Password'
					defaultValue={password} />
			</View>
			<View style={styles.buttonContainer}>
				<TouchableNativeFeedback onPress={onSignIn}>
					<View style={styles.buttonSignIn}>
						<Text style={styles.buttonLabel}>Login</Text>
					</View>
				</TouchableNativeFeedback>
				<Text onPress={() => props.navigation.navigate('SignUp')}>Create account</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex : 1,
		backgroundColor	: '#fff',
		padding : 22,
	},
	headerContainer:{
		flex:1,
	},
	headerLabel: {
		fontSize: 24,
		fontFamily: 'SFProDisplay-Bold',
		textAlign: 'left',
		color:'black'
	},
	formContainer: {
		flex:2,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
	},
	emailLabel: {
		fontSize: 20,
		color: '#000',
		fontFamily: 'SFProText-Bold'
	},
	emailTextInput: {
		alignSelf: 'stretch',
		backgroundColor: 'whitesmoke',
		borderColor:'silver',
		borderWidth:1,
		borderRadius:4,
		paddingHorizontal:10,
	},
	buttonContainer: {
		flex: 2,
		flexDirection:'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	buttonLabel:{
		fontSize:16,
		fontFamily:'SFProText-Semibold',
		color:'white'
	},	
	buttonSignIn: {
		alignSelf: 'stretch',
		backgroundColor: 'dodgerblue',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 5,
	},
})