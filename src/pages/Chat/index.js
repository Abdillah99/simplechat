import React, { useState, useEffect } from 'react'
import {
    View,
} from 'react-native'

import {
    useAuthState,
    sendMessage,
    sendGroupMessage,
    createPrivateChat,
    useChatState,
    messageListener,
    useChatAction
} from 'modules';

import { subscribeChat, markReadMsg } from 'services';
import {
    GiftedChat,
    Bubble,
    SystemMessage,
    Day,
} from 'react-native-gifted-chat';
import { useIsFocused } from '@react-navigation/native';

export default Chat = props => {
    const { chats, messages:msgContext } = useChatState();
    const { updateMessageContext } = useChatAction();
    const { chatId, chatTitle, user2data } = props.route.params;

    const { userData } = useAuthState();
    const { id, name } = userData;
    
    
    const initialData = () =>{
        
        if( chatId ){
            var idMsg = msgContext.findIndex( item => Object.keys(item) == chatId );
            if( idMsg != -1 ){
                var msgObj =  Object.values( msgContext[idMsg] )[0];
                return Object.values(msgObj);

            }else 
            {
                return[];

            }

        }
        else 
        {
           return[
                {
                    _id: 1,
                    text: "you're not chatting with this user yet",
                    system: true,
                }
            ]
        }
        
    }

    const [messages, setMessages] = useState( initialData() );

    useEffect(() => {
        props.navigation.setOptions({ title: chatTitle });
        if( chatId ){
           
            subscribeChat( chatId ,  msg =>{

                let objIndx = messages.findIndex(obj => obj._id == msg._id);
                
                if( objIndx != -1 && JSON.stringify(messages[objIndx]) !== JSON.stringify( msg ) )
                {
                    messages[objIndx] = msg;
                    setMessages( messages );
                }
                else if( objIndx === -1 )
                {
                    setMessages(GiftedChat.append(messages, msg));
                }

            })

            markRead();
        }

    }, [chatId]);

    const markRead = () =>{

        if( messages != undefined ){
                
            var res = messages.filter( item =>{ 
                return !item.readedBy.includes( userData.id )
            });

            if( res.length != 0 )
            {    
                markReadMsg( res, chatId  ); 

            }
        }

    }
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
            readedBy:[ userData.id ],
        }

        var localMsg = {
            _id: localId,
            text: text,
            createdAt: Date.parse(createdAt),
            readedBy:[ userData.id ],
            user,
            pending: true,
        };

        var msgAppend = GiftedChat.append(messages, localMsg);

        setMessages(msgAppend);

        if (chatId) {
            sendGroupMessage(chatId, newMsg, callback => {
                if( callback )
                {
                    var updateId = msgAppend.findIndex(x => x._id === localId);
                    msgAppend[updateId]._id = callback;
                    setMessages(msgAppend);

                }
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
                renderBubble={chatBubble}
                user={getUser}
                renderTime={() => { return null }}
                renderSystemMessage={_renderSystemMessage}
                renderDay={_renderDay}
            />

        </View>
    )

}