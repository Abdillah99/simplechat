import {readData, storeData, clearAllData } from 'modules';

const KEYS ={
    
}


const cacheMessages = ( data ) =>{
    var key = data.key;
    var value = data.val;
    
    storeData(  )
        .then( () =>{
            return true;
        }).catch( err =>{
            throw err;
            return false;
        })

}