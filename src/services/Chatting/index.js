import { myFirebase  } from 'modules';

const getCurrentUser = () =>( myFirebase.getCurrentUser() );

const getAllMessages = async () =>{
    const chatId = await myFirebase.getAllChatId();
    var result = [];
    if(chatId.length){
        const msgData = await myFirebase.getMultiMessages(chatId);
        if(msgData.length){
            var parsedMsg = builtMsgClient(msgData);
            var sortMsg = parsedMsg.sort((a, b) => b.createdAt - a.createdAt);
            result = sortMsg;
        }
    }
    return result;
}
/**
 * initial fetch data for the first time after login 
 * caching to local storage
 */
export const initialFetchData = async () =>{
    const chats     = await getChatList();
    const messages  = await getAllMessages();
    return {chats, messages}
}

//converting chat list raw data to client spec
// convert private chat tittle to name and chat sender to you if you the sender
//e.g user1 = 'alex' user2 = 'brian'; on user1 chat title will show 'Brian'
const builtMsgClient = (messages = []) =>{
    var tmpFinal = [];
    if(messages.length){
        messages.forEach( msgwithId =>{
            const messages  = Object.values(msgwithId);
            const chatId    = Object.keys(msgwithId)[0];

            var arrMessages = [];
            messages.forEach( msgData =>{
                let msgDataVal  = Object.values(msgData);

                msgDataVal.forEach( msgVal =>{
                    msgVal.pending=false;
                    msgVal.sent=true;
                    msgVal.received=true;
                    arrMessages.push(msgVal);
                })
            })
            var built = [chatId,arrMessages];
            tmpFinal.push(built);
        })
    }
    return tmpFinal;
}
const builtChatListClient = ( msgData ) =>{
    var myId = getCurrentUser().uid;
    var parsedChatList = [];
    msgData.forEach(item=>{
        if( item.type == 'private' ) item.title = item.title[myId];
        if( item.recent_message.user != undefined && item.recent_message.user._id == myId ) item.recent_message.user.name = 'You';
        
        parsedChatList.push(item)
    })
    return parsedChatList;
}

export const getUnreceivedMessage = async() =>{
    //get all my chatid
    var chatKey             = await myFirebase.getAllChatId();
    //get unreceived msg by checkiing each chat use chatid  
    var resUnreceivedMsg    = await myFirebase.getUnreceivedMessage(chatKey)
    // group of unreceived message with chat id
    // the result is returned messages with chat id
    var localDataUpdate = [];
    if(resUnreceivedMsg.length){
        var arrServerUpdate = [];
        resUnreceivedMsg.forEach( msgwithId =>{
            const messages  = Object.values(msgwithId);
            const chatMsgId = Object.keys(msgwithId)[0];

            var listMsgId   = [];
            var arrMessages = [];
            messages.forEach( msgData =>{
                let msgDataVal  = Object.values(msgData);
                let msgId       = Object.keys(msgData);
                //msg id is array stupid
                listMsgId = msgId;

                msgDataVal.forEach( msgVal =>{
                    msgVal.pending=false;
                    msgVal.sent=true;
                    msgVal.received=true;
                    arrMessages.push(msgVal);
                })
            })
            //mark server data is only use chat id and list of msg id
            var serverData = [chatMsgId, listMsgId];
            arrServerUpdate.push(serverData);
            //local data update is chatid with messages data
            var built = [chatMsgId, arrMessages];
            localDataUpdate.push(built);
        })
        //update server data
        myFirebase.multiMarkReceivedMessage(arrServerUpdate);
    }
    return localDataUpdate;
}

export const getChatList = async() =>{
    var chatList            = await myFirebase.getAllChat();
    var convertedChatList   = builtChatListClient(chatList);
    var convertedSorted     = convertedChatList.sort((a, b) => b.recent_message.createdAt - a.recent_message.createdAt)

    return convertedSorted;
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

        msgArr.sort((a, b) => a.createdAt - b.createdAt);

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
        myFirebase.markReceiveMessage( chatId, idList);
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
    return myFirebase.refOff(route)
}