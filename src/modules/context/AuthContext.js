import React, { createContext, useReducer, useMemo, useContext } from 'react';

const AuthContext = createContext();
const AuthStateContext = createContext();

const initialState = {
	isSignout: true,
	userToken: null,
	isLoading: true,
	userData: null,
};



function authReducer(state, action) {

	switch (action.type) {
		case 'RESTORE_TOKEN':
			return {
				...state,
				isLoading: false,
				userToken: action.token,
				userData: action.userData,
			};

		case 'SIGN_IN':
			return {
				...state,
				isSignout: false,
				userToken: action.token,
				userData: action.userData,
			};

		case 'SIGN_OUT':
			return {
				...state,
				isSignout: true,
				userToken: null,

			};
		default:
			throw new Error('dispatch action not found : ' + action.type);


	}

};



function AuthProvider(props) {

	const [state, dispatch] = useReducer(authReducer, initialState);

	const authValue = useMemo(
		() => ({
			signIn: async data => {
				//add validate token

				dispatch({ type: 'SIGN_IN', token: data.token, userData: data.userData });
			},

			signOut: () => dispatch({ type: 'SIGN_OUT' }),

			signUp: async data => {

				dispatch({ type: 'SIGN_IN', token: data.token, userData: data.userData });
			},

			restoreToken: async data => {

				dispatch({ type: 'RESTORE_TOKEN', token: data.token, userData: data.userData });
			}

		}),
	)

	return (
		<AuthStateContext.Provider value={state}>
			
			<AuthContext.Provider value={authValue}>
				
				{props.children}

			</AuthContext.Provider>

		</AuthStateContext.Provider>
	)
}


function useAuthContext() {
	const context = useContext( AuthContext );

	if (context === undefined) {
		throw new Error(' useAuthContext must be used within auth provider')
	}

	return context
}

function useAuthState() {

	const context = useContext( AuthStateContext );

	if( context === undefined ){
		throw new Error('useAuthState must be used within authState provider')
	}

	return context

}


export { AuthProvider, useAuthContext, useAuthState }