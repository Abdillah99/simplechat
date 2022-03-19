import AsyncStorage from '@react-native-community/async-storage';
  
const readData = async(storageKey) =>{
    try{
        const jsonVal = await AsyncStorage.getItem( storageKey );
        return jsonVal != null ? JSON.parse( jsonVal ) :[];
    }catch( e ){
        console.log( e );
    }
} 

const storeData = async(storageKey, data) =>{
    try{
        const jsonVal = JSON.stringify( data );
        await AsyncStorage.setItem( storageKey, jsonVal );
    } catch (e){
        console.log( e );
    }
    
}

const multiStore = async( data ) =>{
    try{
        await AsyncStorage.multiSet( data );
    }catch(e){
        throw e;
    }
}

const updateData = async( key, data ) =>{
    try{
        var localData = await readData( key );    
        localData.push( data );
        await storeData( key, localData );
    }catch(e){
        throw e
    }
}

const mergeData = async( key , data ) =>{
    try{
        const jsonVal = JSON.stringify(data);
        await AsyncStorage.mergeItem( key, jsonVal );
    }catch( e ){
        console.log( e );
    }
}

const clearAllData = async() =>{
    try{
        await AsyncStorage.clear();
    }catch( e ){
        console.log( e );
    } 
} 

export { storeData, readData, mergeData , clearAllData,multiStore,updateData } 
