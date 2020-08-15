import React from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet, Dimensions,  Image} from 'react-native';
import { useSettingsState } from 'container';

const { height, width } = Dimensions.get('screen');

const MyTab = ({ state, descriptors, navigation }) =>{
    const { darkMode } = useSettingsState();

    return (
        <View style={[styles.container, {backgroundColor: darkMode ? 'black' : 'white'}]}>
            
            {state.routes.map((route, index) => {

                const { options } = descriptors[route.key];

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableNativeFeedback
                        accessibilityRole="button"
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={route.key} >
                        <View  style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                            
                            { options.tabBarIcon( isFocused ) }
                           
                        </View>
                        
                    </TouchableNativeFeedback>
                );
            })}
        </View>
    )
}
  

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent:'center',
        paddingHorizontal:width/4,
        height: Math.round(height /10),
        maxHeight:70,
        elevation: 8
    }
});
export { MyTab };