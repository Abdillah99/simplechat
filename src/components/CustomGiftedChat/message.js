import React from 'react';
import {Text,View} from 'react-native'
import {
	Bubble,
	SystemMessage,
    Day,
    Message
} from 'react-native-gifted-chat';

export const renderSystemMessage = (props) => {
    return (
        <SystemMessage
            {...props}

            textStyle={{
                fontFamily: 'SFProText-Regular',
            }}
        />
    )
}

export const renderDay = (props) => {
    return (
        <Day
            {...props}
            textStyle={{
                fontFamily: 'SFProText-Regular',
            }}
        />
    )
}

const renderTick = (msg) =>{
    return(
        <Text>Delivered</Text>
    )
    
}
  

export const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: '#F1F0F0'
                },
                right: {
                    backgroundColor: '#0584FE'
                },
            }}
            textStyle={{
                right: {
                    fontFamily: 'SFProText-Regular',
                    fontSize: 14
                },
                left: {
                    fontFamily: 'SFProText-Regular',
                    fontSize: 14
                }
            }}
            />
    )
}


export const renderMessage = ( props ) =>{
    return(
            <Message {...props}
            />
    )
}