const action ={
    sign_in : 'SIGN_IN',
    Sign_out: 'SIGN_OUT',
    restore_token: 'RESTORE_TOKEN',
};

const initialState = {
	isSignout: true,
	userToken: null,
	isLoading:false,
};

const authReducer = (prevState,action) => {
	switch (action.type) {
		case 'RESTORE_TOKEN':
			return {
				...prevState,
				userToken: action.token,
				isLoading: false,
				isSignout:false
			};

		case 'SIGN_IN':
			return {
				...prevState,
				isSignout: false,
				userToken: action.token,
			};

		case 'SIGN_OUT':
			return {
				...prevState,
				isSignout: true,
				userToken: null,
			};
	}
};

export { authReducer }
