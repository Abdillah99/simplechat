import { get, keys, clear, set } from './asyncstorage/';
import { AuthProvider, useAuthContext, useAuthState } from './context/AuthContext';
import { SettingsProvider, useSettingsAction, useSettingsState } from './context/SettingsContext';
import { ChatProvider, useChatAction, useChatState } from './context/ChatContext';

import { 
    firebaseSignInEmailPass, 
    firebaseSignOut, 
    firebaseRegisterUser, 
    firebaseGetCurrentUser, 
    createChat, 
    createUser, 
    getAllUser, 
    getAllChat,
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    chatListListener,
    sendPrivateMessage,
    initializeChatData,
    myChatListListener,
    refOff
} from './firebase';

export {
    AuthProvider,
    useAuthContext,
    useAuthState,

    SettingsProvider, useSettingsAction, useSettingsState,

    get,
    set,
    keys,
    clear,
    firebaseSignInEmailPass,
    firebaseSignOut,
    firebaseRegisterUser,
    firebaseGetCurrentUser,
    createUser,
    getAllUser,
    createChat,
    getAllChat,
    messageListener,
    sendMessage,
    createGroupChat,
    sendGroupMessage,
    getPrivateChatId,
    createPrivateChat,
    chatListListener,
    sendPrivateMessage,
    initializeChatData,
    myChatListListener,
    refOff,
    
    ChatProvider, useChatAction, useChatState
};