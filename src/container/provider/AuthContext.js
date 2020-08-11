import React, { createContext, useReducer, useMemo, useContext ,useEffect, useRef} from 'react';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext();
const AuthStateContext = createContext();

const initialState = {
	isSignout: true,
	isLoading: true,
	userData: null,
	isFirstTime:false,
};

function authReducer(state, action) {
	console.log('reducer run ', action.type);
	switch (action.type) {
		case 'RESTORE_TOKEN':
			return {
				...state,
				isLoading: false,
				isSignout: false,
				isFirstTime:false,
				userData: action.userData,
			};
		case 'SIGN_IN':
			return {
				...state,
				isSignout: false,
				userData: action.userData,
				isFirstTime:true,
			};
		case 'SIGN_OUT':
			return {
				...state,
				isSignout: true,
				userData:null,
				isLoading:false,
				isFirstTime:false,
			};
		case 'UPDATE_PROFILE':
			return {
				...state,
				isFirstTime:false,
				userData: {
					...state.userData,
					...action.userData,
				}
			}
		default:
			throw new Error('dispatch action not found : ' + action.type);
	}
};



function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState);
	const authValue = useMemo(() => ({
		signIn:  data => {
			dispatch({type:'SIGN_IN', userData: data.userData });
		},
		signOut: () => dispatch({type: 'SIGN_OUT'}),
		signUp: data => {
			dispatch({type: 'SIGN_IN',  userData: data.userData});
		},
		updateProfile: data => dispatch({ type: 'UPDATE_PROFILE', userData: data }),
		restoreToken: data => {
			dispatch({ type: 'RESTORE_TOKEN', userData: data.userData });
		}

	}),
	)
	const authStateChanged =( user )=>{
		if(user){
			const data={
				userData:{
					id:user.uid,
					name:user.displayName,
					email:user.email,
					profileImage:user.photoURL
				}
			}
			authValue.restoreToken( data )
		}else{
			authValue.signOut();
		}
	}

	useEffect(() => {
		//componentdid mount
		const currUser = auth().currentUser;
		 if( currUser !== null ) {
			const data={
				userData:{
					id:currUser.uid,
					name:currUser.displayName,
					email:currUser.email,
					profileImage:currUser.photoURL
				}
			}
			authValue.restoreToken(data);
		}else if( currUser === null && state.isSignout ){
			authValue.signOut();
		}
		
		//component unmount
	

	},[]);


	return (
		<AuthStateContext.Provider value={state}>
			<AuthContext.Provider value={authValue}>
				{props.children}
			</AuthContext.Provider>
		</AuthStateContext.Provider>
	)
}


function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error(' useAuthContext must be used within auth provider')
	}
	return context
}

function useAuthState() {
	const context = useContext(AuthStateContext);
	if (context === undefined) {
		throw new Error('useAuthState must be used within authState provider')
	}
	return context
}


export { AuthProvider, useAuthContext, useAuthState }