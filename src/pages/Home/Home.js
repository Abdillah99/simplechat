import React, { useState, useEffect, useCallback,useRef } from 'react';
import {
    FlatList,
    View,
    AppState,
    SafeAreaView,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

import styles from './Style';

import {useAuthState,useChatState} from 'container'
import { ChatCard, MainHeader, SearchBar } from 'components'
import { setOnline } from 'services';

import _ from 'lodash';

const { width } = Dimensions.get('screen');

export default Home = (props) => {
    const appState = useRef(AppState.currentState);

    const { userData } = useAuthState();
    const { chats } = useChatState();

    const [ load, setLoad ] = useState(false);

    useEffect(()=>{
        setOnline(true);
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
          AppState.removeEventListener("change", _handleAppStateChange);
        };
   
    },[])

    const _handleAppStateChange = (nextAppState) => {
        if ( appState.current.match(/inactive|background/) &&nextAppState === "active") {
          setOnline(true);
        }else{
            setOnline(false);
        }
        appState.current = nextAppState;
    
      };
    
    var clientData = () => {
        var sorted = chats.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt);
        return sorted;
    }

    const onCardPress = (item) => {
        var res=  _.omit(item.members, userData.id);
        var u2id = Object.keys(res)[0];

        const params ={
            chatId: item._id, 
            chatTitle: item.title, 
            members:item.members, 
            type:item.type,
            user2Data:{
                id:u2id,
            }
        }
        props.navigation.navigate('Chat', params);
    }

    const renderItem = ({ item }) => {
        var rcntMsg = item.recent_message != undefined ? item.recent_message : false;
        var userDat = userData != undefined ? userData : {}; 
        var alreadyRead = rcntMsg.readedBy[userDat.id]? true  : false;
        return (
            <ChatCard
                _id={item._id}
                title={item.title}
                recent_message={rcntMsg}
                onPress={()=> onCardPress(item) }
                readed={alreadyRead}
                type={ item.type }
                members={item.members}
                />
        )
    }

    const renderEmptyChat = () =>{
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>You're not chatting with anyone yet</Text>
            </View>
        )
    }
    const renderHeader = useCallback(() =>{
        return(
            <SearchBar />
        )
    },[])

    const navigateCreateChat = useCallback(() =>{

        props.navigation.navigate('CreateChat');

    },[])
    
    const navigateProfile = useCallback(() =>{
        props.navigation.navigate('Profile');
    },[])

    return (

        <SafeAreaView style={styles.container}>
            <MainHeader 
                onRightButtonPress={navigateCreateChat}
                onLeftButtonPress={navigateProfile}/>
            <FlatList
                data={clientData()}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyChat}
                contentContainerStyle={{paddingBottom:8 }}
            />
        </SafeAreaView>

    )

}