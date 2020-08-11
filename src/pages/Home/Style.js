import { StyleSheet,Dimensions } from 'react-native'
const { width } = Dimensions.get('screen');
const paddingSize = width / 23.4375;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    chatCard: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 80,
    },

    leftContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    centerContainer: {
        flex: 3.5,
        justifyContent: 'center',
    },
    labelTitle: {
        fontSize: 18,
        fontFamily: 'SFUIText-Regular',
        margin: 0,
        padding: 0,
    },
    msgLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    msgLabel: {
        maxWidth: '68%',
        color: 'gray',
        fontSize: 12,
        fontFamily: 'SFUIText-Light',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    msgTimeLabel: {
        flex: 1,
        fontSize: 10,
        color: 'gray',
        fontFamily: 'SFUIText-Light',
        textAlign: 'left',
        margin: 0,
        padding: 0,
    },
    rightContainer: {
        flex: 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationCircle: {
        width: 10,
        height: 10,
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 12,
    },
    hoverButtonContainer: {
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
        bottom: 10,
        right: 20,
        elevation: 3
    }
});