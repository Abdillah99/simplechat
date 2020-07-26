import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const { displayName:currUserName, uid:currUserId } = auth().currentUser;
const currentUser = auth().currentUser;

const serverTime = database.ServerValue.TIMESTAMP;

const rootRef = database().ref();

const current ={
    user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
    },
    serverTime: serverTime,
}

function myChatListListener( onSuccess, onFailed ){

    rootRef.child('users/' + getMyUid() + '/chat_list/')
            .orderByKey()
            .limitToLast(1)
            .on('child_added', newId => {
                rootRef.child('chat_list')
                        .orderByKey()
                        .equalTo(newId.val())
                        .on( 'child_added' , snap =>{
                            onSuccess(snap);
                        });
                
            }, err => {
                onFailed(err);
            })
}

function chatListListener( id, onSucces, onFailed) {
    rootRef.child('chat_list')
            .orderByKey()
            .equalTo( id )
            .on('child_changed', snap =>{
                onSucces( snap );
            }, err =>{
                onFailed( err );
            })

}

function refOff() {
    return rootRef.off();
}

function messageListener(chatId, onSuccess, onFailed ) {
    
    rootRef.child('messages/' + chatId)
            .orderByKey()
            .limitToLast(1)
            .on('child_added', snap => {
                
                if (snap.val() != null  ) {

                    var formatMsg = {
                        ...snap.val(),
                        pending: false,
                        sent: true,
                        received: true,
                    }

                    onSuccess(formatMsg);

                }

            }, error => {
                onFailed(error);
            });


}

function getTimeStamp() {
    return database.ServerValue.TIMESTAMP;
}

function getMyUid() {
    return auth().currentUser.uid != null ?auth().currentUser.uid :'' ;
}

function getMyName() {
    return auth().currentUser.displayName;
}

function sendGroupMessage(groupId, msg, callback) {
    var storeRef = rootRef.child('messages/' + groupId);
    //create new message child
    var newMessage = storeRef.push();
    //construct msg object

    const message = {
        _id: newMessage.key,
        ...msg,
        readedBy: [getMyUid()],
    }

    newMessage.set(message);

    //update chat_list recent_message
    rootRef.child('chat_list/' + groupId + '/recent_message/')
           .update(message);

    callback(newMessage.key);
}

function sendPrivateMessage(chatId, msg) {

    var msgRef = rootRef.child('messages/' + chatId);
    var newMessage = msgRef.push();
    //construct msg object
    var message = {
        _id: newMessage.key,
        ...msg,
        readedBy: [getMyUid()],
    }

    newMessage.set(message);

    //update chat_list recent_message
    rootRef.child('chat_list/' + chatId + '/recent_message/')
        .set(message);

}

function createChat(title, user2Id, msg) {
    var storeRef = rootRef.child('chat_list/');
    var myId = getMyUid();

    var newChat = storeRef.push();

    var chatData = {
        _id: newChat.key,
        title: title,
        members: [
            myId,
            user2Id,
        ],
        recent_message: {
            message: ' Say hi',
            timestamp: getTimeStamp(),
            sender: {
                system: true,
            }
        }
    }

    newChat.set(chatData);

    //update user 1 & 2 chat_list on users ref
    var updates = {};
    var user1Key = rootRef.child('users/' + myId + '/chat_list').push().key;
    var user2Key = rootRef.child('users/' + user2Id + '/chat_list').push().key;

    updates['users/' + myId + '/chat_list/' + user1Key] = newChat.key;
    updates['users/' + user2Id + '/chat_list/' + user2Key] = newChat.key;

    rootRef.update(updates);

    return newChat.key;

}

function updateUser( userId , data ){
    var userRef = rootRef.child( 'users/'+userId );
    
    userRef.update( data );
}

function getAllUser(callback) {
    rootRef.child('users')
        .once('value', snapshot => {

            var users = [];

            snapshot.forEach(childSnap => {

                const { username, email, _id: id, avatar } = childSnap.val();

                const userdat = { id, username, email, avatar };

                if (id != getMyUid()) users.push(userdat);

            });


            callback(users);

        });
}


/**
 * Firebase auth function begin
 */

 /**
 * create new user to firebase auth 
 * @param {Object} data - email, password and name
 */
const createUser = ( data ) =>{
    return auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .catch(err =>{
                throw err;
            })
 }

/**
 * Sign in to firebase authentication using 
 * email and password
 * @param {Object} user - email and password
 * @returns {Promise} promise
 */
const signIn = ( user )=>{
     return auth().signInWithEmailAndPassword( user.email, user.password );
}
/**
 * signOut from firebase authentication
 * @returns {Promise} promise
 */
const signOut= () =>{
     return auth().signOut(); 
 }
/**
 * 
 * @param {Object} data - object  
 * @returns {Promise} 
 */
const updateProfile = ( data )=>{

     return currentUser.updateProfile({
         ...data
     });
 
}

/**
 * Firebase database function
 * @returns {Promise}
 */
 const initialFetch = async () =>{
    const chatIdArr = await rootRef.child('users/'+currUserId+'/chat_list')
                                    .once('value');

    
    const listChat = chatIdArr.val() != null ? Object.keys(chatIdArr.val()) : [];


    const chatRes = await rootRef.child('chat_list')
                                 .orderByChild('members/'+currUserId)
                                 .once('value')

    const resultChat = chatRes.val() ? Object.values(chatRes.val()) : [];

    const promisedMessage = listChat.map( item => {
        return rootRef.child('messages')
                      .orderByKey()
                      .equalTo(item)
                      .once('value');
    });

    // var resultChat    = await Promise.all( promisedChat );
    var resultMessage = await Promise.all( promisedMessage );
    
    return [resultChat, resultMessage];

}

/**
 * Listen new created chat 
 */
 const listenNewChatList = (callback) =>{
    rootRef.child('chat_list')
            .orderByChild('members/'+currUserId)
            .equalTo(true)
            .limitToLast(1)
            .on( 'value', value =>{
                var res = value.val() ? Object.values(value.val())[0]  : null;
                if( res ) callback(res);
            })
}
 
/** 
 * Listen to chat list update e.g recent message
 * @param {String} id - chat id  
 * @returns {Function} 
 */
const listenChatListUpdate = ( id, callback ) =>{
    return rootRef.child('chat_list')
            .orderByKey()
            .equalTo(id)
            .on('child_changed', snapshot=>{
                var res = snapshot.val()
                callback( res );
            });
}
/**
 * Listen new message
 * @param {String} chatId | chat key /id
 */
const listenNewMessage = ( chatId, callback )=>{
    return rootRef.child('messages/'+chatId)
                    .orderByKey()
                    .limitToLast(1)
                    .on('child_added', snap=>{
                        callback( snap.val() );
                    })
}
/**
 * 
 * @param {String} chatId | chat id
 * @param {Object} msgData | object
 */
const sendMessage = ( chatId, msgData, callback ) =>{
    var msgRef = rootRef.child('messages/'+chatId);
    var newMsg = msgRef.push();

    const buildMsg ={
        _id: newMsg.key,
        ...msgData,
        readedBy:[ currUserId ],
    }

    newMsg.set(buildMsg);

    rootRef.child('chat_list/'+chatId+'/recent_message/')
            .update(buildMsg);

    callback( newMsg.key );
}
/**
 * Mark readed all not readed user message 
 * @param {String} chatId 
 * @param {Array} data 
 */
const markReadMessage = ( chatId , data ) =>{
    var updates = {};
    data.forEach( element=>{
        element.readedBy.push( currUserId );
        updates['messages/'+chatId+'/'+element._id+'/readedBy']=element.readedBy;
        updates['chat_list/'+chatId+'/recent_message/readedBy']=element.readedBy;
    })
    rootRef.update(updates);
}

/**
 * 
 * @param {String} user2id 
 */
const getPrivateChatId = ( user2id ) =>{
    return rootRef.child('users/'+currUserId+'/private_chat/'+user2id)
                  .once('value')
}

/**
 * Creating new group chat
 * @param {String} title 
 * @param {Array} memberList 
 */
const createGroupChat=( title, memberList, callback )=>{
    var chatListRef = rootRef.child('chat_list/'),
        creatorId   = currentUser.uid,
        creatorName = currentUser.displayName;

    memberList.unshift(creatorId);
    //convert to set 
    var memberSet ={};
    memberList.forEach(item=>memberSet[item] = true);

    var newGroup = chatListRef.push();  
    var groupId = newGroup.key;
    var buildChatData = {
        _id:groupId,
        title:title,
        members:memberSet,
        type:'group',
    }
    
    let sysMsg = {
        text: creatorName+'created group '+title,
        createdAt: serverTime,
        system:true,
    }
    //send msg first prevent trigger undefined recent_msg
    sendMessage(groupId,sysMsg, x=>x);

    newGroup.update(buildChatData);

    var updates = {};
    memberList.forEach( id =>{
        updates['users/'+id+'/chat_list/'+groupId] = true;
    });

    rootRef.update(updates);


    
    callback(groupId);
}

/**
 * creating new private chat 
 * @param {Object} user2Data | { username , Id }
 * @returns {String} new Chat id 
 */
const createPrivateChat = ( user2Data, callback )=>{
    const {id:user2Id, username: user2Name } = user2Data;
    var myId = currUserId;
    var chatRef = rootRef.child('chat_list');

    var newChat = chatRef.push();
    var chatId = newChat.key;
    var title = {};
    title[myId] = user2Name;
    title[user2Id] = currUserName;

    var memberSet ={};
    memberSet[myId]=true;
    memberSet[user2Id]=true;

    var buildChatData ={
        _id:chatId,
        type:'private',
        title,
        members:memberSet,
        recent_message:{},
    }

    newChat.set(buildChatData);

    var updateChat = {};

    updateChat['users/'+myId+'/chat_list/'+chatId] = true;
    updateChat['users/'+user2Id+'/chat_list/'+chatId] = true;
   
    updateChat['users/'+myId+'/private_chat/'+user2Id] = newChat.key;
    updateChat['users/'+user2Id+'/private_chat/'+myId] = newChat.key;

    rootRef.update(updateChat);

    callback( newChat.key);

}
export const myFirebase = {
    createUser,
    signIn,
    signOut,
    updateProfile,
    listenNewChatList,
    listenChatListUpdate,
    listenNewMessage,
    sendMessage,
    markReadMessage,
    getPrivateChatId,
    createGroupChat,
    createPrivateChat,
    initialFetch,
    current,
}

export {
    createUser,
    createChat,
    getAllUser,
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    sendPrivateMessage,
    chatListListener,
    myChatListListener,
    markReadMessage,
    updateUser,
    refOff
}