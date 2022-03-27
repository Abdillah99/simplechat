import {readData, storeData, clearAllData } from 'modules';

const KEYS ={
    CHATS : 'chats',
    MESSAGES: 2,
    AUTH_DATA:0,
}

const storeChats = async ( data ) =>{
    try {
        await storeData(KEYS.CHATS, data);
        return true;
    } catch (err) {
        return false
    }
}

export { storeChats }