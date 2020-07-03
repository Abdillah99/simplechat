import * as React from 'react';
import { Image }from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuthContext, useAuthState, get, keys, } from 'modules';

import { MyTab } from 'components';

import {
    SignIn,
    SignUp,
    Chat,
    Splash,
    Home,
    Settings,
    Profile,
    CreateChat,
    CreateGroupChat,
    Loading,
} from 'pages';

import auth from '@react-native-firebase/auth';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );

}

function HomeTab() {

    return (
        <Tab.Navigator initialRouteName="Home" tabBar={ props => <MyTab {...props} /> }>
            <Tab.Screen name="Home" 
                        component={Home} 
                        options={{
                            tabBarIcon:( <Image source={require('../assets/icon/tab-bar-chat.png')} style={{width:20, height:20, tintColor:'dodgerblue'}}/> )
                        }}/>
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    )
}

function HomeStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Loading" component={Loading} options={{headerShown:false}} />
            <Stack.Screen name="HomeTab" component={HomeTab} options={{headerShown:false}} />
            <Stack.Screen name="Chat" component={Chat}  />
            <Stack.Screen name="CreateChat" component={CreateChat} />
            <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    )
}

export default function MainStack() {

    const { isLoading, userToken, isSignout } = useAuthState();
    const { restoreToken, signUp } = useAuthContext();
    
    React.useEffect(() => {
        //componentdid mount
        const subscriber = auth().onAuthStateChanged( user=>{
            
            if( user != null )
            {

                const data = {
                    token:user.uid,
                    userData:{
                        id:user.uid,
                        name: user.displayName,
                        email: user.email,
                        profileImage: user.photoURL,
                    },
                }
    
                restoreToken( data );

            }
             else 
            {
                const data ={
                    token:null,
                    userData:null,
                }
                restoreToken( data );
            }
            
        });

        //component unmount
        return subscriber;

    }, [] );

    return (

        <NavigationContainer >

            <Stack.Navigator>
                { isLoading ? (

                    <Stack.Screen
                        name="Splash"
                        component={ Splash }
                        options={{ headerShown: false }} />

                ) : userToken == null ? (

                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                        options={{ headerShown: false, animationTypeForReplace: isSignout ? 'pop' : 'push', }} />

                ) : (

                        <Stack.Screen
                            name="Home"
                            component={HomeStack}
                            options={{ headerShown: false }} />

                        )

                }
            </Stack.Navigator>

        </NavigationContainer>
    );
}


