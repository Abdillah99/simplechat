import { getAllChat, chatListListener, messageListener, initializeChatData, myChatListListener } from 'modules';
import auth from '@react-native-firebase/auth';

const getMyUid = ()=> {
    return auth().currentUser.uid;
}
const initializingFirst = ( result ) =>{
    
    var chatList = [];
    var msgList = [];
    initializeChatData( onSuccessChat, onSuccessMsg, onFailed );

    function onSuccessChat ( res ){
      
        res.forEach( item =>{
            var itemVal = item.val();
            //convert chat title 
            if( itemVal.type == 'private') itemVal.title = itemVal.title[ getMyUid() ];
            if( itemVal.recent_message.user != undefined && itemVal.recent_message.user._id == getMyUid()) itemVal.recent_message.user.name = 'You';

            chatList.push( itemVal );
        });

    }

    function onSuccessMsg( res ){
        
        // console.log(Object.keys( res.val() ));

        // groupID/msg

        // res is array of object of our message
        res.forEach( item=>{
            
            //item is groupId/msgId/msgData
            var itemVal = item.val();            
            // itemVal.foreach( r =>{
            //     console.log(r);
            // })
            Object.keys( itemVal ).forEach( key =>{
                var msgObj = itemVal[key];

                Object.keys( msgObj ).forEach( key=>{
                    var eachMsg = msgObj[key];
                    var msgClientInfo = {
                        pending:false,
                        sent:true,
                        received:true,
                    }
                    
                
                    Object.assign( eachMsg , msgClientInfo )
                });
            
            });
            
            msgList.push( itemVal );

        });

        var finalData ={
            chats: chatList,
            messages: msgList,
        }

        result( finalData )
        
    }
    
    function onFailed( err ){
        console.log( 'Error initChatList : ' + err );
    }
    
}
const initChatList = ( callback ) => {
    
    getAllChat( onSuccess, onFailed );

    function onSuccess ( res ){
        
        callback( res );
    
    }

    function onFailed( err ){
        console.log( 'Error initChatList : ' + err );
    }

}

const subscribeChatList = ( id  , callback ) =>{
    
        chatListListener( id, onSuccess, onFailed );

        function onSuccess( res ){
            var value = res.val();
            
            if( value.type == 'private' ) value.title = value.title[ getMyUid() ];
            if( value.recent_message.user._id == getMyUid()) value.recent_message.user.name = 'You';

            callback( value );
        
        }
    
        function onFailed( err ){
            console.log( 'Error subscribeChat : ' + err );
        }
 
}

const subScribeMyChatList = ( callback ) =>{
    
    myChatListListener( onSuccess, onFailed );

    function onSuccess( res ){
        var value = res.val();
        
        if( value.type == 'private' ) value.title = value.title[ getMyUid() ];

        callback( value );
    
    }

    function onFailed( err ){
        console.log( 'Error subscribeChat : ' + err );
    }
}

const subscribeChat =( chatId , callback )=>{
    
    messageListener( chatId, onSuccess, onFailed );

    function onSuccess( res ){

        callback( res );
    
    }

    function onFailed( err ){
        console.log( 'Error subscribeChat : ' + err );
    }
}

const createGroup = ( data , callback ) =>{
    
    function onSuccess( res ) {
        
    }

    function onFailed( err ){
        
    }
}

const sendMessage = ( chatId, msg ) =>{

    function onSuccess( res ) {
        
    }

    function onFailed( err ){

    }

}


export { 
    initChatList, 
    subScribeMyChatList,
    subscribeChatList,
    subscribeChat,
    initializingFirst };