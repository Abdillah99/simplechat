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

    const createPrivateChat = ( user2data ) => () =>{
        
        props.navigation.navigate('Chat', { chatTitle: user2data.username, chatType:'private', user2data : user2data  });        
        
    }

    const _renderItem = ({ item, index }) => {

        return (
            
            <TouchableNativeFeedback onPress={ createPrivateChat( item ) }>

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
