import React, { createContext, useReducer, useMemo, useContext } from 'react';

const SettingsActionContext = createContext();
const SettingsStateContext  = createContext();

const initialState = {
	darkMode: true, 
	firstTime: true,
	isLoading: true,
}; 

const key ={
    TOGGLE_DARKMODE : 'TOGGLE_DARKMODE', 
}

function settingsReducer( state, action ) {

	switch (action.type) {
        
        case key.TOGGLE_DARKMODE : 
            return{
                ...state,
                isLoading:false,
                darkMode: !state.darkMode,
            };
	
		default:
			throw new Error('dispatch action not found : ' + action.type);

		}

};



function SettingsProvider(props) {

	const [state, dispatch] = useReducer(settingsReducer, initialState);

	const settingAction = useMemo( 
        () => ({

            toggleDarkMode: () => dispatch({ type: key.TOGGLE_DARKMODE }),

		}),
	)

	return (
		<SettingsActionContext.Provider value={settingAction}>
			
			<SettingsStateContext.Provider value={state}>
				
				{props.children}

			</SettingsStateContext.Provider>

		</SettingsActionContext.Provider>
	)
}


function useSettingsAction() {

	const context = useContext( SettingsActionContext );

	if (context === undefined) {
		throw new Error(' useAuthContext must be used within auth provider')
	}

	return context
}

function useSettingsState() {

	const context = useContext( SettingsStateContext );

	if( context === undefined ){
		throw new Error('useAuthState must be used within authState provider')
	}

	return context

}


export { SettingsProvider, useSettingsAction, useSettingsState }