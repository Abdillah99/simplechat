import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
	View,
	Text
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
	markReceiveMessage
} from 'services';
import { GiftedChat } from 'react-native-gifted-chat';

import { ChatHeader, renderDay, renderBubble, renderSystemMessage,renderComposer,renderInputToolbar,renderSend } from 'components';
import _ from 'lodash';

export default Chat = props => {
	const { chatId, chatTitle, user2data } = props.route.params;
	const { userData } = useAuthState();
	const [messages, setMessages] = useState([]);

	const myRef = useRef({ alreadySubscribe: false, alreadyLoadOffline: false, dataReady: false })

	const loadOfflineData = (id) => {
		if(id){

			readData(id)
			.then(offlineCache => {
				myRef.current.alreadyLoadOffline = true;
				setMessages(offlineCache);
			});
	
		}else{
			const sysMsg = {
				_id: 0,
				text: "you're not chatting with this user yet ",
				system: true,
			}
			myRef.current.alreadyLoadOffline = true
			setMessages([sysMsg]);
		}
	}

	useFocusEffect(
		useCallback(() => {
			props.navigation.setOptions({ title: chatTitle });
		}, [])
	)

	const handleMsgAppend = ( prevstate, nextState) =>{
		//find object index return -1 if objet not found
		let objIndex = prevstate.findIndex(obj => obj._id == nextState._id);
		console.log('handle append obj ind ',objIndex, ' nex ',nextState);
		//object included in prevstate but with different value
		if(objIndex != -1 && !_.isEqual(prevstate[objIndex], nextState)){
			console.log('same obj diff val ')
			prevstate[objIndex] = nextState
			storeData(chatId,prevstate);
			// markReceiveMessage(chatId, nextState._id);
			return [...prevstate]
			//Object not included in prevstate
		} else if (objIndex == -1) {
			//Object not included in prevstate, and prevstate is not empty
			if (prevstate != undefined && prevstate.length >= 1) {
				console.log('not included not empty ')
				storeData( chatId,GiftedChat.append([...prevstate, nextState]));
				// markReceiveMessage(chatId, nextState._id);
				
				return  GiftedChat.append(prevstate, nextState);
				//Object not included in prevstate, and prevstate is empty
			} else if (prevstate.length <= 0 || prevstate == undefined) {
				console.log('not included empty ')
				storeData(chatId,[nextState]);
				// markReceiveMessage(chatId, nextState._id);
				return [nextState];
			}
			///object is included in prevstate with same value 
		} else if (objIndex != -1 && _.isEqual(prevstate[objIndex], nextState)) {
			console.log("SAME");
			// markReceiveMessage(chatId, nextState._id);
			return [...prevstate];
		}
	}

	useEffect(() => {

		if (!myRef.current.alreadyLoadOffline ) loadOfflineData(chatId);

		if (myRef.current.alreadyLoadOffline && !myRef.current.alreadySubscribe && chatId) {

			subscribeMessageUpdate(chatId, newMsg => {
				setMessages(prevstate =>{
				
				if( prevstate !== undefined && prevstate !== null){
					return handleMsgAppend(prevstate,newMsg)
				}else{
					return [newMsg]
				}
				})
						
			})
			myRef.current.alreadySubscribe = true;
			markRead();
		}
	
	}, [chatId, messages]);

	useEffect(()=>{
		
		return () =>{
			unSubscribe('messages/'+chatId);
		}
		
	},[])
	const markRead = () => {
		if (messages != undefined) {

			var res = messages.filter(item => {
				 return !item.readedBy[userData.id];
			});

			var rex = res.map( item => item._id);

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
		var msgAppend = GiftedChat.append(messages, localMsg);
		setMessages(msgAppend);
		if (chatId) {
			sendMessage(chatId, newMsg, newMsgId => {
				var updateId = msgAppend.findIndex(x => x._id === localId);
				msgAppend[updateId]._id = newMsgId;
				setMessages(msgAppend);
			})
		}
		else {
			createPrivateChat(user2data, newId => {
				sendMessage(newId, newMsg, newMsgId => {
					var indexRecentMsg = msgAppend.findIndex(x => x._id === localId);
					var sysMsg = msgAppend.findIndex(x => x._id === 1);
					msgAppend[indexRecentMsg]._id = newMsgId;
					msgAppend.splice(sysMsg, 1);
					setMessages(msgAppend);
				});
				props.navigation.setParams({ chatId: newId });
			})
		}
	}

	const getUser = { _id: userData.id, name: userData.name, avatar: userData.profileImage };
	return (
	<View style={{flex:1,flexDirection: 'column', backgroundColor: 'white',  }}>
		<GiftedChat
			onSend={msg => onSend(msg)}
			messages={messages}
			renderBubble={renderBubble}
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