import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react'
import {
	View,
	Text,
	ActivityIndicator,
	KeyboardAvoidingView
} from 'react-native'

import {
	readData,
	storeData,
} from 'modules';

import { useAuthState } from 'container'
import { useFocusEffect } from '@react-navigation/native';

import {
	markReadMessage,
	createPrivateChat,
	sendMessage,
	subscribeMessageUpdate,
	unSubscribe,
} from 'services';
import { GiftedChat } from 'react-native-gifted-chat';

import { renderDay, renderBubble, renderSystemMessage,renderComposer,renderInputToolbar,renderSend } from 'components';
import _ from 'lodash';

const actionType ={
	INIT_SUCCESS: 'INIT_SUCCESS',
	INIT_FAILED:'INIT_FAILED',
	UPDATE_MESSAGE : 'UPDATE_MESSAGE',
}
const handleMsgAppend = ( chatId, prevstate, nextState,) =>{
	// previous message object 
	var prevMsg = prevstate.messages;
	//find object index return -1 if objet not found
	let objIndex = prevMsg.findIndex(obj => obj._id == nextState._id);
	//object included in prevstate but with different value
	console.log('append msg  prevmsg is ', prevMsg, ' index is ', objIndex, ' nexstate ', nextState);
	
	if(objIndex != -1 && !_.isEqual(prevMsg[objIndex], nextState)){
		console.log('same obj diff val ')
		prevMsg[objIndex] = nextState
		storeData(chatId,prevMsg);
		return{...prevstate}
	//Object not included in prevstate
	} else if (objIndex == -1) {
		//Object not included in prevstate, and prevstate is not empty
		if (prevMsg != undefined && prevMsg.length >= 1) {
			console.log('not included not empty ')
			storeData( chatId,GiftedChat.append(prevMsg, nextState));				
			return {
				...prevstate,
				messages:GiftedChat.append(prevMsg, nextState),
			}
			//Object not included in prevstate, and prevstate is empty
		} else if (prevMsg.length <= 0 || prevMsg == undefined) {
			console.log('not included empty ')
			storeData(chatId,[nextState]);
			return {
				...prevstate,
				messages:GiftedChat.append(prevMsg, nextState),
			}
		}
		///object is included in prevstate with same value 
	} else if (objIndex != -1 && _.isEqual(prevMsg[objIndex], nextState)) {
		console.log('object is included in prevstate with same value  ')

		return {
			...prevstate,
		}
	}
}
const chatReducer = (state, action) =>{
	switch(action.type){
		case actionType.INIT_SUCCESS:
			return{
				isLoading:false,
				messages:action.data,
				loadedCache:true,
			}
		case actionType.INIT_FAILED:
			return{
				...state,
				isLoading:false,
				loadedCache:false,
			}
		
		case actionType.UPDATE_MESSAGE: 
			return handleMsgAppend( action.data.chatId, state,action.data.msg );

		default:
			throw new Error('Not valid dispatch action '+ action.type);
	}
}

export default Chat = props => {
	const initialState ={
		messages:[],
		isLoading:true,
		loadedCache: false,
	}
	const { chatId, chatTitle, user2Data, } = props.route.params;
	const { userData } = useAuthState();
	const [state, dispatch] = useReducer(chatReducer,initialState);

	const myRef = useRef({ alreadySubscribe: false })

	const loadCache = (id) => {
		if(id){
			readData(id)
			.then(offlineCache => {
				dispatch({type:actionType.INIT_SUCCESS, data:offlineCache})
			});

		}else{
			const sysMsg = {
				_id: 0,
				text: "you're not chatting with this user yet ",
				system: true,
			}
			dispatch({type:actionType.INIT_SUCCESS, data:[sysMsg]})
		}
	}

	useFocusEffect(
		useCallback(() => {
			props.navigation.setOptions({ title: chatTitle });
		}, [])
	)


	useEffect(()=>{
		if( !state.loadedCache ) loadCache( chatId );

		if( state.loadedCache && chatId && !myRef.current.alreadySubscribe ){
			subscribeMessageUpdate(chatId, newMsg => {
				// console.log('subscriber got data ', newMsg);
				dispatch({type:actionType.UPDATE_MESSAGE, data:{msg:newMsg, chatId:chatId}})
			})
			myRef.current.alreadySubscribe = true;
			markRead();
		}

	},[ chatId, state.loadedCache] )


	useEffect(()=>{
		return () =>{
			unSubscribe('messages/'+chatId);
		}
		
	},[])

	const markRead = () => {

		if (state.messages !== undefined && state.messages.length >= 1 ) {
			var res = state.messages.filter(item => {
				if(item !== null ) return !item.readedBy[userData.id];
				if(item === null ) return item;
			});

			var rex = res.map( item =>{
				if( item !== null ) return item._id;
			});

			if (rex.length != 0) {
				markReadMessage(chatId, rex );
			}
		}
	}

	const onSend = (msg) => {
		var { text, user, createdAt, _id: localId } = msg[0];
		var newMsg = {
			text: text,
			createdAt: Date.parse(createdAt),
			user,
			readedBy: [userData.id],
		}
		var localMsg = {
			_id: localId,
			text: text,
			createdAt: Date.parse(createdAt),
			readedBy: [userData.id],
			user,
			pending: true,
		};

		if (chatId) {
			sendMessage(chatId, newMsg, newMsgId => {
				localMsg._id = newMsgId;
				dispatch({type:actionType.UPDATE_MESSAGE, data:{msg:localMsg, chatId:chatId}})
			})
		}
		else {
			createPrivateChat(user2Data, newId => {
				sendMessage(newId, newMsg, newMsgId => {
					localMsg._id = newMsgId;
					dispatch({type:actionType.INIT_SUCCESS, data:[localMsg]})
				});
				props.navigation.setParams({ chatId: newId });
			})
		}
	}

	const _renderLoading = () =>(
		<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
			<ActivityIndicator size="large" color="whitesmoke" /> 
		</View>
	)

	var getUser = { _id: userData.id, name: userData.name, avatar: userData.profileImage };
	return (
	<View style={{flex:1, backgroundColor: 'white',  }}>
		<GiftedChat
			onSend={msg => onSend(msg)}
			messages={state.messages}
			renderBubble={renderBubble}
			renderLoading={_renderLoading}
			user={getUser}
			renderTime={() => { return null }}
			renderSystemMessage={renderSystemMessage}
			renderDay={renderDay}
			renderComposer={renderComposer}
			renderInputToolbar={renderInputToolbar}
			renderSend={renderSend}
			messagesContainerStyle={{paddingVertical:12}}
			timeFormat='HH.MM'
			alwaysShowSend={true}
			/>
	</View>
	)

}