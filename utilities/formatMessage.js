const moment = require('moment');

function formatMessage(username, message){
    return{
        username,
        message,
        time: moment().format('D/DD/YY LT')
    }
}

module.exports = formatMessage;