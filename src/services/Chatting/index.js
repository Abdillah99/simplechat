import { myFirebase,updateData } from 'modules';

const getCurrentUser = () =>( myFirebase.getCurrentUser() );

/**
 * initial fetch data for the first time after login 
 * caching to local storage
 */
export const initialFetchData = async () =>{
    var myId = getCurrentUser().uid;

    try{
        var [resChat , resMessage] = await myFirebase.initialFetch();
        var parsedChat = [];
        resChat.forEach( chatList=>{
            // convert chat tittle to user name 
            //e.g user1 = 'alex' user2 = 'brian'; on user1 chat title will show 'Brian'
            if( chatList.type == 'private' ) chatList.title = chatList.title[myId];
            if( chatList.recent_message.user != undefined && 
                chatList.recent_message.user._id == myId ) chatList.recent_message.user.name = 'You';
                parsedChat.push(chatList)
        });
        
        var parsedMsg =[]; 
        resMessage.forEach( item =>{
            // message/chatId/msgId/{ msg obj }
            var messageArr = Object.values( item );

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

            parsedMsg.push( item );
        })

        return {parsedChat, parsedMsg };
   
    }catch( err ){
        throw err;
    }
   
}

export const getUnreceivedMessage = async() =>{
    var myId = getCurrentUser().uid;

    var chat = await myFirebase.getAllChat();
    var chatKey = Object.keys(chat);
    var chats = Object.values(chat);
    
    var parsedChat = [];
    chats.forEach(chatList=>{
        // convert chat tittle to user name 
        //e.g user1 = 'alex' user2 = 'brian'; on user1 chat title will show 'Brian'
        if( chatList.type == 'private' ) chatList.title = chatList.title[myId];
        if( chatList.recent_message.user != undefined && 
            chatList.recent_message.user._id == myId ) chatList.recent_message.user.name = 'You';
            parsedChat.push(chatList)
    })
    var unreceive = await myFirebase.getUnreceivedMessage(chatKey)
    // group of unreceived message with chat id
    unreceive.forEach( message =>{
        var chatId = Object.keys(message)[0]; //chat id 
        var msgObj = Object.values(message); ///array of message obj with key

        msgObj.forEach(msg=>{
            //message in same chat id
            var msgArr = Object.values( msg );
            var msgKey = Object.keys( msg );
            msgArr.map( async (item)=>{
                item.pending=false;
                item.sent=true;
                item.received=true;
                await updateData(chatId, item)
            })
            myFirebase.markReceiveMessage( chatId, msgKey);
        })
    })

    var final={
        chats:parsedChat,
    }
    return final;

}

export const subsCribeUserStatus = ( uid,callback ) =>{
    myFirebase.listenUserProfile( uid, res=>{
        callback(res);
    })
}
/**
 * Listening chat list update ( created, updated, deleted )
 * @param {Function} callback || real time data update
 */
export const subscribeChat = ( callback ) =>{
    //only run once
    myFirebase.listenChatList( value =>{

        if( value.type == 'private' ) value.title = value.title[getCurrentUser().uid];
        if( value.recent_message != undefined &&
            value.recent_message.user != undefined &&
            value.recent_message.user._id == getCurrentUser().uid )value.recent_message.user.name = 'You';
            
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
        var msgArr = newMsg ? Object.values(newMsg) :[] ;
        var idList = newMsg ? Object.keys(newMsg) :[];

        myFirebase.markReceiveMessage( chatId, idList);
        const delayLoop = (fn, delay) => {
            return (x, i) => {
              setTimeout(() => {
                x.pending = false;
                x.sent = true;
                x.received = true;
                fn(x);
              }, i * delay);
            };
          };

        msgArr.forEach(delayLoop(callback,500));

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

            if( id != getCurrentUser().uid )users.push(userdat)
            // if ( id != currentUser.id ) users.push(userdat);
        })

        callback( users);
    }).catch(err=>{
        alert(err);
    })
    
}

/**
 * 
 * @param {Boolean} status 
 */
export const setOnline = ( status ) =>{
    myFirebase.setOnline(status);
}
/**
 * Mark message readed by current user
 * @param {String} chatId 
 * @param {*} data 
 */
export const markReadMessage = ( msgId, data ) =>{
   return myFirebase.markReadMessage( msgId, data );    
}

export const markReceiveMessage = ( chatId, msgId ) =>{
    return myFirebase.markReceiveMessage(chatId,msgId);
}

export const unSubscribe = ( route ) =>{
    console.log('unsubs run',route);
    return myFirebase.refOff(route)
}