import React, { createContext, useReducer, useMemo, useContext, useEffect } from 'react';
import { subScribeMyChatList, subscribeChatList } from 'services';

const ChatActionContext = createContext();
const ChatStateContext  = createContext();

const initialState = {
    isLoading: true,
    chats:[],
    messages:[],
}; 

const key ={
    INIT_FETCH          : 'INITIAL_FETCH',
    OFFLINE_STORAGE     : 'OFFLINE_STORAGE',
    UPDATE_CHAT_LIST    : 'UPDATE_CHAT_LIST',
    UPDATE_MESSAGE      : 'UPDATE_MSG',

}

function chatReducer( state, action ) {

	switch (action.type) {

        case key.INIT_FETCH :
            return{
                ...state,
                isLoading:false,
                chats: action.data.chats,
                messages: action.data.messages,
            };
        
        case key.UPDATE_CHAT_LIST : 
            return{
                ...state,
                chats: action.data,
            };

        case key.UPDATE_MESSAGE :
            return{
                ...state,
                messages: action.data,
            }
	
		default:
			throw new Error('dispatch action not found : ' + action.type);

		}

};



function ChatProvider(props) {

	const [state, dispatch] = useReducer(chatReducer, initialState);
    useEffect(() =>{

        subScribeMyChatList( newChat=>{

            let objIndx = state.chats.findIndex(obj => obj._id == newChat._id);
            // javascript find index returning -1 if object not exist
            if (objIndx != -1) {

            }
            else{
                state.chats.push( newChat );
                       
               chatAction.updateChatContext(  state.chats );
            }

        })

    },[]);

	const chatAction = useMemo( 
        () => ({
            initChatContext: async data =>{

                dispatch({ type: key.INIT_FETCH , data: data });
            },

            updateChatContext: data =>{
                
                dispatch({ type: key.UPDATE_CHAT_LIST, data:data });
            },
            
            updateMessageContext: data => {
                dispatch({ type: key.UPDATE_MESSAGE, data:data });
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