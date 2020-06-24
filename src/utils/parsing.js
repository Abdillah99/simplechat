import moment from "moment";

const parseTimeStamp = {
    toLocale: stamp => {
        var date = new Date(stamp);

        return moment(date).calendar(null, {
            sameDay: 'hh.mm',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: ( now ) =>{
                if( moment( now ).diff( moment() , 'weeks') < 7 ){
                    return 'ddd';
                } else if( moment( now ).diff( moment(), 'years') >= 1 ){
                    return 'dd/mm/yy';
                } else if( moment( now ).diff( moment(), 'months') >= 1  ){
                    return 'd mmm'
                }
               
                
            }
        }).toString();

    }
}

export {
    parseTimeStamp,
}