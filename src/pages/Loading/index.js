import React,{ useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { multiStore, multiUpdate } from 'modules';
import { useAuthState } from 'container';
import { initialFetchData, getUnreceivedMessage, setOnline, storeChats, getChatList } from 'services';
import { StackActions } from '@react-navigation/native';

export default Loading = (props) => {
    const { isFirstTime } = useAuthState();
    const [loadingMsg, setLoadingMsg] = useState('Retreiving data from server');  
    //First time login data initialize get all messages and chats data  then store at local storage
    const fetchAllChatsData = async () =>{
        const res = await initialFetchData()
        if(res.chats){
            await storeChats(res.chats);
            if(res.messages) await multiStore(res.messages);
        }
        return true;
    }
    //fetch unreceived message and update chats
    const syncDataWithServer = async () =>{
        //retreive unreceived message
        const msg = await getUnreceivedMessage();
        if(msg.length){
            //update local messages data
            setLoadingMsg('Caching message data');
            await multiUpdate(msg);
        }
        //sync chat list with server then save to local data
        const updateChats = await getChatList();
        await storeChats(updateChats);
        return true;    
    }

    const actionAfterLoading = () =>{
        props.navigation.dispatch( StackActions.replace('HomeTab') )
        setOnline(true)
    }

    useEffect(() => {
        if( isFirstTime ){
            fetchAllChatsData().then( res =>{
                if(res) actionAfterLoading()
            })
        }

        syncDataWithServer().then(res=>{
            if(res) actionAfterLoading()
        })

    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color='dodgerblue' />
            <Text>{loadingMsg} </Text>
        </View>
    )
}


