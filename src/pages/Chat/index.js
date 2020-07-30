import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import {
	View,
} from 'react-native'

import {
	readData,
	storeData,
	myFirebase,
} from 'modules';

import { useAuthState, ChatContainer } from 'container'
import { useFocusEffect } from '@react-navigation/native';

import {
	markReadMessage,
	createPrivateChat,
	sendMessage,
	subscribeMessageUpdate,
	unSubscribe
} from 'services';
import {
	GiftedChat,
	Bubble,
	SystemMessage,
	Day,
} from 'react-native-gifted-chat';
import _ from 'lodash';

export default Chat = props => {
	const { chatId, chatTitle, user2data } = props.route.params;
	const { userData } = useAuthState();
	const [messages, setMessages] = useState([]);

	const myRef = useRef({ alreadySubscribe: false, alreadyLoadOffline: false, dataReady: false })

	const loadOfflineData = (id) => {
		if (id) {
			readData(id)
				.then(offlineCache => {
					myRef.current.alreadyLoadOffline = true
					setMessages(offlineCache);
				});
		}
		else {
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
		//object included in prevstate but with different value
		if(objIndex != -1 && !_.isEqual(prevstate[objIndex], nextState)){
			prevstate[objIndex] = nextState
			storeData(chatId,prevstate);
			return [...prevstate]
			//Object not included in prevstate
		} else if (objIndex == -1) {
			//Object not included in prevstate, and prevstate is not empty
			if (prevstate != undefined && prevstate.length > 1) {
				storeData( chatId,GiftedChat.append([...prevstate, nextState]));
				return  GiftedChat.append([...prevstate, nextState]);
				//Object not included in prevstate, and prevstate is empty
			} else if (prevstate.length <= 0 || prevstate == undefined) {
				storeData(chatId,[nextState])
				return [nextState];
			}
			///object is included in prevstate with same value 
		} else if (objIndex != -1 && _.isEqual(prevstate[objIndex], nextState)) {
			return [...prevstate];
		}
	}

	useEffect(() => {
		console.log('user 2 data ', user2data);
		if (!myRef.current.alreadyLoadOffline) loadOfflineData(chatId);

		if (myRef.current.alreadyLoadOffline) {

			if (!myRef.current.alreadySubscribe && chatId) {
				subscribeMessageUpdate(chatId, newMsg => {
					setMessages(prevstate => handleMsgAppend(prevstate,newMsg))
				})
				myRef.current.alreadySubscribe = true;
				markRead();
			}
		}
		return () => {
			unSubscribe()
		}
	}, [chatId, messages]);

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
	const _renderSystemMessage = (props) => {
		return (
			<SystemMessage
				{...props}
				textStyle={{
					fontFamily: 'SFUIText-Regular',

				}}
			/>
		)
	}

	const _renderDay = (props) => {
		return (
			<Day
				{...props}
				textStyle={{
					fontFamily: 'SFUIText-Reguler',

				}}
				dateFormat={'ddd DD MMM  hh:mm '}
			/>
		)
	}

	const chatBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					left: {
						backgroundColor: '#F1F0F0'
					},
					right: {
						backgroundColor: '#0084FF'
					},
				}}
				textStyle={{
					right: {
						fontFamily: 'SFUIText-Regular',
						fontSize: 14
					},
					left: {
						fontFamily: 'SFUIText-Regular',
						fontSize: 14
					}
				}}
			/>
		)
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
	<View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
		<GiftedChat
			onSend={msg => onSend(msg)}
			messages={messages}
			renderBubble={chatBubble}
			user={getUser}
			renderTime={() => { return null }}
			renderSystemMessage={_renderSystemMessage}
			renderDay={_renderDay}
			/>
	</View>
	)

}