import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    Image,
    TextInput,
    StyleSheet
} from 'react-native'

import { getPrivateChatId, getContact } from 'services';
import { Avatar,MainHeader,SearchBar } from 'components';

export default CreateChat = (props)=> {

    const [ userList, setUserList ] = useState();
    
    useEffect(() => {

        getContact(data => {
            setUserList( data );
        });

    },[]);

    const createPrivateChat = ( user2data ) => async() =>{
        
        const id = await getPrivateChatId( user2data.id );
        props.navigation.navigate('Chat',{chatTitle: user2data.name,  user2data : user2data, chatId:id });
        
    }

    const _renderItem = ({ item, index }) => {

        return (
            
            <TouchableNativeFeedback onPress={ createPrivateChat( item ) }>

                <View style={styles.userContainer}>

                    <Avatar image={item.avatar} size="small"/> 

                    <Text style={styles.userLabel}>{item.name}</Text>

                </View>

            </TouchableNativeFeedback>
        )
    }

    const _renderHeader = () =>(
            <Text style={{fontFamily:'SFProText-Semibold', color:'rgba(0,0,0,0.4)',marginLeft:12,marginBottom:8,fontSize:14}}>People</Text>
        )
    
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateGroupChat')}>
                <View style={{alignSelf:'stretch', flexDirection:'row', alignItems:'center',height:60,padding:12}}>
                    <View style={{width:40,height:40, backgroundColor:'rgba(0,0,0,0.1)', borderRadius:50, justifyContent:'center', alignItems:'center'}}>
                        <Image source={require('../../assets/icon/create-new-group.png')} />
                    </View>
                    <Text style={{fontFamily:'SFProText-Semibold', marginLeft:8}}>Create a New Group</Text>
                </View>
            </TouchableNativeFeedback>
            <FlatList
                data={userList}
                renderItem={_renderItem}
                ListHeaderComponent={_renderHeader}
                keyExtractor={(item, index) => item.id}
                contentContainerStyle={{paddingVertical:8,}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    btnCreateGroup:{
        alignSelf:'stretch', 
        height:60, 
        backgroundColor:'dodgerblue',
        justifyContent:'center',
         alignItems:'center',
         borderRadius:10,
    },
    btnLabel:{
        fontSize:16,
        color:'white',
        fontFamily:'SFUIText-Bold',
    },
    userContainer:{
        alignSelf: 'stretch', 
        flexDirection:'row',
        alignItems:'center', 
        minHeight: 50, 
        backgroundColor:'white',
        padding:12,
    },
    userLabel:{
        fontSize:14,
        fontFamily:'SFProText-Semibold',
        paddingHorizontal:8,
    }
})