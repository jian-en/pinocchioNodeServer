const moment = require('moment');
const FORMAT = 'YYYY-MM-DD HH:mm:ss';

module.exports.getDatetimeString = (datetimeObj) => {
  if (!datetimeObj) datetimeObj = new Date;
  return moment(datetimeObj).format(FORMAT);
};

module.exports.getUnixTimestamp = (datetimeObj) => {
  if (!datetimeObj) datetimeObj = new Date;
  return moment(datetimeObj).unix();
};

module.exports.inTime = (unixtime, diffObj) => {
  const m = moment.unix(unixtime);
  return m.add(diffObj) > moment();
};
