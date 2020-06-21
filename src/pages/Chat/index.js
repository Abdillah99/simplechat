import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
} from 'react-native'
import { useAuthState, getMessage, sendMessage, sendGroupMessage, refOff,sendPrivateMessage } from '../../modules';

import {
    GiftedChat,
    Bubble,
    SystemMessage,
    Day,
} from 'react-native-gifted-chat';

export default Chat = props => {

    const [messages, setMessages] = useState([]);
    const { userData } = useAuthState();
    const { id, name } = userData;

    const { chatId, chatTitle , chatType,user2id } = props.route.params;


    useEffect(() => {

        props.navigation.setOptions({ title: chatTitle });

        getMessage(chatId, msg => {

            setMessages(prevstate => {
                let objIndx = prevstate.findIndex((obj => obj._id == msg._id));
                // javascript find index returning -1 if object not exist and 1 if exist
                console.log( objIndx );
                if (objIndx == -1) {
                    //found same state, update prevstate data  
                    return GiftedChat.append(prevstate, msg);

                }
                else 
                {
                    return [...prevstate];
                }

            });

        });



        return refOff();

    }, []);

    const _renderSystemMessage = (props) => {

        return (

            <SystemMessage
                {...props}
                textStyle={{
                    fontFamily: 'SFUIText-Regular',

                }}
            />
        )
    }

    const _renderDay = (props) => {
        return (
            <Day
                {...props}
                textStyle={{
                    fontFamily: 'SFUIText-Reguler',

                }}
                dateFormat={'ddd hh:mm'}
            />
        )
    }

    const chatBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#F1F0F0'
                    },
                    right: {
                        backgroundColor: '#0084FF'
                    },
                }}
                textStyle={{
                    right: {
                        fontFamily: 'SFUIText-Regular',
                        fontSize: 14
                    },
                    left: {
                        fontFamily: 'SFUIText-Regular',
                        fontSize: 14
                    }
                }}
            />
        )
    }

    const onSend = (msg) => {

        let { text, user } = msg[0];

        var newMsg = {
            text: text,
        }

        chatType == 'group' ? sendGroupMessage(chatId, newMsg) 
                            : sendPrivateMessage(user2id, chatId , newMsg );

    }

    const getUser = { _id: userData.id, name: userData.name };


    return (

        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>

            <GiftedChat
                onSend={msg => onSend(msg)}
                messages={messages}
                renderBubble={chatBubble}
                messageIdGenerator={null}
                user={getUser}
                renderTime={() => { return null }}
                renderSystemMessage={_renderSystemMessage}
                renderDay={_renderDay}
            />

        </View>
    )

}