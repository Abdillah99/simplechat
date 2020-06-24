import React, {useState, useEffect} from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';

import { Avatar  } from '../../components';

import { useAuthState, getAllChat,chatListListener, refOff, signOut } from '../../modules';
import { parseTimeStamp } from '../../utils';
import { signOutService } from '../../services';

export default Home = (props) => {

    const { userData } = useAuthState();
    const [chatList, setChatList] = useState([]);

    useEffect( ()=> {
        //get all user chat id
        getAllChat( data => {
            // listening chat_list update 

            ///users/chat_list child are returning object not an array
            // need to foreach object
            Object.keys( data ).forEach( item =>{
                // begin listen each chat_list update
                chatListListener( data[item], chatData=> {
                    //update chatList state
                    setChatList( prevstate => {
                        // check if the object exist in prevstate array by object _id  
                        let objIndx = prevstate.findIndex((obj => obj._id == chatData._id));
                        // javascript find index returning -1 if object not exist
                        if( objIndx != -1 ){
                            //found same state, update prevstate data  
                            prevstate[objIndx] = chatData;

                            return [ ...prevstate ];
                        }
                          else
                        {
                            //not have same object , add the new data to prevstate
                            
                            return [...prevstate, chatData ];
                        }
                    });
                });

            });

        });

        return refOff();

    }, []);


    const onLogout = () =>{

        signOutService( signOut );

    }

    const navigating =( id , title ) => () => {
        props.navigation.navigate('Chat', {chatId: id, chatTitle: title,chatType:'group' });
    }
    
    const renderItem = ({ item }) => {
    
        var recentMsgNamelabel = item.recent_message ? item.recent_message.user._id == userData.id ? 'you' : item.recent_message.user.name: 'null';
        var recentMsgText = item.recent_message ? item.recent_message.text : 'null'
        var recentMsgTime = item.recent_message ?  item.recent_message.createdAt : 'null';

        return (
            <TouchableNativeFeedback onPress={ navigating(item._id, item.title )}>
                
                <View style={styles.chatCard} >
                    
                    <View style={{flex:1,justifyContent:'center', }}>
                        
                        <Avatar 
                            hasBorder={true} />

                    </View>

                    <View style={{ flex:3.5, justifyContent:'center', }}>

                        <Text style={{fontSize:18,  fontFamily:'SFUIText-Regular', margin:0, padding:0}}>
                            {item.title}
                        </Text>

                        <View style={{flexDirection:'row', justifyContent:'center'}}>

                            <Text style={{ maxWidth:'82%', color:'gray', fontSize:12, fontFamily:'SFUIText-Light', textAlign:'left',margin:0, padding:0}} numberOfLines={1}>
                             
                                {recentMsgNamelabel  + ' : ' + recentMsgText }

                            </Text>

                            <Text style={{flex:1,fontSize:12,color:'gray', fontFamily:'SFUIText-Light', textAlign:'left', margin:0, padding:0}}>  { parseTimeStamp.toLocale( recentMsgTime ) }</Text>

                        </View>

                    </View>

                    <View style={{ flex:0.5,flexDirection:'column',justifyContent:'center', alignItems:'center'}}>
                        
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            
                            <View style={{ width:10, height:10, backgroundColor:'dodgerblue', borderRadius:50, textAlign:'center', textAlignVertical:'center', fontSize:12}}/>
                        
                        </View>
                
                    </View>
                    
                </View>
            
            </TouchableNativeFeedback>
        )
    }
    return (

        <View style={styles.container}>

            <FlatList
                data={chatList}
                keyExtractor={ (item,index) => item._id }
                renderItem={renderItem}
            />

            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateChat')}>
                <View style={{height:55, width:55, position:'absolute', backgroundColor:'dodgerblue', borderRadius:50, bottom:10, right:20,elevation:3 }}>

                </View>
            </TouchableNativeFeedback>
            
            {/* <TouchableOpacity onPress={ onLogout } style={{height:20, width:100}}>

                <Text>logout</Text>

            </TouchableOpacity> */}

        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal:6
    },

    chatCard: {
        alignSelf: 'stretch',
        flexDirection:'row',
        backgroundColor: 'white',
        height: 80,
    }
});