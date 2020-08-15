import React, { useReducer, useEffect, useCallback,useRef } from 'react';
import {
    FlatList,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    Image
} from 'react-native';

import styles from './style';

import {useAuthState} from 'container'
import ChatCard from '../Card/Chat';
import SearchBar from '../SearchBar';
import { subscribeChat, unSubscribe } from 'services';
import { useNavigation } from '@react-navigation/native';

import _ from 'lodash';
import { readData } from 'modules';

const { width } = Dimensions.get('screen');

const initialState ={
    isLoading:true,
    loadedCache:false,
    chats:[],
}
const actionType = {
    init: 'INITIALIZE',
    updateChat: 'UPDATE_CHAT',
}
const handleChatUpdate = ( prevState, nextState ) =>{
    var prevChats = prevState.chats ? prevState.chats : [];

    if( prevChats !== undefined &&prevChats.length >= 1 ){
        var chatIndex = prevChats.findIndex(obj => obj._id == nextState._id );
        
        if( chatIndex != -1 && !_.isEqual(prevChats[chatIndex],nextState)){
            prevChats[chatIndex] = nextState;
            prevChats.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt);
            return{...prevState}
            // diff value
        }else if( chatIndex == -1 ){
            console.log('prevcht before unsfhit ', prevChats)
            prevChats.unshift(nextState);
            return{...prevState}
        }else if( chatIndex != -1 && _.isEqual(prevChats[chatIndex],nextState)){
            return{...prevState}
        }
    }else{
        return{
            ...prevState,
            chats:[nextState],
        }
    }
}
const chatReducer = (state,action ) =>{
    switch(action.type){
        case actionType.init:
            return{
                ...state,
                isLoading:false,
                chats:action.data,
                loadedCache:true
            }
        case actionType.updateChat:
            return handleChatUpdate( state, action.data );
            
        default:
            throw new Error('Reducer action invalid '+ action);
    }
}

export default Conversation = (props) => {
    const [ state, dispatch ] = useReducer(chatReducer,initialState);
    const { userData } = useAuthState();
    const navigation = useNavigation();

	const myRef = useRef({ alreadySubscribe: false })

    const loadCache = () =>{
        readData('chats')
        .then(res=>{
            dispatch({type:actionType.init, data:res});
        })
    }

    useEffect(()=>{
        if( !state.loadedCache )loadCache();
        if( state.loadedCache && !myRef.current.alreadySubscribe ){
            subscribeChat( res =>{
                console.log('subscriber CHAT got ', res);
                dispatch({type:actionType.updateChat, data:res})
            })
            myRef.current.alreadySubscribe = true;
        }
    },[state.loadedCache])


    const onCardPress = (item) => {
        requestAnimationFrame( () =>{
            var res  =  _.omit(item.members, userData.id);
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
            navigation.navigate('Chat', params);
            
     });
    }

    const renderItem = ({ item }) => {
        var userDat = userData != undefined ? userData : {}; 
        var alreadyRead = item.recent_message.readedBy[userDat.id]  ? true : false;

        return (
            <ChatCard
                item={item}
                readed={alreadyRead}
                onPress={onCardPress}
                />
        )
    }

    const renderEmptyChat = () =>(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', }}>
            <Image source={require('../../assets/images/people.png')} style={{width:200, height:200, tintColor:'whitesmoke'}}  />
            <Text style={{fontFamily:'SFProText-Regular', fontSize:12, color:'grey'}}>You're not chatting with anyone yet</Text>
        </View>
    )
    
    const renderHeader = useCallback(() =>( <SearchBar /> ),[])
    
    if( state.isLoading ) return (
        <View style={{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="whitesmoke" />
        </View>
    )

    return (
        <FlatList
            data={state.chats}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyChat}
            contentContainerStyle={{ paddingBottom:8, flex:1,}}
        />

    )

}