import React, { useState, useContext , useMemo} from 'react';

import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    ScrollView,
} from 'react-native';

import { signInService } from '../../services';

import { useAuthContext, createUser } from '../../modules';

export default SignIn = props => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const { signIn:signInContext } = useAuthContext();

    const onchangeEmail = (text) => setEmail(text);
    const onchangePass  = (text) => setPassword(text);
    

    const onSignIn = () => {

        const user = {
            email: email,
            password: password,
        };

        // pass userdata, and context function, so it can update the auth state context
        signInService( user, signInContext );
        
    }

    const testFirebase =()=>{
        createUser();

    }

    return (

        <ScrollView style={styles.container}>
            
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

                <Text onPress={testFirebase}>Forgot Password?</Text>

                <TouchableNativeFeedback onPress={onSignIn}>

                    <View style={styles.buttonSignIn}>

                        <Text>SignIn</Text>

                    </View>

                </TouchableNativeFeedback>

                <Text onPress={() => props.navigation.navigate( 'SignUp')}>Create account</Text>

            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 12,
    },
    headerLabel:{
        fontSize:22,
        fontFamily:'SFUIText-Light',
        textAlign:'left',
        color:'dodgerblue'
    },  
    formContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emailLabel: {
        fontSize: 20,
        color: '#000',
        fontFamily:'SFUIText-Bold'
    },
    emailTextInput: {
        alignSelf: 'stretch',
        backgroundColor:'whitesmoke',
        borderWidth:0.4
    },
    buttonContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center'
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