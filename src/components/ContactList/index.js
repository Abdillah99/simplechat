import React,{useState,useEffect} from 'react'
import { View, Text, FlatList, TouchableNativeFeedback,StyleSheet } from 'react-native'
import { getContact } from 'services';
import Avatar from '../Avatar';

const ContactList = ({ headerText, onItemPress }) => {
    const [ userList, setUserList ] = useState([]);
    
    useEffect(() => {

        getContact(data => {
            setUserList( data );
        });

    },[]);
    
    const _renderHeader = () =>{
        if( headerText !== undefined && headerText !== null ) return <Text style={styles.headerLabel}>{headerText}</Text>
        else return null;
    }

    const createPrivateChat = ( item ) => () =>{
        onItemPress(item)
    }

    const _renderItem = ({ item, index }) => (
        <TouchableNativeFeedback onPress={ createPrivateChat( item ) }>
            <View style={styles.userContainer}>
                <Avatar image={item.avatar} size="small"/> 
                <Text style={styles.userLabel}>{item.name}</Text>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <FlatList
            data={userList}
            renderItem={_renderItem}
            ListHeaderComponent={_renderHeader}
            keyExtractor={(item, index) => item.id}
            contentContainerStyle={{paddingVertical:8,}}
        />
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
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
    },
    headerLabel:{
        fontFamily:'SFProText-Semibold', 
        color:'rgba(0,0,0,0.4)',
        marginLeft:12,
        marginBottom:8,
        fontSize:14
    }
})
export default ContactList
