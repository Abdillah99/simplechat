import React, { useCallback,useEffect,useRef } from 'react';
import {
    View,
    AppState,
} from 'react-native';

import styles from './Style';

import { MainHeader,Conversation } from 'components'
import { setOnline } from 'services';

export default Home = (props) => {
    const appState = useRef(AppState.currentState);

    useEffect(()=>{
        setOnline(true);
        AppState.addEventListener("change", _handleAppStateChange);
        console.log('chat useEffect run');
        return () => {
          AppState.removeEventListener("change", _handleAppStateChange);
        };
   
    },[])

    const _handleAppStateChange = (nextAppState) => {
        if ( appState.current.match(/inactive|background/) &&nextAppState === "active") {
            setOnline(true);
        }else{
            setOnline(false);
        }
        appState.current = nextAppState;
      };

    const navigateCreateChat = useCallback(() =>{
        props.navigation.navigate('CreateChat');
    },[])
    
    const navigateProfile = useCallback(() =>{
        props.navigation.navigate('Profile');
    },[])

    return (

        <View style={styles.container}>
            <MainHeader 
                onRightButtonPress={navigateCreateChat} 
                onLeftButtonPress={navigateProfile}/>
            <Conversation />
        </View>

    )

}