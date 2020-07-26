import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableNativeFeedback,
    TextInput,
    StyleSheet
} from 'react-native'

import { getAllUser, createGroupChat } from 'modules';
import { Avatar } from 'components';
import { StackActions } from '@react-navigation/native';

function CreateGroupChat(props) {

    const [userList, setUserList] = useState();
    const [selected, setSelected] = useState(new Map());
    const [groupTitle, setGroupTitle] = useState();

    useEffect(() => {

        getAllUser(data => {

            setUserList(data);

        });

    }, []);


    const createNewGroup = () => {
        
        requestAnimationFrame(() => {

            var temp = selected;
            let selectedId = [...temp.entries()]
                .filter(({ 1: v }) => v === true)
                .map(([k]) => k);

            if ( !groupTitle || groupTitle === "" || groupTitle.trim() == "" ) {

                alert(' pls write the group title ');

            } else if ( selectedId.length <= 0 ){
                alert('select member first');
            }else { 
                createGroupChat(groupTitle, selectedId, callback => {
                    props.navigation.dispatch(
                        StackActions.replace('Chat', { chatId: callback, chatTitle: groupTitle, })
                    );
                });
            }

        })
        
    }

    const onSelect = useCallback(
        id => {
            const newSelected = new Map(selected);
            newSelected.set(id, !selected.get(id));

            setSelected(newSelected);
        },
        [selected],
    );


    const _renderItem = ({ item, index }) => {

        return (

            <TouchableNativeFeedback onPress={() => onSelect(item.id)}>

                <View style={[styles.userContainer, { backgroundColor: !!selected.get(item.id) ? 'dodgerblue' : 'white' }]}>

                    <Avatar image={item.avatar} hasBorder={true} />

                    <Text style={styles.userLabel}>{item.username}</Text>

                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    style={{ alignSelf: 'stretch', backgroundColor: 'white' }}
                    placeholder="Group name"
                    onChangeText={(text) => setGroupTitle(text)} />

            </View>


            <Text style={styles.headingLabel}>Select member :</Text>

            <FlatList
                data={userList}
                extraData={selected}
                renderItem={_renderItem}
                keyExtractor={(item, index) => item.id}
            />

            <TouchableNativeFeedback onPress={createNewGroup}>
                <View style={styles.btnCreateGroup}>
                    <Text style={styles.btnLabel}> Create Group</Text>
                </View>
            </TouchableNativeFeedback>


        </View>
    )
}

export default CreateGroupChat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
        backgroundColor: 'white',
    },
    headingLabel: {
        fontSize: 16,
        fontFamily: 'SFUIText-SemiBold',
    },
    userContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 40,
        padding: 10,
    },
    userLabel: {
        fontSize: 14,
        fontFamily: 'SFUIText-Bold',
        paddingHorizontal: 8,
    },
    btnCreateGroup: {
        alignSelf: 'stretch',
        height: 60,
        backgroundColor: 'dodgerblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    btnLabel: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'SFUIText-Bold',
    },
})