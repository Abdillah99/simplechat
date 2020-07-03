import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const rootRef = database().ref();

function initializeChatData(onSuccessChat, onSuccessMsg, onFailed) {

    rootRef.child('users/' + getMyUid() + '/chat_list')
        .once('value')
        .then(snap => {

            var idList = [];

            snap.forEach(item => {
                var chatId = item.val();

                idList.push(chatId);

            });

            return idList;
        })
        .then(idArr => {
            const ew = idArr.map(item => {
                return rootRef.child('chat_list/' + item).once('value');
            });

            Promise.all(ew)
                .then(res => {
                    onSuccessChat(res);
                })
            return idArr;

        })
        .then(id => {
            const lel = id.map(item => {
                return rootRef.child('messages').orderByKey().equalTo(item).once('value');
            });

            Promise.all(lel)
                .then(res => {
                    onSuccessMsg(res);
                })
        })
        .catch(err => {
            onFailed(err);
        });


}


function initializeChatList(onSuccess, onFailed) {

}
function getAllChat(onSucces, onFailed) {

    rootRef.child('users/' + getMyUid() + '/chat_list')
        .on('value', snap => {
            onSucces(snap);
        }, error => {
            onFailed(error);
        });

}

function chatListListener(chatId, onSucces, onFailed) {
    rootRef.child('chat_list/' + chatId)
        .on('child_added', snap => {
            onSucces(snap);
        }, err => {
            onFailed(err);
        })

}


function refOff() {
    rootRef.child('chat_list/').off();
}

function messageListener(chatId, onSuccess, onFailed ) {
    
    rootRef.child('messages/' + chatId)
            .orderByKey()
            .limitToLast(1)
            .on('child_added', snap => {
                
                if (snap.val() != null) {

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

function sendMessage(chatId, msg) {
    var storeRef = rootRef.child('messages/' + chatId);
    storeRef.once('value', snap => {

        if (snap.exists()) {

            var newMessage = storeRef.push();

            var message = {
                _id: newMessage.key,
                text: msg.text,
                createdAt: getTimeStamp(),
                user: msg.user,
            }

            newMessage.set(message);


        } else {
            var newChatId = createChat('Mikel', chatId, msg);
        }
    })

}

function getPrivateChatId(uid, callback) {

    rootRef.child('users/' + getMyUid() + '/chat_list/' + uid)
        .on('value', snap => {
            callback(snap.val());
        });

}


function getTimeStamp() {
    return database.ServerValue.TIMESTAMP;
}

function getMyUid() {
    return auth().currentUser.uid;
}

function getMyName() {
    return auth().currentUser.displayName;
}

function getUserNameById(uid) {
    rootRef.child('users/' + uid + '/username')
        .once('value')
        .then(snap => {
            return snap.val();
        })

}

function createGroupChat(title, memberList, callback) {
    var storeRef = rootRef.child('chat_list/'),
        creatorId = getMyUid(),
        creatorName = getMyName();

    //add creator ID to memberlist
    memberList.unshift(creatorId);

    //create new chat_list child
    var newGroup = storeRef.push();
    //get chatlist Id 
    var groupId = newGroup.key;
    //construct chat_list object
    var chatData = {
        _id: newGroup.key,
        title: title,
        members: memberList,
        type: 'group',
    }
    //insert chat_list child object
    newGroup.set(chatData);

    //update all member chat_list 
    var updates = {};

    memberList.forEach((userId, index) => {
        //create new key for storing chat_list id 
        var chatId = rootRef.child('users/' + userId + '/chat_list').push().key;

        updates['users/' + userId + '/chat_list/' + chatId] = groupId;
    });

    // update user chat_list simultaneously
    rootRef.update(updates);

    let msg = {
        text: creatorName + ' created group ' + title,
        createdAt: getTimeStamp(),
        system: true,
    }

    sendGroupMessage(groupId, msg, x =>x );

    callback(groupId);

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


function createPrivateChat(user2data, callback) {
    const { id: user2Id, username: user2name } = user2data;

    var storeRef = rootRef.child('chat_list/');
    var myId = getMyUid();

    var newChat = storeRef.push();

    var title = {};

    title[myId] = user2name;
    title[user2Id] = getMyName();

    var chatData = {
        _id: newChat.key,
        type: 'private',
        title,
        recent_message: {},
    }

    newChat.set(chatData);

    //multiple update user 1 & 2 chat list data 
    var updates = {};

    //update user 1 & 2 chat_list by inserting id of chat_list
    updates['users/' + myId + '/chat_list/' + user2Id] = newChat.key;
    updates['users/' + user2Id + '/chat_list/' + myId] = newChat.key;

    rootRef.update(updates);

    callback(newChat.key);

}


function createUser(userId, email, name, profile_image) {

    var storeRef = rootRef.child('users/' + userId);

    storeRef.set({
        _id: userId,
        username: name,
        email: email,
        profile_image: profile_image,
    });

}

function getAllUser(callback) {
    rootRef.child('users')
        .once('value', snapshot => {

            var users = [];

            snapshot.forEach(childSnap => {

                const { username, email, _id: id } = childSnap.val();

                const userdat = { id, username, email };

                if (id != getMyUid()) users.push(userdat);

            });


            callback(users);

        });
}

export {
    createUser,
    createChat,
    getAllUser,
    getAllChat,
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    sendPrivateMessage,
    chatListListener,
    initializeChatData,
    refOff
}