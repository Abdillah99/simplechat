import firebase from 'firebase';

class FirebaseSDK {

    constructor() {
        if (!firebase.apps.length) {

            firebase.initializeApp({
                apiKey: "AIzaSyCzRXxIR8u-tKBKc2PZHzX7Gepm8z9lroY",
                authDomain: "lithe-sunset-235110.firebaseapp.com",
                databaseURL: "https://lithe-sunset-235110.firebaseio.com",
                projectId: "lithe-sunset-235110",
                storageBucket: "lithe-sunset-235110.appspot.com",
                messagingSenderId: "521859984470",
                appId: "1:521859984470:web:0295c465b81b1a7cbfdff7"
            });
        }
    }

    get ref(){
        return firebase.database().ref('messages/-M7kuB3QzmK7QIAF38sY');
    }
	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
    }
    
    get uid(){
        return( firebase.auth().currentUser ).uid;
    }                
    
    get userData(){
        return (firebase.auth().currentUser);
    }
    
    parse = snapshot =>{

        const { createdAt, text, user } = snapshot.val();
        const { key: id } = snapshot;
        const { key:_id } = snapshot;

        const message = {id,_id, createdAt, text, user };
        return message;
    };

    login = async (user, success_callback, failed_callback) => {
        await firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(success_callback, failed_callback);
    };

    logout = user =>{
        firebase.auth()
                .signOut()
    }

    register = async (data, success_callback, failed_callback) => {

        await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then( result =>{
                result.user.updateProfile({
                    displayName: data.name
                })
            })
            .then(success_callback, failed_callback);
    }

    refOn = callback =>{
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    sendMessage = messages => {
        for( let i = 0 ; i < messages.length ; i++)
        {
            const { text, user } = messages[i];
            const message = { text , user , createdAt: this.timestamp };
            this.ref.push(message);
        }
    }

    refOff() {
        this.ref.off();
    }
}

const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
