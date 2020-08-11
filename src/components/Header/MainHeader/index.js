import React,{memo} from 'react'
import { View, Text, StyleSheet, Dimensions, Image,TouchableNativeFeedback } from 'react-native'

import {Avatar}from 'components';
import SearchBar from 'components/SearchBar';
import {useAuthState} from 'container'

const { width, height } = Dimensions.get('screen');

const MainHeader = (props) => {

    const {userData } = useAuthState();

    const profileImage = userData !== null ? userData.profileImage : ''; 
      return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.left}>
                    <Avatar size="xSmall" image={profileImage} onPress={props.onLeftButtonPress}/>
                    <Text style={styles.headerText}>Chats</Text>
                </View>
                <View style={styles.right}>
                    <TouchableNativeFeedback onPress={props.onRightButtonPress}>
                        <View style={styles.buttonContainer}>
                            <Image style={{width:16, height:16}} source={require('../../../assets/icon/create-chat.png')} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: height / 8,
        alignSelf: 'stretch',
        backgroundColor: 'white',
        paddingHorizontal:16,
    },
    top: {
        flex:1,
        flexDirection: 'row',
    },
    left:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center'

    },
    headerText:{
        fontSize:20,
        fontFamily:'SFProDisplay-Bold',
        marginLeft:8,
    },
    right:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    buttonContainer:{
        width:30, 
        height:30, 
        backgroundColor:'rgba(0,0,0,0.04)', 
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:12,
    },
    bottom: {
        flex: 0.8,
    }
})

export default memo(MainHeader)
