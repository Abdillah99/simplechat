import React, { createContext, useReducer, useMemo, useContext, useEffect } from 'react';
import { subScribeMyChatList, subscribeChatList } from 'services';

const ChatActionContext = createContext();
const ChatStateContext  = createContext();

const initialState = {
    isLoading: true,
    chats:[],
    messages:[],
    
    initialized:false,
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
                initialized:true,
            };
        
        case key.UPDATE_CHAT_LIST :
            
            let objIndx = state.chats.findIndex(obj => obj._id == action.data._id);
                    
            if (objIndx != -1) {
                console.log('same obj')
                state.chats[objIndx].recent_message = action.data.recent_message;
                return {...state};
            }
            else 
            {
                console.log('not same obj ');
                state.chats.push( action.data );

                return {...state};
            }
     

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

        if( state.initialized )
        {
            state.chats.forEach( element => {
                console.log( 'chats update listener ' , element.title);
                subscribeChatList( element._id , chatUpdate =>{
                    console.log( 'subscribe run ' , chatUpdate);
                    chatAction.updateChatContext(  chatUpdate );
                })
            });
            
            subScribeMyChatList( newChat=>{
                console.log( 'got new chat list' , newChat );
                chatAction.updateChatContext(  newChat );
            });

           

        }

    },[ state.initialized, state.chats ]);

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