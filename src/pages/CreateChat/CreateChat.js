import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    TextInput
} from 'react-native'

import { getAllUser, getPrivateChat } from '../../modules';

function CreateChat(props) {

    const [ userList, setUserList ] = useState();
    
    useEffect(() => {

        getAllUser(data => {

            setUserList( data );
            
        });

    },[]);

    const createPrivateChat = ( uid , name ) => () =>{

        getPrivateChat( uid , callback =>{
            console.log( callback );
            props.navigation.navigate('Chat', {chatId: callback, chatTitle: name, chatType:'private', user2id : uid });        
        });
    }

    const _renderItem = ({ item, index }) => {

        return (
            
            <TouchableNativeFeedback onPress={ createPrivateChat( item.id, item.username ) }>

                <View style={{ alignSelf: 'stretch', margin: 12, minHeight: 40, }}>
                    <Text>{item.username}</Text>
                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <View>

            <FlatList
                data={userList}
                renderItem={_renderItem}
                keyExtractor={(item, index) => item.id}
            />

            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateGroupChat')}>
                <View style={{ alignSelf:'stretch', height:60, backgroundColor:'purple',}}>
                    <Text> Create Group</Text>
                </View>
            </TouchableNativeFeedback>
        
        </View>
    )
}

export default CreateChat;
