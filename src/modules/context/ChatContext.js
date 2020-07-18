import React, { createContext, useReducer, useMemo, useContext, useEffect } from 'react';
import { subScribeMyChatList, subscribeChatList,unSubscribe } from 'services';

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
            return{
                ...state,
                chats: action.data,
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

                subscribeChatList( element._id , chatUpdate =>{
                    chatAction.updateChatContext(  chatUpdate );
                })

            });
            
            subScribeMyChatList( newChat=>{
                chatAction.updateChatContext( newChat );
            });

        }

        return unSubscribe();
        
    },[ state.initialized, state.chats ]);

	const chatAction = useMemo( 
        () => ({
            initChatContext: data =>{
                
                dispatch({ type: key.INIT_FETCH , data: data });
            },
            
            updateChatContext: data =>{

                var sameIndx = state.chats.findIndex( obj => obj._id == data._id );
                
                //same obj id but different value
                if( sameIndx != -1 && JSON.stringify(state.chats[sameIndx]) !== JSON.stringify( data ) ){
                    
                    state.chats[sameIndx] = data;

                    dispatch({ type: key.UPDATE_CHAT_LIST, data:state.chats });
                
                ///diff obj 
                }else if( sameIndx === -1 ){
                    state.chats.push( data );
                    dispatch({ type: key.UPDATE_CHAT_LIST, data:state.chats });
                }
                
            },
            
            updateMessageContext: data => {
                var sameIndx = state.messages.findIndex( obj => obj._id == data._id );
                //same obj but diff value
                if( sameIndx != -1 && JSON.stringify(state.messages[sameIndx]) !== JSON.stringify( data )){
                     //updte prevstate data
                    state.messages[sameIndx] = data;
                    
                    dispatch({ type: key.UPDATE_MESSAGE, data:state.messages });
                    
                    
                }else if( sameIndx === -1 ){
                    state.messages.push( data );

                    dispatch({ type: key.UPDATE_MESSAGE, data:state.messages });
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