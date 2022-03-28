import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const getCurrentUser = () =>{
    return auth().currentUser;
}

const getMyUid =() =>{
    if( auth().currentUser != null ) return auth().currentUser.uid; 
    else null
}
var serverTime = database.ServerValue.TIMESTAMP;

const rootRef = database().ref();

/**
 * 
 * @param {Boolean} status 
 */
const setOnline = ( status ) =>{
    var updates ={}
    if( getMyUid() != null ){
        updates['users/'+getMyUid()+'/online/'] = status; 
        rootRef.update(updates);
    }
}
/**
 * 
 * @param {*} uid 
 * @param {*} callback 
 */
const listenUserProfile = (uid,callback) =>{
    return rootRef.child('users/'+uid)
                  .on('value', snap =>{
                    callback(snap.val());
                  })
}
/**
 * get all user data
 */
const getContact = () => {
    return rootRef.child('users')
        .once('value')
}

const getUserProfileImage = ( uid )=>{
    return rootRef.child('users/'+uid+'/avatar')
                  .once('value')
}
/**
 * Firebase auth function begin
 */

/**
* create new user to firebase auth 
* @param {Object} data - email, password and name
*/
const registerUser = (data) => {
    return auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then( res =>{
                res.user.updateProfile({displayName: data.name})
                var bio = {
                    _id: res.user.uid,
                    name: data.name,
                    email: data.email,
                }
                createUserBio(res.user.uid, bio);
                var retr ={
                    id:res.user.uid,
                    name: data.name,
                    email:data.email,
                }
                return retr;
            })
}

/**
 * insert users data in firebase realtime db
 * @param {String} uid 
 * @param {*} data 
 */
const createUserBio = (uid, data) => {
    return database().ref('users/' + uid)
                  .set(data);
}

/**
 * Sign in to firebase authentication using 
 * email and password
 * @param {Object} user - email and password
 * @returns {Promise} promise
 */
const signIn = (user) => {
    return auth().signInWithEmailAndPassword(user.email, user.password);
}
/**
 * signOut from firebase authentication
 * @returns {Promise} promise
 */
const signOut = () => {
    return auth().signOut();
}
/**
 * 
 * @param {Object} data - object  
 * @returns {Promise} 
 */
const updateProfile = (data) => {
    return getCurrentUser().updateProfile({
        ...data
    });

}

const updateBio = (data) => {
    return rootRef.child('users/' + getMyUid())
        .update(data);
}


/**
 *  Fetch all chat list and message return array of chat list and message
 *  
 * @returns {Array} [ChatList, MessageList]
 */
const initialFetch = async () => {
    const chatRef = await getAllChat();

    const chatValue  = chatRef ? Object.values(chatRef) : [];
    const chatKey    = chatRef ? Object.keys(chatRef) : [];
    
    const messageValue = await getMultiMessages(chatKey);

    return [chatValue, messageValue];
}
/**
 * get all my chat list
 * @returns {Object} chat_list
 */
const getAllChat = () =>{
    return rootRef.child('chat_list')
                  .orderByChild('members/'+getMyUid())
                  .equalTo(true)
                  .once('value')
                  .then(snap=>{
                      if( snap.val() != null ){
                          return Object.values(snap.val());
                      }
                      return []
                  })
} 

const getAllChatId = () =>{
    return rootRef.child('users/' + getMyUid() + '/chat_list')
                  .once('value')
                  .then(snap =>{
                      if(snap.val() != null ){
                        return Object.keys(snap.val())
                      }
                      return [];
                  })
}
/**
 *  get all unreceived message by checking every chat 
 *  call this function inside loading component if user already logged in
 * @param {Array} chatId  
 */
const getUnreceivedMessage = async ( chatId = [] ) =>{
    const msgRef = async (id) =>{
        return rootRef.child('messages/'+id)
                          .orderByChild('receivedBy/'+getMyUid())
                          .equalTo(null)
                          .once('value')
                          .then(res=>{
                              if(res.val() != null ){
                                  var tmp = {}
                                  tmp[res.key] = res.val();
                                  return tmp;
                              }
                          })   
    }
    var actions     = chatId.map(msgRef);
    var result      = await Promise.all(actions);
    //remove null ref value ( cuz not every chats have new unreceived msg, firebase returnet null every we chechked the ref)
    var notEmptyRes = result.filter( val =>val != null );

    return notEmptyRes;
}

/**
 * Listen new created chat 
 */
const listenChatList = (callback) => {
    return rootRef.child('chat_list')
            .orderByChild('members/'+ getMyUid())
            .equalTo(true)            
            .on('child_changed', snap => {
                if(snap.val() != null ){
                    callback(snap.val());
                }
            })
}
/**
 * 
 * @param {Array} data [['ChatID1', ['MessageID1','MessageID2'] ],[['ChatID2', 'MessageID2']] 
 */
const multiMarkReceivedMessage = ( data = [] ) =>{
    var updates = {};   
    data.forEach( item => {
        const chatId = item[0];
        const messages = item[1];
        messages.forEach( msgId =>{
            updates['messages/'+chatId+'/'+msgId+'/receivedBy/'+getMyUid()] = true; 
        })
    });
    rootRef.update(updates);
}
const markReceiveMessage  = (chatId,msgList=[]) =>{
    var updates = {};
    msgList.forEach(msgId=>{
        updates['messages/'+chatId+'/'+msgId+'/receivedBy/'+getMyUid()] = true; 
    })
    rootRef.update(updates);
}
/*
 * Listen new message
 * @param {String} chatId | chat key /id
 */
const listenNewMessage = (chatId, callback) => {
    rootRef.child('messages/'+chatId)
           .orderByChild('receivedBy/'+getMyUid())
           .equalTo(null)
           .on('value', snap => {
                if( snap !== undefined && snap !== null && snap.val() !== null ) callback(snap.val());
            })
}
/**
 * 
 * @param {String} chatId | chat id
 * @param {Object} msgData | object
 */
const sendMessage = (chatId, msgData, callback) => {
    var msgRef = rootRef.child('messages/' + chatId);
    var newMsg = msgRef.push();

    var readed ={};
    readed[getMyUid()] = true;
    
    const buildMsg = {
        _id: newMsg.key,
        _chatId: chatId,
        ...msgData,
        readedBy:readed,
    }

    newMsg.set(buildMsg);

    rootRef.child('chat_list/' + chatId + '/recent_message/')
           .update(buildMsg);

    callback(newMsg.key);
}
/**
 * 
 * @param {Array} arrId Array of chat ID  
 * @returns {Object} 
 */
const getMultiMessages = async (arrId= []) =>{
    const msgRef = async (id) =>{
        return rootRef.child('messages')
                    .orderByKey()
                    .equalTo(id)
                    .once('value')
                    .then(snap=>{
                        if( snap.val() != null )
                        {
                            return snap.val();
                        }
                        return [];
                    });

    }

    var actions = arrId.map(msgRef);
    var result  = await Promise.all(actions);
    return result;
}
/**
 * Mark readed all not readed user message 
 * @param {String} chatId 
 * @param {Array} data 
 */
const markReadMessage = (id,msg=[]) => {
    var updates = {};

    msg.forEach( item =>{
        updates['chat_list/'+id+'/recent_message/readedBy/'+getMyUid()] = true;  
        updates['messages/'+id+'/'+item+'/readedBy/'+getMyUid()] = true;  
    });

    rootRef.update(updates);
}

/**
 * 
 * @param {String} user2id 
 */
const getPrivateChatId = (user2id) => {
    return rootRef.child('users_private/' + getMyUid()+ '/private_chat/' + user2id)
        .once('value')
}

/**
 * Creating new group chat
 * @param {String} title 
 * @param {Array} memberList 
 */
const createGroupChat = (title, memberList, callback) => {
    var chatListRef = rootRef.child('chat_list/'),
        creatorId = getMyUid(),
        creatorName =getCurrentUser().displayName;

    memberList.unshift(creatorId);
    //convert to set 
    var memberSet = {};
    memberList.forEach(item => memberSet[item] = true);

    var newGroup = chatListRef.push();
    var groupId = newGroup.key;
    var buildChatData = {
        _id: groupId,
        title: title,
        members: memberSet,
        type: 'group',
    }

    let sysMsg = {
        text: creatorName + 'created group ' + title,
        createdAt: serverTime,
        system: true,
    }
    //send msg first prevent trigger undefined recent_msg
    sendMessage(groupId, sysMsg, x => x);

    newGroup.update(buildChatData);

    var updates = {};
    memberList.forEach(id => {
        updates['users/' + id + '/chat_list/' + groupId] = true;
        updates['chat_detail/' + groupId + '/typing/' + id] = false;
    });

    rootRef.update(updates);

    callback(groupId);
}

/**
 * creating new private chat 
 * @param {Object} user2Data | { username , Id }
 * @returns {String} new Chat id 
 */
const createPrivateChat = (user2Data, callback) => {
    const { id: user2Id, name: user2Name } = user2Data;
    var myId =  getMyUid();
    var chatRef = rootRef.child('chat_list');

    var newChat = chatRef.push();
    var chatId = newChat.key;
    var title = {};
    title[myId] = user2Name;
    title[user2Id] = getCurrentUser().displayName;
    var memberSet = {};
    memberSet[myId] = true;
    memberSet[user2Id] = true;

    var buildChatData = {
        _id: chatId,
        type: 'private',
        title,
        members: memberSet,
        recent_message: {},
    }

    newChat.set(buildChatData);

    var updateChat = {};

    updateChat['users/' + myId + '/chat_list/' + chatId] = true;
    updateChat['users/' + user2Id + '/chat_list/' + chatId] = true;

    updateChat['users_private/' + myId + '/private_chat/' + user2Id] = chatId;
    updateChat['users_private/' + user2Id + '/private_chat/' + myId] = chatId;
    updateChat['chat_detail/' + chatId + '/typing/' + myId] = false;
    updateChat['chat_detail/' + chatId + '/typing/' + user2Id] = false;

    rootRef.update(updateChat);

    callback(newChat.key);

}

const refOff =( route )=>{
    return database().ref(route).off();

} 

/**
 * Uploading image on storage bubcket 
 * @param {String} folder 
 * @param {String} filename 
 * @param {String} data 
 */
const uploadImage = async (folder, filename, data) => {

    return new Promise((resolve, reject) => {
        const uploadTask = storage().ref()
            .child(folder)
            .child(filename)
            .putFile(data);

        uploadTask.on('state_changed', (snapshot) => {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log('Upload is ' + progress + '% done');

            switch (snapshot.state) {
                case storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }

        });

        uploadTask.then(() => {

            uploadTask.snapshot
                .ref
                .getDownloadURL()
                .then(downloadURL => {
                    resolve(downloadURL);
                });

        }).catch(err => {

            reject(err);

        })
    })

}

/**
 * Download / view image from storage bucket
 * @param {String} folder 
 * @param {String} filename 
 */
const downloadImge = (folder, filename) => {
    return storage().ref()
        .child(folder)
        .child(filename)
        .getDownloadURL()
}

export const myFirebase = {
    registerUser,
    createUserBio,
    getUserProfileImage,
    updateBio,
    signIn,
    signOut,
    updateProfile,
    listenChatList,
    listenNewMessage,   
    sendMessage,
    markReadMessage,
    getPrivateChatId,
    createGroupChat,
    createPrivateChat,
    initialFetch,
    getContact,
    refOff,
    getCurrentUser,
    getMyUid,
    uploadImage,
    downloadImge,
    setOnline,
    listenUserProfile,
    markReceiveMessage,
    getUnreceivedMessage,
    getAllChatId,
    getAllChat,
    getMultiMessages,
    multiMarkReceivedMessage
}