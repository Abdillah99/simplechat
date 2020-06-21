import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    TextInput
} from 'react-native'

import { getAllUser, createGroupChat } from '../../modules';

function CreateGroupChat(props) {

    const [ userList, setUserList ] = useState();
    const [ selected , setSelected ] = useState( new Map());
    const [ groupTitle, setGroupTitle ] = useState();

    useEffect(() => {

        getAllUser(data => {

            setUserList( data );
            
        });

    },[]);


    const createNewGroup = ( )  => {

        var temp = selected;
        
        let selectedId = [...temp.entries()]
            .filter( ( { 1:v } ) => v === true)
            .map( ( [ k ] ) => k);

        createGroupChat( groupTitle, selectedId, callback =>{
            props.navigation.navigate('Chat', {chatId: callback, chatTitle: groupTitle, chatType:'group' });
            
        });

    }

    const onSelect = useCallback( 
        id =>{
            const newSelected = new Map( selected );
            newSelected.set(id, !selected.get(id));

            setSelected(newSelected);
        }, 
        [selected],
    );


    const _renderItem = ({ item, index }) => {

        return (
            
            <TouchableNativeFeedback onPress={()=> onSelect( item.id ) }>

                <View style={{ alignSelf: 'stretch', margin: 12, minHeight: 40, backgroundColor: selected.get(item.id) ? 'red' : 'white' }}>
                    <Text>{item.username}</Text>
                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <View>
            <Text>Create Group Chat </Text>
            <Text>Select member :</Text>

            <FlatList
                data={userList}
                extraData={selected}
                renderItem={_renderItem}
                keyExtractor={(item, index) => item.id}
            />

            <TouchableNativeFeedback onPress={createNewGroup}>
                <View style={{ alignSelf:'stretch', height:60, backgroundColor:'purple',}}>
                    <Text> Create Group</Text>
                </View>
            </TouchableNativeFeedback>

            <TextInput 
                style={{alignSelf:'stretch', backgroundColor:'white'}}
                placeholder="Group name" 
                onChangeText={( text ) => setGroupTitle( text )} />
        
        </View>
    )
}

export default CreateGroupChat;
