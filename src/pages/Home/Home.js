import React, { useState, useEffect } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image
} from 'react-native';

import { Avatar } from 'components';

import { useAuthState, getAllChat, chatListListener, refOff, useSettingsState } from 'modules';
import { parseTimeStamp } from 'utils';
import { initChatList, subscribeChatList } from 'services';
export default Home = (props) => {

    const { userData } = useAuthState();
    const [chatList, setChatList] = useState([]);
    const [ initialFetch, setInitialFetch ] = useState([false]);
    const { chatData  } = useSettingsState();
    
    useEffect(() => {
        //get all user chat id
        setChatList( chatData.chats );
        // initChatList( data =>{

        //     data.forEach( item =>{ 
                
        //         subscribeChat( item.val(), chatData =>{
                    
        //             setChatList(prevstate => {
        //                 // check if the object exist in prevstate array by object _id  
        //                 let objIndx = prevstate.findIndex((obj => obj._id == chatData._id));
        //                 // javascript find index returning -1 if object not exist
        //                 if (objIndx != -1) {
        //                     //found same state, update prevstate data  
        //                     prevstate[objIndx] = chatData;

        //                     return [...prevstate];
        //                 }
        //                 else 
        //                 {
        //                     return [...prevstate, chatData];
        //                 }
        //             });
                
        //         })
        //     })
        // }); 

        return refOff();

    }, []);


  
    var clientData = () =>{
        var sorted = chatList.sort(( a, b ) => b.recent_message.createdAt - a.recent_message.createdAt );
        return sorted;
        
    }

    const navigating = (id, title, index ) => () => {
        props.navigation.navigate('Chat', { chatId: id, chatTitle: title,});
    }

    const markReadedMsg = () =>{

    }

    const renderItem = ({item , index}) => {
        var usrDat = userData ? userData : {};
        var recentMsgNamelabel = item.recent_message ? 
                                item.recent_message.system ? 
                                '' : 
                                item.recent_message.user ? 
                                item.recent_message.user._id == usrDat._id ? 
                                'you :':
                                item.recent_message.user.name + ' :' : 
                                '':
                                '';
        var recentMsgText = item.recent_message ? item.recent_message.text : 'null'
        var recentMsgTime = item.recent_message ? parseTimeStamp.toLocale(item.recent_message.createdAt) : 'null';

        return (

            <TouchableNativeFeedback onPress={navigating(item._id, item.title, index )}>

                <View style={styles.chatCard} >

                    <View style={styles.leftContainer}>

                        <Avatar hasBorder={true} />

                    </View>

                    <View style={styles.centerContainer}>

                        <Text style={styles.labelTitle}>

                            {item.title}

                        </Text>

                        <View style={styles.msgLabelContainer}>

                            <Text style={styles.msgLabel} numberOfLines={1}>

                                {recentMsgNamelabel + ' ' + recentMsgText}

                            </Text>

                            <Text style={styles.msgTimeLabel}>  {recentMsgTime}</Text>

                        </View>

                    </View>

                    <View style={styles.rightContainer}>

                        <View style={styles.notificationCircle} />

                    </View>

                </View>

            </TouchableNativeFeedback>
        )
    }
    return (

        <View style={styles.container}>

            <FlatList
                data={ chatList }
                keyExtractor={ (item,index) => item._id }
                renderItem={ renderItem }
                contentContainerStyle={{paddingHorizontal:10}}
            />

            <TouchableNativeFeedback onPress={() => props.navigation.navigate('CreateChat')} style={{borderRadius:50}}>
                
                <View style={ styles.hoverButtonContainer }>

                    <Image source={require('../../assets/icon/plus.png')} style={{width:20, height:20, tintColor:'white' }}/>
               
                </View>

            </TouchableNativeFeedback>

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
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 80,
    },

    leftContainer: {
        flex: 1, 
        justifyContent: 'center',
    },

    centerContainer: {
        flex: 3.5, 
        justifyContent: 'center',
    },
    labelTitle: {
        fontSize: 18, 
        fontFamily: 'SFUIText-Regular',
        margin: 0, 
        padding: 0,
    },
    msgLabelContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
    },
    msgLabel: {
        maxWidth: '75%', 
        color: 'gray', 
        fontSize: 12, 
        fontFamily: 'SFUIText-Light', 
        textAlign: 'left', 
        margin: 0, 
        padding: 0,
    },
    msgTimeLabel: {
        flex: 1, 
        fontSize: 12, 
        color: 'gray', 
        fontFamily: 'SFUIText-Light', 
        textAlign: 'left', 
        margin: 0, 
        padding: 0,
    },
    rightContainer: {
        flex: 0.5, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    notificationCircle: {
        width: 10, 
        height: 10, 
        backgroundColor: 'dodgerblue', 
        borderRadius: 50, 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        fontSize: 12,
    },
    hoverButtonContainer:{
        height: 55, 
        width: 55, 
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute', 
        backgroundColor: 'dodgerblue', 
        borderRadius: 50, 
        bottom: 10, 
        right: 20, 
        elevation: 3
    }
});