import React from 'react';

import propTypes from 'prop-types'

import { 
    Image , 
    TouchableOpacity, 
    StyleSheet ,
    Dimensions,
    ActivityIndicator
} from 'react-native';

const { width } = Dimensions.get('screen');
const imageSize = width / 6.25;
const  Avatar = ( { onPress, image , hasBorder,  borderWidth, size,type } )=>{
    
    const defaultImage = require('../../assets/icon/user-default.png');
    const defaultGroup = require('../../assets/icon/group.png');

    const sourceImage = image ? {uri:image } : type ==='group' ? defaultGroup : defaultImage;
    const propBorder = borderWidth ? borderWidth : 0.3;
    
    const getSize = size === 'xSmall' ? {width:34, height:34}:
                    size === 'small' ? {width:50, height:50} : 
                    size === 'medium' ? { width:imageSize, height:imageSize} : 
                    size === 'large' ?{ width:70, height:70} : null;

    const getBorder = { borderWidth : hasBorder ? propBorder : 0};
    return(
        
        <TouchableOpacity 
            onPress={onPress}
            style={[styles.container, getBorder , getSize ]}>
            
            <Image 
                source={ sourceImage }
                style={[ styles.imageDefault ]}

                resizeMode="cover"
                />         

        </TouchableOpacity>         
    );

}
Avatar.propTypes ={
    onPress: propTypes.func,
    hasBorder: propTypes.bool,
};

Avatar.defaultProps ={
    hasBorder: false,
    size:'small',
}

const styles = StyleSheet.create({
    container:{
        borderRadius:50,
        backgroundColor:'white'
    },
    imageDefault:{
        flex:1,
        width:'100%',
        height:'100%',
        borderRadius:50,
    },
});

export default Avatar;