import { chatListListener, messageListener, initializeChatData, myChatListListener, myFirebase, refOff } from 'modules';
import auth from '@react-native-firebase/auth';

const getMyUid = ()=> {
    return auth().currentUser.uid != null ?auth().currentUser.uid : '' ;
}

const subscribeChatList = ( id  , callback ) =>{
    
        chatListListener( id, onSuccess, onFailed );

        function onSuccess( res ){
            var value = res.val();
            
            if( value.type == 'private' ) value.title = value.title[ getMyUid() ];
            if( value.recent_message.user != undefined && value.recent_message.user._id == getMyUid()) value.recent_message.user.name = 'You';

            callback( value );
        
        }
    
        function onFailed( err ){
            console.log( 'Error subscribeChat : ' + err );
        }
 
}

const subscribeChat =( chatId , callback )=>{
    
    messageListener( chatId, onSuccess, onFailed );

    function onSuccess( res ){

        callback( res );
    
    }

    function onFailed( err ){
        console.log( 'Error subscribeChat : ' + err );
    }
}

const markReadMsg = ( data=[], chatId ) =>{

    markReadMessage(  chatId , data );    

    function onSuccess( res ){

    
    }

    function onFailed( err ){
        console.log( 'Error subscribeChat : ' + err );
    }
} 


const unSubscribe = () =>{
    return refOff();
}

/**
 * initial fetch data for first time after login 
 */
export const initialFetchData = async () =>{
    var myId = myFirebase.current.user.id;

    try{
        var [resChat , resMessage] = await myFirebase.initialFetch();
        var parsedChat = [];
        resChat.forEach( chatList=>{
            // convert chat title to user 2 name 
            if( chatList.type == 'private' ) chatList.title = chatList.title[myId];
            if( chatList.recent_message.user != undefined && 
                chatList.recent_message.user._id == myId ) chatList.recent_message.user.name = 'You';
            parsedChat.push( chatList );
        });
        
        var parsedMsg = [];
        //Snapshot
        resMessage.forEach( item =>{
            // message/chatId/msgId/{ msg obj }
            var snapShotValue = item.val();
            var messageArr = Object.values( snapShotValue );

            messageArr.forEach( msg=>{
                var msgArr = Object.values( msg );
          
                msgArr.map( item=>{
                    var buildClientMsg = {
                        pending:false,
                        sent:true,
                        received:true,
                    }
                    Object.assign(item, buildClientMsg)
                })
            })

            parsedMsg.push( snapShotValue );
        })


        return {parsedChat, parsedMsg };
   
    }catch( err ){
        throw err;
    }
   
}

/**
 * Listen user new chat
 */
export const subscribeNewChat = ( callback ) =>{
    //only run once
    myFirebase.listenNewChatList( value =>{

        if( value.type == 'private' ) value.title = value.title[ getMyUid() ];
        if( value.recent_message.user != undefined &&
            value.recent_message.user._id == getMyUid())value.recent_message.user.name = 'You';
    
        callback(value);
        
    });
}

/**
 * 
 * @param {Array} id 
 * @param {Function} callback 
 */
export const subscribeChatUpdate = ( id, callback ) =>{
    //run again when got new id 
    myFirebase.listenChatListUpdate( id, value=>{
        if( value.type == 'private' ) value.title = value.title[ getMyUid() ];
        if( value.recent_message.user != undefined &&
            value.recent_message.user._id == getMyUid() ) value.recent_message.user.name = 'You';

            callback(value);
    })

}

/**
 * listen new chat message
 */
export const subscribeMessageUpdate =( chatId, callback ) =>{
    myFirebase.listenNewMessage( chatId,  newMsg =>{
     
        newMsg.pending = false;
        newMsg.sent=true;
        newMsg.received=true;

        callback( newMsg );
    })

}

/**
 * send message to server
 */
export const sendMessage = ( id,data,callback ) =>{
    return myFirebase.sendMessage( id, data,callback );
}   

/**
 * create Group chat 
 */
export const createGroupChat = () =>{

}

/**
 * Create new private chat
 */
export const createPrivateChat = ( user2Data, callback ) =>{
    return myFirebase.createPrivateChat( user2Data, callback );
}

export const getPrivateChatId = async ( uid ) =>{
    try {
        const id = await myFirebase.getPrivateChatId( uid );
        return id.val();

    } catch (error) {
        throw error
    }
}

/**
 * mark messages as readed 
 */
export const markReadMessage = () =>{
    myFirebase.markReadMessage(  chatId , data );    

    function onSuccess( res ){

    
    }

    function onFailed( err ){
        console.log( 'Error subscribeChat : ' + err );
    }
}


export { 
    subscribeChatList,
    subscribeChat,
    markReadMsg,
    unSubscribe,
};