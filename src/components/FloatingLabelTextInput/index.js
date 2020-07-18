import React from 'react'
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native'

const FloatingLabel = ( props ) => {
    const { label } = props;
    const [ isFocused , setFocused ] = React.useState(false);

    const animatedIsFocused = React.useRef(new Animated.Value(props.value === '' ? 0 :1)).current;
    
    React.useEffect(()=>{

        Animated.timing(animatedIsFocused,{
            toValue:( isFocused || props.value !== '' ) ? 1 :0,
            duration:200,
            useNativeDriver:false,
        }).start();

    },[props.value, isFocused]);

    const _onFocus = () => setFocused(true);

    const _onBlur = () => setFocused(false);
    
    const labelStyle ={
        position:'absolute',
        left:0,
        top: animatedIsFocused.interpolate({
            inputRange:[0,1],
            outputRange:[18,0],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange:[0,1],
            outputRange:[20,14],
        }),
        color:animatedIsFocused.interpolate({
            inputRange:[0,1],
            outputRange:['#aaa', '#000']
        }),

    }

    return (
        <View style={{paddingTop:18}}>
            
            <Animated.Text style={labelStyle}>{label} </Animated.Text>
            
                <TextInput 
                    {...props}
                    underlineColorAndroid="#000"
                    onFocus={_onFocus}
                    onBlur={_onBlur}
                    blurOnSubmit={true}
                    />
        </View>
    )
}

export default FloatingLabel

const styles = StyleSheet.create({

})
