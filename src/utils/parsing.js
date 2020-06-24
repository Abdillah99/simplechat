import moment from "moment";

const parseTimeStamp = {
    toLocale: stamp => {

        return moment( stamp ).calendar(null, {
            sameDay: 'hh.mm', // sameday days -0
            lastDay: '[Yesterday]', // lastday day -1
            lastWeek: '[Last] dddd', // lastweek day -7
            sameElse: ( now ) =>{ //sameelse day > 7
                
                var diffDay = moment( now ).diff( moment(stamp) , 'days');
                var diffMonth = moment( now ).diff( moment(stamp) , 'months');
                var diffYear = moment( now ).diff( moment(stamp) , 'years');
                
                if( diffDay > 7 ){
                    console.log( 'merun');
                    return 'DD MMM';
                }
                else if( diffYear > 1 )
                {
                    return 'dd/mm/yy'
                }

                
               
                
            }
        }).toString();

    }
}

export {
    parseTimeStamp,
}