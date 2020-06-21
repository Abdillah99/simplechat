import {AsyncStorage} from 'react-native';

const keys = {
    'USER_TOKEN'    : 'token',
    'USERDATA'      : 'uData',
};
  
/// GET Item from asyncStorage return parsed JSON object 
const get = (storageKey) => AsyncStorage.getItem( storageKey ).then( res => res ? JSON.parse(res) : null );

//SET item to asyncstorage must be parsed to string
const set = (storageKey, data) => AsyncStorage.setItem(storageKey, JSON.stringify(data));

const addList = async ( newList ) => {

    const localList = await get(keys.LIST);

    //Auto Increment ID , get last item id + 1 
    const newId = localList.length > 0 ?  localList[localList.length-1].id + 1 : 0;

    const newData  = Object.assign({id:newId}, newList );

    const lists = [...localList, newData];
    
    return set(keys.LIST, lists);

};

//Get only 1 list, return promise
export const getListById = async ( id ) =>
{
    const localList = await get( keys.LIST );

    let list =  localList.find( item => item.id == id);

    return list;
}

export const updateListById = async( id, data ) =>
{
    const localList = await get( keys.LIST );
    
    const newData = localList.map( item => {

        if( item.id == id)
        {
            item.title = data.title;
            item.tags = data.tags;
            item.completed = data.completed;
            item.task = data.task;
            item.list = data.list;

        }

        return item;

    });

    console.log( 'updated list ' + JSON.stringify( newData ));
    
    return set(keys.LIST, newData );
}

export const deleteList = async( id ) => {

    const localList = await get(keys.LIST);

    const newList = localList.filter(item => item.id != id );

    return set(keys.LIST, newList);

}


const clear = AsyncStorage.clear;

export { keys, get, set ,clear } 
