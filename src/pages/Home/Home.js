import React, { useCallback, useReducer, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from './Style';
import { MainHeader, Conversation } from 'components'

import { useAuthState } from 'container'
import { readData } from 'modules';
import { subscribeChat, unSubscribe } from 'services';
import _ from 'lodash';

/*
*  initialized became true if finish loading local data & subscribing
*/
const initialState ={
    isLoading:true,
    initialized:false,
    chats:[],
}
const actionType = {
    init: 'INITIALIZE',
    updateChat: 'UPDATE_CHAT',
}
//*STATE HANDLING FUNCTION
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
                initialized:true,
                chats:action.data,
            }
        case actionType.updateChat:
            return handleChatUpdate( state, action.data );
            
        default:
            throw new Error('Reducer action invalid '+ action);
    }
}

export default Home = (props) => {
    const [ state, dispatch ] = useReducer(chatReducer,initialState);
    const { userData } = useAuthState();
    const navigation = useNavigation();

	const myRef = useRef({ alreadySubscribe: false })

    const _loadLocalData = () =>{
        readData('chats')
        .then(res=>{
            dispatch({type:actionType.init, data:res});
        })
    }

    const _pageInitialization =() =>{
        if( !state.initialized )_loadLocalData();
        if( state.initialized && !myRef.current.alreadySubscribe ){
            subscribeChat( res =>{
                console.log('subscriber CHAT got ', res);
                dispatch({type:actionType.updateChat, data:res})
            })
            myRef.current.alreadySubscribe = true;
        }
    }

    useEffect(() =>{
        _pageInitialization();
    },[state.initialized])

    useEffect(() =>{
        
        return () => {
            unSubscribe('chat_list');
        };
    },[])

    //UI FUNCTION
    const _onItemPress = (item) => {
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

    const navigateCreateChat = useCallback(() =>{
        props.navigation.navigate('CreateChat');
    },[])
    
    const navigateProfile = useCallback(() =>{
        props.navigation.navigate('Profile');
    },[])

    return (
        <View style={styles.container}>
            <MainHeader 
                onRightButtonPress={navigateCreateChat} 
                onLeftButtonPress={navigateProfile}/>
            <Conversation 
                state={state}
                onItemPress={_onItemPress} />
        </View>
    )

}