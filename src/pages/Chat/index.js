import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    InteractionManager,
} from 'react-native'

import {
    useAuthState,
    sendMessage,
    sendGroupMessage,
    refOff,
    createPrivateChat,
    useChatState,
    messageListener
} from 'modules';

import { subscribeChat } from 'services';
import {
    GiftedChat,
    Bubble,
    SystemMessage,
    Day,
} from 'react-native-gifted-chat';

export default Chat = props => {
    const { messages:msgContext } = useChatState();
    const { chatId, chatTitle, user2data } = props.route.params;

    const [messages, setMessages] = useState([]);
    const { userData } = useAuthState();
    const { id, name } = userData;


    useEffect(() => {
        props.navigation.setOptions({ title: chatTitle });
    
        if( chatId ){
            var idMsg = msgContext.findIndex( item => Object.keys(item) == chatId );
           
            if( idMsg != -1 )
            {
                var msgObj = msgContext ? Object.values( msgContext[idMsg] )[0]: [];
                var msgData = Object.values( msgObj );
               
                setMessages( msgData );
            }
          

            subscribeChat( chatId ,  msg =>{

                setMessages(prevstate => {
                let objIndx = prevstate.findIndex((obj => obj._id == msg._id));
                
                if (objIndx == -1) {
                    
                    return GiftedChat.append(prevstate, msg);

                }
                else {
                    //replace prevstate data with new updated data
                    prevstate[objIndx] = msg;

                    return [...prevstate];
                }

            });
        })
    
        } else {
            const msg = {
                _id: 1,
                text: "you're not chatting with this user yet",
                system: true,
            }

            setMessages(prevstate => {
                let objIndx = prevstate.findIndex((obj => obj._id == msg._id));
                // javascript find index returning -1 if object not exist and 1 if exist
                if (objIndx == -1) {
                    //found same state, update prevstate data  
                    return GiftedChat.append(prevstate, msg);

                }
                else {
                    return [...prevstate];
                }

            });
        }

    }, [chatId]);


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

        var { text, user, createdAt, _id: localId } = msg[0];

        var newMsg = {
            text: text,
            createdAt: Date.parse(createdAt),
            user,
        }

        var localMsg = {
            _id: localId,
            text: text,
            createdAt: Date.parse(createdAt),
            user,
            pending: true,
        };

        var msgAppend = GiftedChat.append(messages, localMsg);

        setMessages(msgAppend);

        if (chatId) {
            sendGroupMessage(chatId, newMsg, callback => {
                var updateId = msgAppend.findIndex(x => x._id === localId);
                msgAppend[updateId]._id = callback;
                setMessages(msgAppend);
            });
        }
        else {
            createPrivateChat(user2data, chatId => {
                props.navigation.setParams({ chatId: chatId });

                sendGroupMessage(chatId, newMsg, callback => {
                    var updateId = msgAppend.findIndex(x => x._id === localId);
                    msgAppend[updateId]._id = callback;

                    //remove system msg 
                    var sysMsg = msgAppend.findIndex(x => x._id == 1);
                    msgAppend.splice(sysMsg, 1);
                    setMessages(msgAppend);
                });
            });
        }


    }

    const getUser = { _id: userData.id, name: userData.name };

    return (

        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>

            <GiftedChat
                onSend={msg => onSend(msg)}
                messages={messages}
                isTyping={true}
                renderBubble={chatBubble}
                user={getUser}
                renderTime={() => { return null }}
                renderSystemMessage={_renderSystemMessage}
                renderDay={_renderDay}
            />

        </View>
    )

}