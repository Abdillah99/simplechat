    import React, { createContext, useReducer, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import { subscribeChat, unSubscribe } from 'services';
import { readData } from 'modules';

const ChatActionContext = createContext();
const ChatStateContext  = createContext();

const initialState = {
    isLoading: true,
    initialized:false,
    chats:[],
    messages:[],
}

const actionType ={
    INITIALIZE_CHATS    : 'INITIALIZE_CHATS',
    UPDATE_CHAT_LIST    : 'UPDATE_CHAT_LIST',
    UPDATE_MESSAGE      : 'UPDATE_MSG',
    ADD_NEW_CHAT        : 'ADD_NEW_CHAT',
}

function chatReducer( state, action ) {
	switch (action.type) {

        case actionType.INITIALIZE_CHATS :
            return{
                ...state,
                isLoading:false,
                chats: action.data.chats,
                initialized:true,
            };
        
        case actionType.UPDATE_CHAT_LIST :
            return handleChatUpdate(state,action.data);

        case actionType.UPDATE_MESSAGE :
            return{
                ...state,
                messages: action.data,
            }
	
		default:
			throw new Error('dispatch action not found : ' + action.type);
		}

};

function ChatProvider(props) {
    const myRef = useRef({alreadySubscribe:false});
    const [state, dispatch] = useReducer(chatReducer, initialState);
    
    useEffect(() =>{
        if( state.initialized )
        {   
            if( !myRef.current.alreadySubscribe ){
                subscribeChat( res =>{
                    if( !state.chats.includes(res) ) chatAction.updateChatContext( res );
                })
                myRef.current.alreadySubscribe = true;
            }
        }
            

    },[ state.initialized, state.chats,state.listChatId ]);

	const chatAction = useMemo( 
        () => ({
            initializChats: x =>{
                readData('chats')
                .then(res =>{
                    dispatch({ type: actionType.INITIALIZE_CHATS , data: res });
                })
            },

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


function useChatAction(){
	const context = useContext( ChatActionContext );

	if (context === undefined) {
		throw new Error(' useChatAction must be used within Chat provider')
	}

	return context
}

function useChatState() {
	const context = useContext( ChatStateContext );

	if( context === undefined ){
		throw new Error('useChatState must be used within Chat provider')
	}

	return context
}

export { ChatProvider, useChatAction, useChatState }