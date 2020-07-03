import React, { createContext, useReducer, useMemo, useContext } from 'react';

const SettingsActionContext = createContext();
const SettingsStateContext  = createContext();

const initialState = {
	darkMode: true, 
	firstTime: true,
	isLoading: true,
}; 

const key ={
    INIT_FETCH      : 'INITIAL_FETCH',
    TOGGLE_DARKMODE : 'TOGGLE_DARKMODE', 
    RESTORE_DATA    : 'RESTORE_DATA',
}

function settingsReducer( state, action ) {

	switch (action.type) {

        case key.INIT_FETCH :
            return{
                ...state,
                isLoading:false,
                firstTime:false,
                chatData: action.data,
            };
        
        case key.TOGGLE_DARKMODE : 
            return{
                ...state,
                isLoading:false,
                darkMode: !state.darkMode,
            };

        case key.RESTORE_DATA :
            return{
                ...state,
                isLoading:false,
                chatData: action.data,
            }
	
		default:
			throw new Error('dispatch action not found : ' + action.type);

		}

};



function SettingsProvider(props) {

	const [state, dispatch] = useReducer(settingsReducer, initialState);

	const settingAction = useMemo( 
        () => ({
            initFetch: async data =>{

                dispatch({ type: key.INIT_FETCH , data: data });
            },

            toggleDarkMode: () => dispatch({ type: key.TOGGLE_DARKMODE }),
            
            restoreData: data => dispatch({ type: key.RESTORE_DATA, data:data }),

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