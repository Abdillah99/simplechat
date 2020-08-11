import React, {memo} from 'react'
import { View, Text,StyleSheet, Image,Dimensions,TextInput } from 'react-native'
const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
    container:{
        alignSelf:'stretch',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height: height / 16,
        backgroundColor:'rgba(0,0,0,0.05)',
        borderRadius:10,
        paddingHorizontal: 8,
        marginHorizontal:16,
        marginVertical:8,
    },
    searchTextIn:{
        flex:9,
        fontSize:12,
        padding:0,
    },
    iconContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

    
})

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image source={require('../../assets/icon/search.png')} />
            </View>
            <TextInput placeholder="Search" style={styles.searchTextIn} numberOfLines={1} scrollEnabled={false}/>
       
        </View>
    )
}

export default memo(SearchBar)
