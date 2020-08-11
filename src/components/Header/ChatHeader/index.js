import React,{memo,useEffect,useState} from 'react'
import { View, Text, Image, TouchableNativeFeedback, StyleSheet, Dimensions } from 'react-native'
import Avatar from '../../Avatar';
import {subsCribeUserStatus,unSubscribe} from 'services';

const {width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
    container:{
        alignSelf:'stretch',
        height:Math.round(height/13),
        minHeight:60,
        backgroundColor:'white',
        flexDirection:'row',
        elevation:4,
        paddingHorizontal:8,
    },
    leftContainer:{
        flex:0.7,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    centerContainer:{
       flex:3,
        flexDirection:'row',
        alignItems:'center',
    },
    avatarContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    titleContainer:{
        paddingHorizontal:8,
    },
    titleStyle:{
        fontSize:14,
        fontFamily:'SFProText-Bold',
        padding:0,
    },
    statusStyle:{
        fontSize:10,
        fontFamily:'SFProText-Medium',
        color:'rgba(0,0,0,0.3)'
    },
    rightContainer:{
        flex:1,
    },
})

const ChatHeader = ({scene, previous, navigation}) => {
    const { options } = scene !== undefined ? scene.descriptor : {};
    const { params } = scene.route !== undefined ? scene.route: {};
    
    const [ status, setStatus ] = useState(false);
    const [ profile, setProfile ] = useState('');

     const title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;

    const avatar = 
        profile !== undefined 
        ? profile.avatar 
        : '';

    const onArrowPress =() =>{
         navigation.goBack()
    }
    useEffect(() => {
        console.log("header didmount");
        
        if( params.type !== undefined && params.type == 'private' && params.user2Data !== undefined ){
            subsCribeUserStatus( params.user2Data.id , res =>{
                setProfile(res)
            })

        }
        return () => {
            unSubscribe('users/'+params.user2Data.id);
        }
    }, [])
    return (
        <View style={styles.container}>
            {previous && <TouchableNativeFeedback onPress={onArrowPress}>
                <View style={styles.leftContainer}>
                    <Image style={{width:26,height:26, }} source={require('../../../assets/icon/arrow-left.png')}/>
                </View>
            </TouchableNativeFeedback> }
            <TouchableNativeFeedback onPress={onArrowPress}>
                <View style={styles.centerContainer}>
                    <View style={styles.avatarContainer}>
                        <Avatar hasBorder={true} size="xSmall" image={avatar}/>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleStyle}>{title}</Text>
                        <Text style={styles.statusStyle}>{profile.online?'Online':'Offline'}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
            <View style={styles.rightContainer}>
            </View>
        </View>
    )
}

export default memo(ChatHeader)
