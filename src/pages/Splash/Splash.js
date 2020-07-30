import * as React from 'react';

import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';


export default Splash = props => {

    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <ActivityIndicator size="large" color="dodgerblue"/>

            <Text>Wait a second</Text>

        </View>
    )
}


