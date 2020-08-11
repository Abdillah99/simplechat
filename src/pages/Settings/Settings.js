import React from 'react';
import { Avatar } from 'components';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    TouchableNativeFeedback,
    Image,
    SectionList
} from 'react-native';
import {
    useAuthContext,
    useAuthState,
    useSettingsAction,
    useSettingsState
} from 'container';
import { signOutService } from 'services';

export default Settings = ( props )=>{

    const { userData }  = useAuthState();
    const { darkMode } = useSettingsState();
    const { toggleDarkMode } = useSettingsAction();
    const { signOut: signOutContext } = useAuthContext();

    const onLogout = () => {
        signOutService( signOutContext );
    }

    const navigating = ( ) =>{
        props.navigation.navigate( 'Profile' );
    }
    
 
    const nameLabel = userData? userData.name : 'null';
    const profileImage = userData? userData.profileImage : null;
    return(
        <View style={[styles.container,{backgroundColor:darkMode ? 'black' : 'white'}]}>
            
            <View style={styles.avatarContainer}>

                <Avatar image={profileImage} hasBorder={true} size="large" />

                <Text style={{fontFamily:'SFProDisplay-Bold', fontSize:20}}>{nameLabel}</Text>

            </View>
            
            <View style={styles.settingsContainer}>
                <View style={styles.darkThemeContainer}>
                    <View style={{width:30, height:30, backgroundColor:'black', borderRadius:50, marginRight:8, justifyContent:'center', alignItems:'center'}}>
                        <Image source={require('../../assets/icon/dark-mode.png')} />
                    </View>
                    <Text style={styles.menuLabel}>Dark Mode</Text>
                    <Switch style={{flex:1}} trackColor="#fff" thumbTintColor="#fff" tintColor="#fff" value={darkMode} onValueChange={toggleDarkMode}/>
                </View>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        padding:16,
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
        fontFamily:'SFProText-Regular',
        textAlignVertical:'center',
    },
    darkThemeContainer:{
        alignSelf:'stretch', 
        height:40,  
        flexDirection:'row', 
        alignItems:'center'
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