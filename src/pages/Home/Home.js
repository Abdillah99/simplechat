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
                chatListListener(data[item], chatData=>{
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
                            //dont have same object , add the new data to prevstate
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
    
        var recentMsgNamelabel = item.recent_message.user._id == userData.id ? 'you' : item.recent_message.user.name;
        return (
            <TouchableNativeFeedback onPress={ navigating(item._id, item.title )}>
                
                <View style={styles.chatCard} >
                    
                    <View style={{flex:2,justifyContent:'center', alignItems:'center',}}>
                        
                        <Avatar 
                            hasBorder={true} />

                    </View>

                    <View style={{ flex:6,paddingHorizontal:11, }}>

                        <Text style={{fontSize:18, marginTop:4, marginBottom:4, fontFamily:'SFUIText-Regular'}}>{item.title}</Text>
                        <Text style={{fontSize:12, fontFamily:'SFUIText-Light'}}>{recentMsgNamelabel  + ' : ' + item.recent_message.text}</Text>

                    </View>

                    <View style={{ flex:2,flexDirection:'column'}}>
                        
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            
                            <Text style={{ width:20, height:20, color:'white',backgroundColor:'purple', borderRadius:50, textAlign:'center', textAlignVertical:'center', fontSize:12}}>1</Text>
                        
                        </View>

                        <View style={{flex:1, justifyContent:'flex-end'}}>
                            <Text style={{fontSize:8}}>{parseTimeStamp.toLocale(item.recent_message.createdAt) }</Text>
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
                <View style={{height:75, width:75, position:'absolute', backgroundColor:'red', borderRadius:50, bottom:0, right:20}}>

                </View>
            </TouchableNativeFeedback>
            
            <TouchableOpacity onPress={ onLogout } style={{height:20, width:100}}>

                <Text>logout</Text>

            </TouchableOpacity>

        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    chatCard: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
        height: 80,
        justifyContent: 'center',
        flexDirection:'row',
        paddingVertical:4,
        paddingHorizontal:8,
    }
});