import React from 'react';

import propTypes from 'prop-types'

import { 
    Image , 
    View, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';


function Avatar( { onPress, image , hasBorder = false,  borderWidth } ){
    const defaultImage = require('../../assets/icon/user-default.png');
    const propBorder = borderWidth ? borderWidth : 0.3;

    return(
        
        <TouchableOpacity 
            onPress={onPress}
            style={[styles.container, {borderWidth:hasBorder ? propBorder : 0,}]}
            >
            
            <Image 
                source={ image ? image : defaultImage }
                style={{flex:1,width:null, height:null, borderRadius:50,}}
                resizeMode="cover"
                />         

        </TouchableOpacity>         
    );

}
Avatar.propTypes ={
    onPress: propTypes.func,
    hasBorder: propTypes.bool,

};

const styles = StyleSheet.create({
    container:{
        width:50,
        height:50,
        borderRadius:50,
        
    }
});

export default Avatar;