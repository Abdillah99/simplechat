import React from 'react'
import { View, Text, Modal, ActivityIndicator,StyleSheet } from 'react-native'

const Loading = (props) => {
    
    const { isVisible , text } = props;

    return (
        <Modal animationType='fade' visible={isVisible} transparent={true}>   
            <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(1,1,1,0.5)'}}>
                <View style={{backgroundColor:'white', flexDirection:'row', padding:12, elevation:10}}>
                    <ActivityIndicator color="#111" size="small" />
                    <Text>{text}</Text>
                </View>
            </View>            
        </Modal>
    )
}

export default Loading
