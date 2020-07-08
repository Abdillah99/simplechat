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


import { useAuthState, chatListListener, refOff, useChatState,useChatAction } from 'modules';
import { ChatCard } from 'components'
import { subScribeMyChatList, subscribeChatList } from 'services';

export default Home = (props) => {

    const { userData } = useAuthState();
    const { chats } = useChatState();

    const [ clientChat, setClientChat ] = useState([]);

    useEffect(() => {
        //get all user chat id
        setClientChat( chats );

        clientChat.forEach( element => {
            //listening to each chat list update
            subscribeChatList( element._id , chatUpdate =>{

                setClientChat( prevstate =>{

                    let objIndx = prevstate.findIndex(obj => obj._id == chatUpdate._id);
                
                    if (objIndx != -1) {
                        prevstate[objIndx].recent_message = chatUpdate.recent_message;
                        return [...prevstate];
                    }
                    else 
                    {
                        console.log('not same obj ', objIndx);
                        return [...prevstate, chatUpdate ];
                    }

                })
          
            })
        });
     
        return refOff();
    }, [chats] );



    var clientData = () => {
        var sorted = clientChat.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt);
        return sorted;
    }

    const navigating = (id, title) => () => {
        props.navigation.navigate('Chat', { chatId: id, chatTitle: title, });
    }

    const renderItem = ({ item, index }) => {
        var rcntMsg = item.recent_message != undefined ? item.recent_message : '';
        var alreadyRead = rcntMsg.readedBy.includes(userData.id);

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
    
    return (

        <View style={styles.container}>

            <FlatList
                data={clientData()}
                extraData={ clientChat }
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateChat')} style={{ borderRadius: 50 }}>

                <View style={styles.hoverButtonContainer}>

                    <Image source={require('../../assets/icon/plus.png')} style={{ width: 20, height: 20, tintColor: 'white' }} />

                </View>

            </TouchableNativeFeedback>

        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    chatCard: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 80,
    },

    leftContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    centerContainer: {
        flex: 3.5,
        justifyContent: 'center',
    },
    labelTitle: {
        fontSize: 18,
        fontFamily: 'SFUIText-Regular',
        margin: 0,
        padding: 0,
    },
    msgLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    msgLabel: {
        maxWidth: '68%',
        color: 'gray',
        fontSize: 12,
        fontFamily: 'SFUIText-Light',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    msgTimeLabel: {
        flex: 1,
        fontSize: 10,
        color: 'gray',
        fontFamily: 'SFUIText-Light',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    rightContainer: {
        flex: 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationCircle: {
        width: 10,
        height: 10,
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 12,
    },
    hoverButtonContainer: {
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
        bottom: 10,
        right: 20,
        elevation: 3
    }
});