import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    TouchableNativeFeedback,
    Image,
    StyleSheet
} from 'react-native'

import { ContactList } from 'components';
import { getPrivateChatId} from 'services';

export default CreateChat = (props)=> {

    const _navigating =()=>{
        requestAnimationFrame(()=>{
            props.navigation.navigate('CreateGroupChat')
        })
    }

    const createPrivateChat = async ( user2data ) =>{
        const id = await getPrivateChatId( user2data.id );
        props.navigation.navigate('Chat',{chatTitle: user2data.name,  user2Data : user2data, chatId:id , type:'private'});
    }
    
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback onPress={_navigating}>
                <View style={styles.btnContainer}>
                    <View style={styles.icon}>
                        <Image source={require('../../assets/icon/create-new-group.png')} />
                    </View>
                    <Text style={styles.label}>Create a New Group</Text>
                </View>
            </TouchableNativeFeedback>
            <ContactList 
                headerText="People"
                onItemPress={createPrivateChat}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    btnContainer:{
        alignSelf:'stretch', 
        flexDirection:'row', 
        alignItems:'center',
        height:60,
        padding:12,
    },
    icon:{
        width:40,
        height:40, 
        backgroundColor:'rgba(0,0,0,0.1)', 
        borderRadius:50, 
        justifyContent:'center', 
        alignItems:'center'
    },
    label:{
        fontFamily:'SFProText-Semibold', 
        marginLeft:8
    }
})