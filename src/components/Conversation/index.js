import React, { useCallback } from 'react';
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    Image
} from 'react-native';
import {useAuthState} from 'container'

import ChatCard from '../Card/Chat';
import SearchBar from '../SearchBar';


export default Conversation = (props) => {
    const { userData } = useAuthState();
    const { onItemPress , state } = props;

    const renderItem = ({ item }) => {
        var userDat = userData != undefined ? userData : {}; 
        var alreadyRead = item.recent_message.readedBy[userDat.id]  ? true : false;

        return (
            <ChatCard
                item={item}
                readed={alreadyRead}
                onPress={onItemPress}
                />
        )
    }

    const renderEmptyChat = () =>(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', }}>
            <Image source={require('../../assets/images/people.png')} style={{width:200, height:200, tintColor:'whitesmoke'}}  />
            <Text style={{fontFamily:'SFProText-Regular', fontSize:12, color:'grey'}}>You're not chatting with anyone yet</Text>
        </View>
    )
    
    const renderHeader = useCallback(() =>( <SearchBar /> ),[])
    
    if( state.isLoading ) return (
        <View style={{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="whitesmoke" />
        </View>
    )

    return (
        <FlatList
            data={state.chats}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyChat}
            contentContainerStyle={{ paddingBottom:8, flex:1,}}
        />

    )

}