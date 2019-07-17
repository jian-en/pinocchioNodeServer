/*
/api/events routes; This will handle all event related api calls.
*/

module.exports = (app) => {
    const events = require('../controllers/events.controller.js');

    // create a new event
    app.post('/api/events', events.validate('create'), events.create);

    // get all events
    app.get('/api/events', events.validate('auth'), events.findAll);
}
