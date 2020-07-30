import React, { useEffect,useState } from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet,Dimensions } from 'react-native'

import { parseTimeStamp } from 'utils';
import { Avatar } from 'components';

import PropTypes from 'prop-types'

import { getCurrentUser, getUserImage } from 'services';
import _ from 'lodash';

const Chat = ( props )=>{
    // id , title and onpress are not updated
    const { _id, title, recent_message, onPress, readed, type, members } = props;
    const [ img , setImg ] = useState();

    var recentMsgNamelabel = recent_message.user != undefined ? recent_message.user.name + ' : ' : '' ;
    var recentTime = parseTimeStamp.toLocale(recent_message.createdAt);
    var recentText = recent_message.text;

    const waitAnim = () =>{
        requestAnimationFrame( () =>{
            onPress( _id , title)
        });
    }
    const loadAvatar = () =>{
        if( type === 'private' ){
            var res= _.omit(members, getCurrentUser().uid);
            var id = Object.keys(res)[0];
            getUserImage(id).then(res=>{
                if( res ) setImg(res);
            })
        }
    }

    useEffect(()=>{
        loadAvatar()
    },[])
    return (

        <TouchableNativeFeedback onPress={ waitAnim } >

            <View style={styles.chatCard} >

                <View style={styles.leftContainer}>

                    <Avatar 
                        type={type}
                        image={img}
                        hasBorder={false} />

                </View>

                <View style={styles.centerContainer}>

                    <Text style={styles.labelTitle}>

                        { title }

                    </Text>

                    <View style={styles.msgLabelContainer}>

                        <Text style={ [styles.msgLabel, {color:readed? 'gray' : 'black'}] } numberOfLines={1}>

                            {recentMsgNamelabel + recentText}

                        </Text>

                        <Text style={[styles.msgTimeLabel,{color:readed? 'gray' : 'black'}]}>  {recentTime}</Text>

                    </View>

                </View>
            { !readed && 
                <View style={styles.rightContainer}>

                    <View style={styles.notificationCircle} />

                </View>
            }

            </View>

        </TouchableNativeFeedback>
    )
}
Chat.PropTypes ={
    id:  PropTypes.object || PropTypes.string,
    title: PropTypes.object || PropTypes.string,
    recent_message: PropTypes.object || PropTypes.string,
    onPress: PropTypes.func,
    readed: PropTypes.bool,
};

function shouldComponentUpdate(prevProps, nextProps){
    return prevProps.recent_message === nextProps.recent_message;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    chatCard: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: height /8,
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
        maxWidth: '68%',
        color: 'gray',
        fontSize: 12,
        fontFamily: 'SFUIText-Light',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    msgTimeLabel: {
        flex: 1,
        fontSize: 10,
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
  
});

export default React.memo( Chat, shouldComponentUpdate );

