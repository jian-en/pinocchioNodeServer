/**
 * geocoder.js
 * handles all geocoder functions to get GPS coordinates.
 */

const nodeGeocoder = require('node-geocoder');
const {geocoder} = require('../../config.js');
const {constants} = require('./constants');

// create geocoder instance
const geo = nodeGeocoder(geocoder);

module.exports.getGPS = async (address) => {
  let error = [];
  const data = await geo.geocode(address)
      .catch(function(err) {
        error = err;
      });
  if (error.length == 0) {
    return {success: true, data: data};
  }
  return {success: false, msg: error};
};

// this takes in user GPS and event GPS to check if they
// are within a specified radius (in km)
// returns boolean
module.exports.atLocation = (userLat, userLong, eventLat, eventLong) => {
  // km per degree latitude
  const ky = 40000 / 360;

  // km per degree longitude
  const kx = Math.cos(Math.PI * eventLat / 180.0) * ky;

  // Pythagoran theorem to get radius distance
  // this treats the world as flat
  const dx = Math.abs(eventLong - userLong) * kx;
  const dy = Math.abs(eventLat - userLat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= constants.RADIUS;
};
