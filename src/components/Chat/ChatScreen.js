import React, { useState, useRef, useEffect, useContext } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default ChatScreen = (props) => {

    const chatBubble = ( props ) =>{
        return(
            <Bubble 
                {...props}
                wrapperStyle={{
                    left:{
                        backgroundColor:'white'
                    },
                    right:{
                        backgroundColor:'red'
                    },
                }} />
        )
    }



    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>

            <GiftedChat
                renderBubble={chatBubble}
            />

        </View>

    )


}