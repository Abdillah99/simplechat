import { myFirebase } from 'modules';

var currentUser = myFirebase.getCurrentUser();

/**
 * initial fetch data for the first time after login 
 * caching to local storage
 */
export const initialFetchData = async () =>{
    var myId = myFirebase.getMyUid();
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
 * Listening chat list update ( created, updated, deleted )
 * @param {Function} callback || real time data update
 */
export const subscribeChat = ( callback ) =>{
    //only run once
    myFirebase.listenChatList( value =>{

        if( value.type == 'private' ) value.title = value.title[currentUser.uid];
        if( value.recent_message != undefined &&
            value.recent_message.user != undefined &&
            value.recent_message.user._id == currentUser.uid )value.recent_message.user.name = 'You';
            
            callback(value);
        
    });
}

/**
 * Listening new created message from same channel / group / chat
 * @param {String} chatId || chat id / group id 
 * @param {Function} callback 
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
 * Send message to server 
 * @param {String} id  
 * @param {Object} data 
 * @param {Function} callback 
 */
export const sendMessage = ( id,data,callback ) =>{
    return myFirebase.sendMessage( id, data,callback );
}   

/**
 * Create new group chat 
 * @param {String} title 
 * @param {Array} memberList  
 * @param {Function} callback | callback new groupId  
 */
export const createGroupChat = ( title, memberList, callback ) =>{
    return myFirebase.createGroupChat( title, memberList, callback )
}

/**
 * creating new private chat
 * @param {Object} user2Data 
 * @param {Function} callback | callback new chat Id 
 */
export const createPrivateChat = ( user2Data, callback ) =>{
    return myFirebase.createPrivateChat( user2Data, callback );
}

/**
 * Get ChatId from the user 
 * @param {String} uid 
 * @returns {String} returning Id or null
 */
export const getPrivateChatId = async ( uid ) =>{
    try {
        const id = await myFirebase.getPrivateChatId( uid );
        return id.val();

    } catch (error) {
        throw error
    }
}

/**
 * Get all contact / user 
 * @param {Function} callback 
 */
export const getContact = ( callback ) =>{
    myFirebase.getContact()
    .then( res=>{
        
        var users = [];
        res.forEach(childSnap => {
        
            const { 
                name, 
                email, 
                _id:id, 
                avatar 
            } = childSnap.val();

            const userdat = { id, name, email, avatar };

            if( id != currentUser.uid )users.push(userdat)
            // if ( id != currentUser.id ) users.push(userdat);
        })

        callback( users);
    }).catch(err=>{
        alert(err);
    })
    
}
/**
 * Mark message readed by current user
 * @param {String} chatId 
 * @param {*} data 
 */
export const markReadMessage = ( msgId, data ) =>{
   return myFirebase.markReadMessage( msgId, data );    
}

export const unSubscribe = () =>{
    return myFirebase.refOff
}