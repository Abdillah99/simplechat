import storage from '@react-native-firebase/storage';

async function uploadImage( folder, filename, data, ) {
  
  return new Promise((resolve,reject) =>{
    const reference = storage().ref().child( folder ).child(filename);   
    const uploadTask = reference.putFile(data);
    
    uploadTask.on('state_changed', (snapshot) => {
        
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        console.log('Upload is ' + progress + '% done');
        
        switch (snapshot.state) {
            case storage.TaskState.PAUSED: 
                console.log('Upload is paused');
                break;
            case storage.TaskState.RUNNING: 
                console.log('Upload is running');
                break;
        }

    });

    uploadTask.then( () =>{

        uploadTask.snapshot
                  .ref
                  .getDownloadURL()
                  .then( downloadURL => {
                    resolve(downloadURL);
                  });

    }).catch( err =>{

        reject( err );

    })
  })
    

} 

async function downloadImge( folder, filename ){
  const reference = storage().ref().child( folder ).child(filename);  
  
  return reference.getDownloadURL();
}

export { uploadImage };