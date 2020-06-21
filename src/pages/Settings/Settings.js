import React from 'react';

import {
    View,
    Text,
} from 'react-native';

import { useAuthState } from '../../modules'
export default function Settings( props ){

    const { userData }  = useAuthState();

    return(
        <View>
            <Text>Username : { userData.name } </Text>
            <Text>all Data: {JSON.stringify(userData)}</Text>
        </View>
    )

}