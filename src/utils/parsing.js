import moment from "moment";


const parseTimeStamp = {
    toLocale: stamp  =>{
        var date = new Date( stamp ); 

        return moment().calendar(date).toString();

    }
}

export {
    parseTimeStamp,
}