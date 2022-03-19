/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Image } from 'react-native';
import { InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
        borderWidth:0,
        elevation:0,    
        paddingVertical:8    
    }}    
    primaryStyle={{ alignItems: 'center', elevation:0 }}
  />
);

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32 }}
        source={{
          uri: 'https://placeimg.com/32/32/any',
        }}
      />
    )}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    placeholder='Type message'
    textInputStyle={{ 
        backgroundColor:'rgba(0,0,0,0.05)', 
        borderRadius:18,
        paddingHorizontal:8 , 
        fontFamily:'SFProText-Reguler',
        fontSize:14,
        paddingVertical:0,
        margin:0
    }}
  />
);

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
      <Image style={{width:30, height:30, tintColor:!props.text? 'gray' :'#0584FE' }}  source={require('../../assets/icon/send.png')} />
  </Send>
);

