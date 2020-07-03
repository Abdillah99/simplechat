import React from 'react'
import { View, Text, ActivityIndicator, Button } from 'react-native'
import { useSettingsState , useSettingsAction, initializeChatData,  } from 'modules';
import { initChatList,initializingFirst } from 'services';
import { StackActions } from '@react-navigation/native';

export default function Loading( props ) {

    const { isLoading, firstTime, chatData } = useSettingsState();
    const { initFetch, restoreData } = useSettingsAction();
    const [ initChat , setChatData ] = React.useState([]);
    
    React.useEffect(()=>{

        initializingFirst( data =>{
            initFetch( data );
            
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


