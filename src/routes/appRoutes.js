import * as React from 'react';
import { Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthState } from 'container'
import { MyTab, MainHeader, ChatHeader } from 'components';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="SignIn"
				component={SignIn} 
				options={{ headerShown: false }} />
			<Stack.Screen 
				name="SignUp" 
				component={SignUp}
				options={{ 
					headerTitle:'Register account',
					headerStyle:{elevation:0},
					}} />
		</Stack.Navigator>
	);

}

function HomeTab() {
	return (
		<Tab.Navigator 
			initialRouteName="Home" 
			tabBar={props => <MyTab {...props} />} 
			tabBarOptions={{keyboardHidesTabBar:true}}>
			<Tab.Screen 
				name="Home"
				component={Home}
				options={{
					tabBarIcon: (focused) => (
						<Image
							source={require('../assets/icon/tab-bar-chat.png')}
							style={{ width: 20, height: 20, tintColor: focused ? 'black' : '#A4AAB2' }} />
					),

				}} />

			<Tab.Screen 
				name="Settings" 
				component={Settings}
				options={{
					tabBarIcon: (focused) => (
						<Image
							source={require('../assets/icon/tab-bar-setting.png')}
							style={{ width: 20, height: 20, tintColor: focused ? 'black' : '#A4AAB2' }} />
					),

				}} />
		</Tab.Navigator>
	)
}

const forFade = ({ current, closing }) => ({
	cardStyle: {
		opacity: current.progress,
	},
});

function HomeStack() {

	return (
		// screenOptions={{header: ({scene, previous, navigation}) => MainHeader(scene, previous, navigation) }}
		<Stack.Navigator headerMode="screen" >
			<Stack.Screen
				name="Loading"
				component={Loading}
				options={{ headerShown: false, cardStyleInterpolator: forFade }} />
			<Stack.Screen 
				name="HomeTab" 
				component={HomeTab} 
				options={{ 
					headerShown: false, 
					cardStyleInterpolator: forFade, }} />
			<Stack.Screen 
				name="Chat" 
				component={Chat} 
				options={{
					headerShown: true, 
					cardStyleInterpolator:forFade, 
					header:({scene, previous, navigation}) =>( 
							<ChatHeader 
							scene={scene} 
							previous={previous} 
							navigation={navigation} />
					)
					}
				} />
			<Stack.Screen 
				name="CreateChat" 
				component={CreateChat} 
				options={{ cardStyleInterpolator:  CardStyleInterpolators.forHorizontalIOS }} />
			<Stack.Screen 
				name="CreateGroupChat" 
				component={CreateGroupChat} 
				options={{
					headerShown: false, 
					cardStyleInterpolator:  CardStyleInterpolators.forVerticalIOS
				}} 
			/>
			<Stack.Screen 
				name="Profile" 
				component={Profile} 
				options={{ 
					headerShown:false,
					cardStyleInterpolator: forFade 
					}} />
		</Stack.Navigator>
	)
}

const renderRoot = () =>{
	const { isLoading, userData, isSignout } = useAuthState();
	//screen is loading
	if( isLoading ) return(
		<Stack.Screen 
			name="Splash" 
			component={Splash} 
			options={{ headerShown: false }} />
	)
	//screen is not loading but user data cache are available
	if( !isLoading && userData != null  ) return(
		<Stack.Screen 
			name="Home" 
			component={HomeStack} 
			options={{ headerShown: false }} />
	)
	//Screen not loading but userdata cache not found
	if( !isLoading && !userData ) return(
		<Stack.Screen 
			name="Auth" 
			component={AuthStack} 
			options={{ headerShown: false, animationTypeForReplace: isSignout ? 'pop' : 'push', }} />
	)
				
}
export default function MainStack() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{renderRoot()}
			</Stack.Navigator>
		</NavigationContainer>
	);
}


