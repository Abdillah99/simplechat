import React, { useEffect,useState } from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet,Dimensions } from 'react-native'

import { parseTimeStamp } from 'utils';
import Avatar from '../Avatar';

import PropTypes from 'prop-types'

import { getCurrentUser, getUserImage } from 'services';
import _ from 'lodash';

const {  height, width } = Dimensions.get('window');
const fontS = width / 26.78;

const Chat = ( { onPress, readed, item })=>{
    // id , title and onpress are not updated
    const [ img , setImg ] = useState();
    
    const title = item.title;
    const type = item.type;
    const members = item.members;
    
    var recent_message =  item.recent_message != undefined ? item.recent_message : false;

    var recentMsgNamelabel = recent_message.user != undefined ? recent_message.user.name + ' : ' : '' ;
    var recentTime = parseTimeStamp.toLocale(recent_message.createdAt);
    var recentText = recent_message.text;

    const waitAnim = () =>{
        onPress(item)
    }

    const loadAvatar = () =>{
        if( type === 'private' ){
            var temp = Object.keys(members);

            var res = temp.filter(item => item != getCurrentUser().uid);
            var id = res[0];
            getUserImage(id).then(res=>{
                if( res ) setImg(res);
            })
        }
    }

    useEffect(()=>{
        loadAvatar()
    },[])
    return (

        <TouchableNativeFeedback onPress={ waitAnim }>

            <View style={styles.chatCard} >

                <View style={styles.leftContainer}>

                    <Avatar 
                        type={type}
                        image={img}
                        hasBorder={true} 
                        size="medium" />

                </View>

                <View style={styles.centerContainer}>

                    <Text style={styles.labelTitle}>

                        { title }

                    </Text>

                    <View style={styles.msgLabelContainer}>

                        <Text style={ [styles.msgLabel, {color:readed? 'rgba(0,0,0,0.5)' : 'black'}] } numberOfLines={1}>

                            {recentMsgNamelabel + recentText }

                        </Text>

                        <Text style={[styles.msgTimeLabel,{color:readed? 'rgba(0,0,0,0.5)' : 'black'}]} > · {recentTime}</Text>

                    </View>

                </View>

                {!readed &&
                   
                <View style={styles.rightContainer}>
                   <View style={styles.notificationCircle} /> 
                </View>
                   
                } 

            </View>

        </TouchableNativeFeedback>
    )
}
Chat.PropTypes ={
    item :PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['private','group']),
        members: PropTypes.object,
    })),
    onPress: PropTypes.func,
    readed: PropTypes.bool,
};

function shouldComponentUpdate(prevProps, nextProps){
    return prevProps.item.recent_message === nextProps.item.recent_message;
}


const styles = StyleSheet.create({
    chatCard: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: height /8,
        paddingHorizontal:16,
    },

    leftContainer: {
        alignSelf:'stretch',
        marginRight:8,
        justifyContent: 'center',
        justifyContent:'center',
    },

    centerContainer: {
        flex:1,
        justifyContent: 'center',
    },
    labelTitle: {
        fontSize: 17,
        fontFamily: 'SFProText-Medium',
        color:'rgba(0,0,0,1)',
        margin: 0,
        padding: 0,
    },
    msgLabelContainer: {
        flexDirection: 'row',
        alignItems:'center',
        alignSelf:'stretch',
    },
    msgLabel: {
        fontSize: fontS,
        fontFamily: 'SFProText-Regular',
        textAlign: 'left',
        maxWidth:'65%',
        margin: 0,
        padding: 0,

    },
    msgTimeLabel: {
        fontSize: fontS,
        alignSelf:'stretch',
        fontFamily: 'SFProText-Regular',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    rightContainer: {

        padding:6,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    notificationCircle: {
        width: 10,
        height: 10,
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
    },
  
});

export default React.memo( Chat, shouldComponentUpdate );

