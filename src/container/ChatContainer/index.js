import React, { createContext, useReducer, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import { unSubscribe, subscribeChat } from 'services';

const ChatActionContext = createContext();
const ChatStateContext = createContext();

const initialState = {
	isLoading: true,
	chats: [],
	messages: [],
	initialized: false,
};

const key = {
	INIT_FETCH: 'INITIAL_FETCH',
	OFFLINE_STORAGE: 'OFFLINE_STORAGE',
	UPDATE_CHAT_LIST: 'UPDATE_CHAT_LIST',
	UPDATE_MESSAGE: 'UPDATE_MSG',
	ADD_NEW_CHAT: 'ADD_NEW_CHAT',
}

function chatReducer(state, action) {
	switch (action.type) {

		case key.INIT_FETCH:
			return {
				...state,
				isLoading: false,
				chats: action.data.chat,
				initialized: true,
			};

		case key.UPDATE_CHAT_LIST:
			return {
				...state,
				chats: action.data,
			}
		case key.UPDATE_MESSAGE:
			return {
				...state,
				messages: action.data,
			}

		default:
			throw new Error('dispatch action not found : ' + action.type);

	}

};

export default function ChatContainer(props) {
	const myRef = useRef({ alreadySubscribe: false });
	const [state, dispatch] = useReducer(chatReducer, initialState);

	useEffect(() => {
		if (state.initialized) {
			if (!myRef.current.alreadySubscribe) {
				subscribeChat(res => {
					if (!state.chats.includes(res)) chatAction.updateChatContext(res);
				})
				myRef.current.alreadySubscribe = true;

			}

		}

		return () => {
			unSubscribe()
		}

	}, [state.initialized, state.chats, state.listChatId]);

	const chatAction = useMemo(
		() => ({
			initChatContext: data => {

				dispatch({ type: key.INIT_FETCH, data: data });
			},

			updateChatContext: data => {

				var sameIndx = state.chats.findIndex(obj => obj._id == data._id);

				//same obj id but different value
				if (sameIndx != -1 &&
					JSON.stringify(state.chats[sameIndx]) !==
					JSON.stringify(data)) {

					console.log('same obj diff val ');
					state.chats[sameIndx] = data;
					dispatch({ type: key.UPDATE_CHAT_LIST, data: state.chats });

					///diff obj 
				} else if (sameIndx === -1) {
					console.log('diff obj ADD NEW CHAT ', data._id);
					state.chats.push(data);
					dispatch({ type: key.UPDATE_CHAT_LIST, data: state.chats });
				}

			},

			updateMessageContext: data => {
				var sameIndx = state.messages.findIndex(obj => obj._id == data._id);
				//same obj but diff value
				if (sameIndx != -1 &&
					JSON.stringify(state.messages[sameIndx]) !==
					JSON.stringify(data)) {
					//updte prevstate data
					state.messages[sameIndx] = data;

					dispatch({ type: key.UPDATE_MESSAGE, data: state.messages });

				} else if (sameIndx === -1) {
					state.messages.push(data);

					dispatch({ type: key.UPDATE_MESSAGE, data: state.messages });
				}

			}
		}),
	)

	return (
		<ChatActionContext.Provider value={chatAction}>

			<ChatStateContext.Provider value={state}>

				{props.children}

			</ChatStateContext.Provider>

		</ChatActionContext.Provider>
	)
}


function useChatAction() {
	const context = useContext(ChatActionContext);
	if (context === undefined) {
		throw new Error(' useChatAction must be used within Chat provider')
	}
	return context
}

function useChatState() {
	const context = useContext(ChatStateContext);
	if (context === undefined) {
		throw new Error('useChatState must be used within Chat provider')
	}
	return context
}


export { ChatContainer, useChatAction, useChatState }