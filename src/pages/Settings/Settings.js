import React from 'react';
import { Avatar } from 'components';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    TouchableNativeFeedback
} from 'react-native';

import { useAuthState, useAuthContext } from 'modules';
import { signOutService } from 'services';

export default function Settings( props ){

    const { userData }  = useAuthState();
    const { signOut: signOutContext } = useAuthContext();

    const onLogout = () => {

        signOutService( signOutContext );

    }

    const navigating = ( ) =>{
        props.navigation.navigate( 'Profile' );
    }

    return(
        <View style={styles.container}>
            
            <View style={styles.avatarContainer}>

                <Avatar hasBorder={true} />

                <Text style={{fontFamily:'SFUIText-SemiBold'}}>{userData.name}</Text>
                
                <TouchableOpacity onPress={navigating}>

                    <Text style={{fontFamily:'SFUIText-Light',color:'dodgerblue'}}>Edit Profile</Text>
                
                </TouchableOpacity>

            </View>
            
            <View style={styles.settingsContainer}>
                
                <Text style={styles.headingLabel}>Options</Text>

                <View style={styles.menuContainer}>
                   
                    <View style={styles.darkThemeContainer}>

                        <Text style={styles.menuLabel}>Dark Theme</Text>

                        <Switch style={{flex:1}} />

                    </View>
                    <TouchableNativeFeedback onPress={onLogout}>
                        
                        <View style={styles.logOutContainer}>

                            <Text style={styles.logOutLabel}>LogOut</Text>

                        </View>

                    </TouchableNativeFeedback>
                
                
                </View>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white',
        padding:6,
    },
    avatarContainer:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },

    settingsContainer:{
        flex:2,
        flexDirection:'column',
    },
    menuContainer:{
        flex:1,
    },
    headingLabel:{
        fontSize:22, fontFamily:'SFUIText-Bold',
    },
    menuLabel:{
        fontSize:14,
        fontFamily:'SFUIText-Regular',
        textAlignVertical:'center',
    },
    darkThemeContainer:{
        alignSelf:'stretch', 
        height:80,  
        flexDirection:'row', 
    },
    logOutContainer:{
        alignSelf:'stretch', 
        flexDirection:'row', 
    },
    logOutLabel:{
        fontFamily:'SFUIText-Light',
        color:'tomato',
    }
})