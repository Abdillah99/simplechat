import {readData, storeData,  multiUpdate, multiStore } from 'modules';

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

const storeMessages = async (data = []) =>{
    try{
        var appendData = data.map( item =>{
            const key      = item[0];
            const data     = item[1];
            var stringData = [JSON.stringify(key),JSON.stringify(localData)]; 
            return stringData;
        });
        await multiStore(appendData);
        return true;
    }catch(err){
        return false;
    }
}

const multiUpdateMessages = async (data=[])=>{
    try {
        await multiUpdate(data);
        return true
    } catch (error) {
        return false;
    }
}

export { storeChats, storeMessages, multiUpdateMessages }