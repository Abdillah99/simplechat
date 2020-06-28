import React, { useState, useContext } from 'react';

import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableNativeFeedback
} from 'react-native';

import { useAuthContext, firebaseGetCurrentUser } from 'modules';
import { registerUserService, currentUserOnService } from 'services';

export default SignUp = props =>{

    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();


    const { signUp: signUpContext }  = useAuthContext();

    const onChangeName = ( text ) => setName(text);
    const onChangeEmail = ( text ) => setEmail( text );
    const onChangePass = ( text ) => setPassword( text );

    const onSignUp = () =>{
        const user = {
            name:name,
            email:email,
            password:password,
        }

        //register user on firebase , context must be passed to update the auth context data
        registerUserService( user, signUpContext );
        
    } 

    return(
        
        <View style={styles.container}>

            <View style={styles.formContainer}>

                <Text style={styles.emailLabel}>Name</Text>

                <TextInput 
                    style={styles.emailTextInput} 
                    onChangeText={onChangeName} 
                    value={name} />

            </View>

            <View style={styles.formContainer}>

                <Text style={styles.emailLabel}>Email</Text>

                <TextInput 
                    style={styles.emailTextInput} 
                    onChangeText={onChangeEmail}
                    keyboardType='email-address' 
                    value={email} />

            </View>

            <View style={styles.formContainer}>

                <Text style={styles.emailLabel}>Password</Text>

                <TextInput 
                    style={styles.emailTextInput} 
                    onChangeText={onChangePass} 
                    secureTextEntry={true} 
                    value={password} />

            </View>

            <View style={styles.buttonContainer}>

                <TouchableNativeFeedback onPress={onSignUp}>

                    <View style={styles.buttonSignIn}>

                        <Text>SignUp</Text>

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
        padding: 12,
    },

    formContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emailLabel: {
        fontSize: 20,
        color: '#000',
    },
    emailTextInput: {
        alignSelf: 'stretch',
        backgroundColor: '#fefe'
    },
    buttonContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonSignIn: {
        alignSelf: 'stretch',
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 10,
    },
})