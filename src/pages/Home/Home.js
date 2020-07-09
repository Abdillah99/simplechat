import React, { useState, useEffect } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image
} from 'react-native';

import styles from './Style';

import { useAuthState, refOff, useChatState, ChatProvider } from 'modules';
import { ChatCard } from 'components'
import { subScribeMyChatList, subscribeChatList } from 'services';

export default Home = (props) => {

    const { userData } = useAuthState();
    const { chats } = useChatState();

    const [ clientChat, setClientChat ] = useState(chats);

    useEffect(() => {
        //get all user chat id
        setClientChat(chats);
        console.log('me run');
        
    }, [chats]);

    var clientData = () => {
        var sorted = clientChat.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt);
        return sorted;
    }

    const navigating = (id, title) => {
        props.navigation.navigate('Chat', { chatId: id, chatTitle: title, });

    }

    const renderItem = ({ item, index }) => {

        var rcntMsg = item.recent_message != undefined ? item.recent_message : '';

        var alreadyRead = rcntMsg.readedBy.includes( userData.id );

        console.log('render item run');

        return (
            <ChatCard
                _id={item._id}
                title={item.title}
                recent_message={rcntMsg}
                onPress={ navigating }
                readed={alreadyRead}
                />
        )
    }
    
    const createChat = () =>{
        props.navigation.navigate('CreateChat');
    }

    return (

        <View style={styles.container}>

            <FlatList
                data={clientData()}
                extraData={ chats }
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={createChat} style={{ borderRadius: 50 }} >

                <View style={styles.hoverButtonContainer}>

                    <Image source={require('../../assets/icon/plus.png')} style={{ width: 20, height: 20, tintColor: 'white' }} />

                </View>

            </TouchableNativeFeedback>

        </View>

    )

}