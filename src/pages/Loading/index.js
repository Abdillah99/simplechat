import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { multiStore, storeData, readData } from 'modules';
import { useAuthState } from 'container';
import { initialFetchData,getUnreceivedMessage } from 'services';
import { StackActions } from '@react-navigation/native';

export default Loading = (props) => {
    const { isFirstTime } = useAuthState();
    
    const [loadingMsg, setLoadingMsg] = React.useState('Retreiving data from server');
    React.useEffect(() => {
        if( !isFirstTime ){
            getUnreceivedMessage()
            .then(res => {
                var sortMsg = res.chats.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt);
                storeData('chats', sortMsg);
                setLoadingMsg('Caching message data');
            })
            .finally( () =>{
                props.navigation.dispatch(
                    StackActions.replace('HomeTab')
                );
            });
            
        }else{
            initialFetchData()
            .then(data => {
                storeData('chats', data.parsedChat);
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


