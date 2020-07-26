import React, { useState, useEffect,useRef, useLayoutEffect, useCallback } from 'react'
import {
    View,
} from 'react-native'

import {
    useAuthState,
    readData,
    updateData,
} from 'modules';

import { useFocusEffect } from '@react-navigation/native';

import {  
    markReadMsg,
    createPrivateChat,
    sendMessage,
    subscribeMessageUpdate,
    unSubscribe 
} from 'services';
import {
    GiftedChat,
    Bubble,
    SystemMessage,
    Day,
} from 'react-native-gifted-chat';
import _ from 'lodash';

export default Chat = props => {
    const { chatId, chatTitle, user2data } = props.route.params;

    const { userData } = useAuthState();
    const { id, name } = userData;

    const [messages, setMessages] = useState([]);

    const myRef = useRef({alreadySubscribe:false, alreadyLoadOffline:false, dataReady:false})

    const loadOfflineData = ( id ) =>{
        if( id ){
            readData(id)
            .then( offlineCache =>{
                myRef.current.alreadyLoadOffline = true
                console.log('im loading offline ', offlineCache);
                setMessages(offlineCache);
            });

        }
        else
        {
            const sysMsg = {
                _id:0,
                text:"you're not chatting with this user yet ",
                system:true,
            }
            myRef.current.alreadyLoadOffline = true

            setMessages([sysMsg]) ;

        } 
    }
    useFocusEffect(
        useCallback(()=>{
            props.navigation.setOptions({ title: chatTitle });
        },[])
    )
    useEffect(() => {
        if(!myRef.current.alreadyLoadOffline ) loadOfflineData(chatId);

        if( myRef.current.alreadyLoadOffline ){
            
            if( !myRef.current.alreadySubscribe && chatId  ){
                subscribeMessageUpdate( chatId, newMsg =>{
                    
                    setMessages( prevstate=>{    
                        let idx = prevstate.findIndex( obj => obj._id == newMsg._id);                        
                        if( idx != -1 && !_.isEqual( prevstate[idx], newMsg ) ){
                            // console.log( 'same diff val index : ', idx , ' data ', prevstate[idx])
                            prevstate[idx] = newMsg
                            return [...prevstate]
                        }else if( idx == -1 ){
                            // console.log( 'not same at all index : ', idx , ' prevstate  ', prevstate );
                            if( prevstate != undefined && prevstate.length > 1 ){
                                const appended = GiftedChat.append([...prevstate,newMsg]);
                                // console.log( 'result appended prevstate not empty ', appended)
                                return appended;
                            }else if( prevstate.length <= 0 || prevstate == undefined ){
                                // console.log( 'result appended prevstate empty', prevstate)
                                return [newMsg];
                            }
                        }else if( idx != -1 && _.isEqual(prevstate[idx], newMsg )){
                            // console.log( 'same at all index : ', idx , ' prevstate  ', prevstate );
                            return [...prevstate]
                        }
                    })
                })
                myRef.current.alreadySubscribe = true;
            }
            
        }
        return () =>{
            unSubscribe()
        }  
    }, [ chatId,messages ]);

  

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
                dateFormat={'ddd DD MMM  hh:mm '}
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
            sendMessage( chatId, newMsg, newMsgId =>{
                var updateId = msgAppend.findIndex(x => x._id === localId);
                msgAppend[updateId]._id = newMsgId;
                setMessages(msgAppend);
            })

        }
        else {
            createPrivateChat( user2data, newId=>{
                sendMessage( newId, newMsg, newMsgId=>{
                    var indexRecentMsg = msgAppend.findIndex( x=> x._id === localId );
                    var sysMsg = msgAppend.findIndex( x=> x._id === 1 );
                
                    msgAppend[indexRecentMsg]._id = newMsgId;

                    msgAppend.splice( sysMsg, 1);
                    setMessages( msgAppend );   
                });
                props.navigation.setParams({ chatId:newId  });
            })
           
        
        }

    }

    const getUser = { _id: userData.id, name: userData.name, avatar: userData.profileImage };

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