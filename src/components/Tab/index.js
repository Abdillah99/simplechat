import React from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('screen');

export default function Tab( props ){
    return(
        <View style={{flexDirection:'column', height:Math.round(height/9), backgroundColor:'transparent' }}>
            
            <View style={{flex:0.3}}>

            <TouchableNativeFeedback>

                <View style={{width: 50, height:50, position:'absolute', alignSelf:'center', justifyContent:'flex-end',alignItems:'center', zIndex:1, backgroundColor:'white'}}>
                    <View style={{width:50, height:30,borderWidth:1, borderTopWidth:0,  backgroundColor:'white', borderBottomLeftRadius:25, borderBottomRightRadius:25}}/>

                </View>

            </TouchableNativeFeedback>
            </View>
            
            <View style={{flex:0.7, borderTopWidth:0.5,}}>

            </View>
        </View>
    )
}