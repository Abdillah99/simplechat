import AsyncStorage from '@react-native-community/async-storage';
  
const readData = async(storageKey) =>{
    try{
        const jsonVal = await AsyncStorage.getItem( storageKey );
        return jsonVal != null ? JSON.parse( jsonVal ) :null;
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

export { storeData, readData, mergeData , clearAllData } 
