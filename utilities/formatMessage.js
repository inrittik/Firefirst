const moment = require("moment");

function formatMessage(username, message) {
  return {
    username,
    message,
    time: moment().format("DD/MM/YY LT"),
  };
}

module.exports = formatMessage;
