import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    TextInput,
    StyleSheet
} from 'react-native'

import { getAllUser } from 'modules';
import { getPrivateChatId } from 'services';
import { Avatar } from 'components';
import { StackActions } from '@react-navigation/native';

function CreateChat(props) {

    const [ userList, setUserList ] = useState();
    
    useEffect(() => {

        getAllUser(data => {

            setUserList( data );
            
        });

    },[]);

    const createPrivateChat = ( user2data ) => async() =>{
        
        const id = await getPrivateChatId( user2data.id );
        props.navigation.dispatch(
            StackActions.replace('Chat',{
                chatTitle: user2data.username,  user2data : user2data, chatId:id 
        }));
        
    }

    const _renderItem = ({ item, index }) => {

        return (
            
            <TouchableNativeFeedback onPress={ createPrivateChat( item ) }>

                <View style={styles.userContainer}>

                    <Avatar image={item.avatar} hasBorder={true}/> 

                    <Text style={styles.userLabel}>{item.username}</Text>

                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={userList}
                renderItem={_renderItem}
                keyExtractor={(item, index) => item.id}
            />

            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateGroupChat')}>
                
                <View style={styles.btnCreateGroup}>
                    
                    <Text style={styles.btnLabel}> Create Group Chat </Text>
             
                </View>

            </TouchableNativeFeedback>
        
        </View>
    )
}

export default CreateChat;

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:6,
    },
    btnCreateGroup:{
        alignSelf:'stretch', 
        height:60, 
        backgroundColor:'dodgerblue',
        justifyContent:'center',
         alignItems:'center',
         borderRadius:10,
    },
    btnLabel:{
        fontSize:16,
        color:'white',
        fontFamily:'SFUIText-Bold',
    },
    userContainer:{
        alignSelf: 'stretch', 
        flexDirection:'row',
        alignItems:'center', 
        minHeight: 40, 
        padding:10,
        backgroundColor:'white'
    },
    userLabel:{
        fontSize:14,
        fontFamily:'SFUIText-Bold',
        paddingHorizontal:8,
    }
})