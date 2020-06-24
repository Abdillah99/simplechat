import React from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet, Dimensions,  Image} from 'react-native';

const { height, width } = Dimensions.get('screen');

function MyTab({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            
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
                    >
                        <View  style={{ flex: 1, justifyContent:'center', alignItems:'center'}}>
                           
                            <Text style={{ color: isFocused ? 'dodgerblue' : '#222' }}>
                                {label}
                            </Text>

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
        backgroundColor: 'white',
        flexDirection: 'row',
        height: Math.round(height / 9),
        elevation: 10
    }
});
export { MyTab };