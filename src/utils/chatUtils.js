const appendChats = ( dataChats = [], nextChat ) =>{
    var prevChats = dataChats;
    
    if(!prevChats.length){
        return [nextChat]
    }

    if( prevChats.length >= 1 ){
        //check if chats already exist
        var sameChatIndex = prevChats.findIndex(obj => obj._id == nextChat._id );
       //chat exist updating the value  
        if( sameChatIndex != -1 ){
            prevChats[sameChatIndex] = nextChat;
            return prevChats;
        //the chat is new, appending to prevstate
        }else if( sameChatIndex == -1 ){
            prevChats.unshift(nextChat);
            return prevChats;
        }
    }
}

export { appendChats }