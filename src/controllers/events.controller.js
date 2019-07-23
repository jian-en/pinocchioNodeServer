/*
controller for events
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');

// validators
const {check, validationResult} = require('express-validator');
// jwt
const auth = require('../utils/auth.js');
// geocoder
const geo = require('../utils/geocoder.js');

const responseMsg = require('../utils/responseMsg');
const errorMsg = require('../utils/errorMsg');
const {constants} = require('../utils/constants');

// validate POST body contents
exports.validate = (method) => {
  switch (method) {
    case 'create': {
      return [
        auth.checkAuth,
        check('name').trim().isLength({min: 1}),
        check('attendees').isInt(),
        check('type').trim().isIn(['lecture', 'speech', 'conference']),
        check('address').trim().isLength({min: 5}),
        check('city').trim().isLength({min: 1}),
        check('zipcode').trim().isInt(),
        check('state').trim().isLength({min: 2}),
        check('promotionUrl').trim().isURL(),
      ];
    }
    case 'auth': {
      return auth.checkAuth;
    }
    case 'verifyLocation': {
      return [
        check('eventsId').trim().isLength({min: 1}),
        check('latitude').trim().isLength({min: 1}),
        check('longitude').trim().isLength({min: 1}),
      ];
    }
    case 'get': {
      // TODO: check whether it's attendable
      return [
        check('eventsId').trim().isLength({min: 1}),
      ];
    }
  }
};

// get all events based on current userId
exports.findAll = async (req, res, next) => {
  const result = await dynamoDb.getEventsOrganizer(req.usersId);
  res.json(result);
};

// create an event
exports.create = async (req, res, next) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }

  // check for attendee count
  const attendees = parseInt(req.body.attendees);
  if (!attendees || attendees < 10 || attendees > 100000) {
    res.status(422).json(responseMsg.error(errorMsg.params.ATTENDEES,
        errorMsg.messages.ATTENDEE_COUNT_INVALID));
  }

  const item = {
    ...req.body,
    attendees,
    eventsId: dynamoDb.generateID(),
    date: req.body.date,
    organizerId: req.usersId,
    status: 'pending', // TODO: constanize
  };

  // build address
  const gpsResults = await geo.getGPS(req.body.address);
  if (!gpsResults.success) {
    // error has occurred in getting geocoder GPS
    return res.status(500).json(gpsResults);
  }
  const locations = gpsResults.data;
  if (locations.length == 0) {
    return res.status(422).json(responseMsg.error(errorMsg.params.ADDRESS,
        errorMsg.messages.ADDRESS_NOT_FOUND));
  }
  // iterate through possible locations
  for (let i = 0; i < locations.length; i++) {
    const requestCity = req.body.city.toLowerCase();
    const requestZipcode = req.body.zipcode;
    const locationCity = locations[i].city.toLowerCase();
    const locationZipcode = locations[i].zipcode;
    const locationCountryCode = locations[i].countryCode.toLowerCase();

    // check if location matches what was given
    // add to database items
    if ((constants.COUNTRY_CODE == locationCountryCode) &&
        (requestCity == locationCity) &&
        (requestZipcode == locationZipcode)) {
      item['latitude'] = locations[i].latitude;
      item['longitude'] = locations[i].longitude;
      break;
    }
  }

  // location not found
  if (!('latitude' in item) || !('longitude' in item)) {
    return res.status(422).json(responseMsg.error(errorMsg.params.ADDRESS,
        errorMsg.messages.ADDRESS_NOT_FOUND));
  }

  const result = await dynamoDb.putData('eventsTable', item);
  if (!result.success) return res.json(result);
  res.json(responseMsg.success({}));
};

// verify if attendee is at the event
exports.verifyLocation = async (req, res, next) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }

  const {eventsId} = req.body;
  const latitude = parseFloat(req.body.latitude);
  const longitude = parseFloat(req.body.longitude);

  // check if event exists
  const eventExists = await dynamoDb.getEvents(eventsId);
  if (!eventExists.success) {
    return res.status(500).json(eventExists);
  } else if (eventExists.data.length > 0) {
    // event exists
    const eventLat = parseFloat(eventExists.data[0].latitude);
    const eventLong = parseFloat(eventExists.data[0].longitude);
    if (geo.atLocation(latitude, longitude, eventLat, eventLong)) {
      return res.json(responseMsg.success({}));
    }
    // user is too far away from event
    return res.status(422).json(responseMsg.error(errorMsg.params.LATITUDE,
        errorMsg.messages.EVENT_NOT_AT_LOCATION));
  } else {
    // event doesnt exist
    return res.status(422).json(responseMsg.error(errorMsg.params.EVENTID,
        errorMsg.messages.EVENT_NOT_FOUND));
  }
};

exports.get = async (req, res) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }
  const {eventsId} = req.body;
  const eventExists = await dynamoDb.getEvents(eventsId);
  if (!eventExists.success) {
    return res.status(500).json(eventExists);
  } else if (eventExists.data.length > 0) {
    const event = eventExists.data[0];
    const ret = {id: event.eventsId, name: event.name, status: event.status};
    return res.json(responseMsg.success({event: ret}));
  } else {
    // event doesnt exist
    return res.status(422).json(responseMsg.error(errorMsg.params.EVENTID,
        errorMsg.messages.EVENT_NOT_FOUND));
  }
};
