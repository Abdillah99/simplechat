import auth from '@react-native-firebase/auth';

async function firebaseRegisterUser(data,  success_callback, failed_callback ){
   await auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then( result =>{
                result.user.updateProfile({
                    displayName: data.name
                })
                .then( success_callback, failed_callback)
        })
}


function firebaseSignInEmailPass( user , success_callback, failed_callback ){
    auth()
        .signInWithEmailAndPassword(user.email, user.password )
        .then( success_callback, failed_callback );
}

function firebaseSignOut( success_callback, failed_callback ){
    auth()
        .signOut()
        .then(success_callback, failed_callback);

}


function firebaseGetCurrentUser(){
    return (auth().currentUser);
}

export{ firebaseSignInEmailPass, firebaseSignOut, firebaseRegisterUser, firebaseGetCurrentUser }