import { 
    clear as clearStorage,
    firebaseSignOut, 
    firebaseSignInEmailPass,
    firebaseRegisterUser,
    firebaseGetCurrentUser,
    fireUpdateUserProfile,
    createUser
} from 'modules';

function signInService( user, signInContext ){

    firebaseSignInEmailPass( user, onSuccess, onFailed );
   
    function onSuccess( {user} ){    

        const data ={
            token:user.uid,
            userData:{
                id:user.uid,
                name: user.displayName,
                email: user.email,
                profileImage: user.photoURL,
            },
        }
        
        signInContext( data );
        
    }
    
    function onFailed( err ){
        alert( err );
    }
    
}

function signOutService( signOutContext ){

    firebaseSignOut( onSuccess, onFailed );

    function onSuccess(){
        signOutContext();
        clearStorage();
    }    
    
    function onFailed(err){
        alert( err );
    }

}

function registerUserService( data, signUpContext ){

    firebaseRegisterUser( data , onSuccess, onFailed );

    function onSuccess(){

        const curr = firebaseGetCurrentUser();
        const data = {
            token:curr.uid,
            userData:{
                id:curr.uid,
                name: curr.displayName,
                email: curr.email,
                profileImage: curr.photoURL,
            },
        }   

        signUpContext( data );

        createUser( curr.uid, curr.email, curr.displayName, curr.photoURL );

    }

    function onFailed( err ){
        console.log( err );
    }
}

function updateUserProfile( data ){
    fireUpdateUserProfile( data ,onSuccess, onFailed );

    function onSuccess(){
        console.log( 'success updating user data');
    }

    function onFailed( err ){
        console.log( err );
    }
}

function currentUserOnService(){
    firebaseGetCurrentUser();
}

export { 
    signInService,
    signOutService,
    registerUserService,
    currentUserOnService,
    updateUserProfile,
}