import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	Text,
	FlatList,
	TouchableNativeFeedback,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Image,
} from 'react-native'

import { Avatar,ContactList, Tick } from 'components';
import { StackActions } from '@react-navigation/native';

import { createGroupChat, getContact } from 'services';

export default CreateGroupChat = (props) => {

	const [userList, setUserList] = useState();
	const [selected, setSelected] = useState(new Map());
	const [groupTitle, setGroupTitle] = useState();

	useEffect(() => {
		getContact(data => {
			setUserList(data);
		})
	}, []);

	const createNewGroup = () => {

		requestAnimationFrame(() => {
			var temp = selected;
			let selectedId = [...temp.entries()]
				.filter(({ 1: v }) => v === true)
				.map(([k]) => k);

			if (!groupTitle || groupTitle === "" || groupTitle.trim() == "") {
				alert(' pls write the group title ');
			} else if (selectedId.length <= 0) {
				alert('select member first');
			} else {
				createGroupChat(groupTitle, selectedId, callback => {
					props.navigation.dispatch(
						StackActions.replace('Chat', { chatId: callback, chatTitle: groupTitle, type: 'group' })
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

	const _renderItem = ({ item, index }) => (
		<TouchableNativeFeedback onPress={() => onSelect(item.id)}>
			<View style={styles.userContainer}>
				<View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
					<Avatar image={item.avatar} hasBorder={true} size="small" />
					<Text style={styles.userLabel}>{item.name}</Text>
				</View>
				<View>
					<Tick selected={selected.get(item.id)}/>
				</View>
			</View>

		</TouchableNativeFeedback>
	)


	return (

		<View style={styles.container}>
			<View>
				<TouchableOpacity style={{width:16, height:16}} onPress={()=>props.navigation.goBack()}>
					<Image source={require('../../assets/icon/close.png')} style={{flex:1, width:null}}/>
				</TouchableOpacity>
			</View>
			<Text style={styles.headerTitle}>New Group Name</Text>
			<View style={styles.textInputContainer}>
				<TextInput
					style={styles.textInputStyle}
					placeholder="Group name (Required)"
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		backgroundColor: 'white',
	},
	headerTitle: {
		fontFamily: 'SFProText-Semibold', fontSize: 16, textAlign: 'left',
	},
	textInputContainer: {
		borderBottomWidth: 1,
		borderColor: 'rgba(0,0,0,0.2)',
		marginVertical: 16
	},
	textInputStyle: {
		alignSelf: 'stretch',
		backgroundColor: 'white',
		padding: 0,
		fontFamily: 'SFProText-Regular'
	},
	headingLabel: {
		fontSize: 14,
		fontFamily: 'SFProText-Semibold',
		color: 'rgba(0,0,0,0.4)'
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
		borderRadius: 8,
	},
	btnLabel: {
		fontSize: 16,
		color: 'white',
		fontFamily: 'SFUIText-Bold',
	},
})