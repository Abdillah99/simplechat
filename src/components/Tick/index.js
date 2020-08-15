import React from 'react'
import { StyleSheet, Text, View, Image, BackHandler } from 'react-native'

const Tick = ({selected}) => {
    return (
        <View style={styles.tickContainer}>
            {selected && 
            <Image source={require('../../assets/icon/tick.png')} 
                    style={styles.tickStyle} />
            }
        </View>
    )
}

export default Tick

const styles = StyleSheet.create({
    tickContainer:{
        borderWidth:1, 
        borderRadius:50,
        width:16,
        height:16,

    },
    tickStyle:{
        flex:1, 
        width:null,
        tintColor:'black',
    }
})
