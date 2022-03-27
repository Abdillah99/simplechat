import React, { useState } from 'react';

import {
	View,
	TextInput,
	Text,
	StyleSheet,
	TouchableNativeFeedback,
} from 'react-native';

import { useAuthContext } from 'container';
import { registerUserService } from 'services';

export default SignUp = props => {
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const { signUp: signUpContext } = useAuthContext();

	const onChangeName 	= (text) => setName(text);
	const onChangeEmail = (text) => setEmail(text);
	const onChangePass 	= (text) => setPassword(text);

	const onSignUp = () => {
		if ( !name || name === "" || name.trim() == "" ) return alert('please write ur name');
		if ( !email || email === "" || email.trim() == "" ) return alert('please write ur email');
		if ( !password || password === "" || password.trim() == "" ) return alert('please write ur password');
		
		const user = {
			name: name,
			email: email,
			password: password,
		}
		//register user on firebase , context must be passed to update the auth context data
		registerUserService(user, signUpContext).catch(err=>alert(err));

	}

	return (
		<View style={styles.container}  >
			<View style={styles.formContainer}>
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onChangeName}
					placeholder='Name'
					defaultValue={name} />
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onChangeEmail}
					keyboardType='email-address'
					placeholder='Email'
					defaultValue={email} />
				<TextInput
					style={styles.emailTextInput}
					onChangeText={onChangePass}
					secureTextEntry={true}
					placeholder='Password'
					defaultValue={password} />
			</View>
			<View>
				<TouchableNativeFeedback onPress={onSignUp}>
					<View style={styles.buttonRegister}>
						<Text style={styles.registerLabel}>Register Account</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
	
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
		padding: 22,
	},
	formContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	formLabel: {
		fontSize: 14,
		color: '#000',
		fontFamily:'SFProDisplay-Regular'
	},
	emailTextInput: {
		alignSelf: 'stretch',
		backgroundColor:'whitesmoke',
		borderColor:'silver',
		fontFamily:'SFProText-Semibold',
		borderWidth:1,
		borderRadius:4,
		marginVertical:8,
		paddingHorizontal:10,
	},
	buttonContainer: {
		flex: 2,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	buttonRegister: {
		alignSelf: 'stretch',
		backgroundColor: 'dodgerblue',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 10,
	},
	registerLabel:{ 
		fontFamily:'SFProText-Semibold',
		color:'white'
	}
})