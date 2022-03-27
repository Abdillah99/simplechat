import React,{ useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { multiStore, storeData, readData } from 'modules';
import { useAuthState } from 'container';
import { initialFetchData, getUnreceivedMessage, setOnline, storeChats, getChatList } from 'services';
import { StackActions } from '@react-navigation/native';

export default Loading = (props) => {
    const { isFirstTime } = useAuthState();
    
    const [loadingMsg, setLoadingMsg] = useState('Retreiving data from server');  
    //First time login data initialize get all messages and chats data
    const fetchAllChatsData = async () =>{
        try {
            const chatsData = await initialFetchData();
            setLoadingMsg('Caching message data');
            const storeRes  = storeChats(chatsData.parsedChat);
            if(!storeRes) throw new Error('error storing chat data to local storage');
            //creating each chatId  have its own localstorage location then use its id to store new message
            var parsedChat = [];
            chatsData.forEach(item => {
                //getting chat id
                var chatId  = Object.keys(item)[0];
                var msg     = Object.values(item[chatId]);
                //sort message data by date
                var sortMsg = msg.sort((a, b) => b.createdAt - a.createdAt);
                //built new object data using chat id as object name
                var built   = [chatId, JSON.stringify(sortMsg)];
                
                parsedChat.push(built);
            })
        } catch (err) {
            
        }
   
    }

    //TODO Fetchunreceived bergunauntuk mengambil saja, sedangkan mengupdate received local dipindah disini oke
    //TODO BUAT MULTI UPDATE ASYNCSTORAGE
    //If user already logged in , only fetch unreceived messages
    const fetchUnreceived = async () =>{
        try {
            const unreceivedMSG   = await getUnreceivedMessage();
            if(unreceivedMSG){
                const updatedChatList = await getChatList();
                const storeStats      = await storeChats(updatedChatList);
                return storeStats;                
            }
        }
         catch (err) {
            throw new Error('failed fetching unreceived message',err)
        }
    }

    useEffect(() => {
        if( !isFirstTime ){
            fetchUnreceived().then(res=>{
                setLoadingMsg('Caching message data');
                if(res){
                    props.navigation.dispatch(
                        StackActions.replace('HomeTab')
                    )
                    setOnline(true)
                }
            })
            
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
                setOnline(true)
            }).catch(err =>{
                throw new Error(err);
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


