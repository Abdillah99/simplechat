import React,{useState, useCallback} from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Modal,ActivityIndicator } from 'react-native'
import { Avatar, FloatingLabel, LoadingModal } from 'components'
import ImagePicker from 'react-native-image-crop-picker';

import { uploadImage, useAuthState,useAuthContext, updateUser, firebaseGetCurrentUser } from 'modules';

import { debounce } from 'lodash';
import { updateUserProfile } from 'services';

export default function Profile() {
    const { userData } = useAuthState();

    var tmpImg = userData != undefined ? userData.profileImage : null;

    const [ img, setImg ]    = useState( tmpImg );
    const [ name , setName ] = useState('max');
    const [ isLoading, setLoading ] = useState(false);
    const { updateProfile } = useAuthContext();

    const openPicker = () =>{

        ImagePicker.openPicker({
            width:500,
            height:500,
            compressImageQuality:1,
            cropping:true,
        }).then( image =>{

            setLoading(true);
            uploadImage( 'users-avatar/', userData.id, image.path)
                        .then( res =>{

                            const data ={
                                avatar: res,
                            }
                            updateUser( userData.id , data );
                            updateUserProfile({photoURL: res} );
                            updateProfile({profileImage:res});
                            setImg(res);
                            setLoading(false);
                        });

        }).catch( err =>{
            console.log( err );
        })

    }

    const handler = ( param ) => useCallback( debounce(setName( param ), 2000), []);

    const onChangeName = ( text )=>{
       handler(text);
    }
    console.log( firebaseGetCurrentUser() );
    return (
        <ScrollView style={styles.container}>

            <View style={styles.avatarContainer}>
            
                <Avatar 
                    image={img}
                    hasBorder={true}
                    size="large" />

                <Text onPress={ openPicker }>Change profile</Text>
            
            </View>
            
            <View style={styles.bioContainer}>
                <View>
                    <FloatingLabel 
                        label="Name" 
                        value={ name }
                        onChangeText={onChangeName}
                        />
                </View>

                <View>
                    <FloatingLabel 
                        label="Email" 
                        value={ name }
                        onChangeText={onChangeName}
                        />
                </View>

                <View>
                    <FloatingLabel 
                        label="Password" 
                        value={ name }
                        onChangeText={onChangeName}
                        />
                </View>


            </View>
            
            <View style={styles.buttonContainer}>

            </View>

            <LoadingModal isVisible={isLoading} text="Uploading image " />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        paddingHorizontal:12,
    },

    avatarContainer:{
        flex:2,
        alignItems:'center',
        flexDirection:'column',
        marginVertical:12,
    },

    bioContainer:{
        flex:7,
    },

    buttonContainer:{
        flex:1,
    },
})



