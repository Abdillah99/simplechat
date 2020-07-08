import React from 'react'
import { View, Text, ActivityIndicator, Button } from 'react-native'
import { useChatState , useChatAction, initializeChatData,  } from 'modules';
import { initChatList,initializingFirst } from 'services';
import { StackActions } from '@react-navigation/native';

export default function Loading( props ) {

    const { messages, chats } = useChatState();
    const { initChatContext } = useChatAction();
    const [ initChat , setChatData ] = React.useState([]);
    
    React.useEffect(()=>{

        initializingFirst( data =>{
    
            initChatContext( data );
            
            props.navigation.dispatch(
                StackActions.replace('HomeTab')
              );
        });
        
    }, [])
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            
            <ActivityIndicator/>
            <Text> Initializing ur data... </Text>
        
        </View>
    )
}


