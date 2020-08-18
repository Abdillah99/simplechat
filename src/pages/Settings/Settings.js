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
    ToastAndroid,
    Alert
} from 'react-native';
import {
    useAuthContext,
    useAuthState,
    useSettingsAction,
    useSettingsState
} from 'container';
import { signOutService, setOnline, unSubscribe  } from 'services';

export default Settings = ( props )=>{

    const { userData }  = useAuthState();
    const { darkMode } = useSettingsState();
    const { toggleDarkMode } = useSettingsAction();
    const { signOut } = useAuthContext();

    const navigating = ( ) =>{
        props.navigation.navigate( 'Profile' );
    }  

    const handleSwitch = () =>{
        ToastAndroid.showWithGravity(
            "Not available yet",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
    }
    const onPressLogout = () =>{
        Alert.alert(
            null,
            'Are you sure to logout',
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () =>{
                setOnline(false);
                unSubscribe('chat_list');
                signOutService(signOut);
              }  }
            ],
            { cancelable: true }
          );
	
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
                    <Switch style={{flex:1}} trackColor="#fff" thumbTintColor="#fff" tintColor="#fff" value={darkMode} onValueChange={handleSwitch}/>
                </View>
                <TouchableNativeFeedback onPress={onPressLogout}>
                    <View style={styles.darkThemeContainer}>
                        <View style={{width:30, height:30, backgroundColor:'tomato', borderRadius:50, marginRight:8, justifyContent:'center', alignItems:'center'}}>
                            <Image style={{width:20, height:20, tintColor:'white'}} source={require('../../assets/icon/lock.png')} />
                        </View>
                        <Text style={styles.menuLabel}>Log Out</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        padding:20,
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
        fontSize:22, 
        fontFamily:'SFUIText-Bold',
    },
    menuLabel:{
        fontSize:14,
        fontFamily:'SFProText-Regular',
        textAlignVertical:'center',
    },
    darkThemeContainer:{
        alignSelf:'stretch', 
        height:40,
        marginVertical:8,  
        flexDirection:'row', 
        alignItems:'center',
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