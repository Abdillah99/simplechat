import {
	clearAllData,
	myFirebase
} from 'modules';

function getCurrentUser(){
	return myFirebase.getCurrentUser();
}

function signInService(data, signInContext) {

	myFirebase.signIn(data)
			  .then( res => {
				  
			const data = {
				userData: {
					id: res.user.uid,
					name: res.user.displayName,
					email: res.user.email,
					profileImage: res.user.photoURL,
				},
			}
			signInContext(data);
		}).catch(err => {
			alert(err);
		})


}

function signOutService(signOutContext) {

	myFirebase.signOut()
		.then(() => {
			signOutContext();
			clearAllData();
		}).catch(err => {
			alert(err)
		})

}

async function registerUserService(data, signUpContext) {
	
	const user = await myFirebase.registerUser(data);

	console.log('res from firebase register ', user)
	const contextData = {
		userData: {
			id: user.id,
			name: user.name,
			email: user.email,
			profileImage: null,
		},
	}
	signUpContext(contextData);
	

}

function updateUserProfile(data) {

	var tmp2 = {
		avatar: data
	}

	myFirebase.updateBio(tmp2)
		.catch(err => {
			alert(err);
		})

	const tmp = {
		photoURL: data,
	}
	myFirebase.updateProfile(tmp)
		.catch(err => {
			alert(err);
		});
}

function getUserImage( id ){
	return myFirebase.getUserProfileImage( id )
					 .then(res => res.val())
}

export {
	signInService,
	signOutService,
	registerUserService,
	updateUserProfile,
	getCurrentUser,
	getUserImage,
}