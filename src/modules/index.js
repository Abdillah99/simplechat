import { AuthProvider, useAuthContext, useAuthState } from './context/AuthContext';
import { SettingsProvider, useSettingsAction, useSettingsState } from './context/SettingsContext';
import { ChatProvider, useChatAction, useChatState } from './context/ChatContext';

import {readData, storeData,mergeData, clearAllData,multiStore,updateData} from './asyncstorage';
import { 
    firebaseSignInEmailPass, 
    firebaseSignOut, 
    firebaseRegisterUser, 
    firebaseGetCurrentUser, 
    fireUpdateUserProfile,
    createChat, 
    createUser, 
    getAllUser, 
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    chatListListener,
    sendPrivateMessage,
    myChatListListener,
    markReadMessage,
    refOff,
    updateUser,
    uploadImage,
    myFirebase,
    
} from './firebase';

export {
    AuthProvider,
    useAuthContext,
    useAuthState,
    SettingsProvider, useSettingsAction, useSettingsState,
    firebaseSignInEmailPass,
    firebaseSignOut,
    firebaseRegisterUser,
    firebaseGetCurrentUser,
    fireUpdateUserProfile,
    createUser,
    getAllUser,
    createChat,
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    chatListListener,
    sendPrivateMessage,
    myChatListListener,
    refOff,
    updateUser,
    markReadMessage,
    ChatProvider, useChatAction, useChatState,
    uploadImage,
    myFirebase,
    readData, storeData, clearAllData,multiStore,updateData,mergeData
};