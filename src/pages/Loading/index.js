import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { multiStore, clearAllData, readData } from 'modules';
import { useChatAction, useAuthState } from 'container';
import { initialFetchData,getUnreceivedMessage } from 'services';
import { StackActions } from '@react-navigation/native';

export default Loading = (props) => {
    const { initChatContext } = useChatAction();
    const { isFirstTime } = useAuthState();
    
    const [loadingMsg, setLoadingMsg] = React.useState('Retreiving data from server');
    React.useEffect(() => {
        if( !isFirstTime ){
            getUnreceivedMessage()
            .then(res => {
                const temp = {
                    chat: res.chats,
                }
                initChatContext(temp);

            })
            .finally( () =>{
                props.navigation.dispatch(
                    StackActions.replace('HomeTab')
                );
            });
            
        }else{
            initialFetchData()
            .then(data => {
                var chats = data.parsedChat;
                const temp = {
                    chat: chats,
                }
                initChatContext(temp);
                setLoadingMsg('Caching message data');
                return data.parsedMsg
            }).then(msg => {
                var multiSave = [];

                msg.forEach(item => {
                    var chatId = Object.keys(item)[0];
                    var msg = Object.values(item[chatId]);
                    var sortMsg = msg.sort((a, b) => b.createdAt - a.createdAt);
                    var built = [chatId, JSON.stringify(sortMsg)];
                    multiSave.push(built);
                })

                multiStore(multiSave);
            }).then(() => {
                props.navigation.dispatch(
                    StackActions.replace('HomeTab')
                );
            })
        }    

    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color='dodgerblue' />
            <Text>{loadingMsg} </Text>
        </View>
    )
}


