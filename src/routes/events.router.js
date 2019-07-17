/*
/api/events routes; This will handle all event related api calls.
*/

module.exports = (app) => {
    const events = require('../controllers/events.controller.js');

    /**
     * @swagger
     * /api/events:
     *  post:
     *      tags:
     *          - Events
     *      name: Create
     *      summary: Creates a new event
     *      security:
     *          - token: []
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: name
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: attendees
     *            type: integer
     *            in: formData
     *          - name: type
     *            type: string
     *            in: formData
     *          - name: address
     *            type: string
     *            minLength: 5
     *            in: formData
     *          - name: city
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: zipcode
     *            type: integer
     *            in: formData
     *          - name: state
     *            type: string
     *            minLength: 2
     *            in: formData
     *          - name: promotionUrl
     *            type: string
     *            in: formData
     *      responses:
     *          '200':
     *              description: event sucessfully created
     *          '401':
     *              description: unauthorized, token is invalid or not provided
     *          '422':
     *              description: invalid or missing body elements
     *        
     */

    app.post('/api/events', events.validate('create'), events.create);

    /**
     * @swagger
     * /api/events:
     *  get:
     *      tags:
     *          - Events
     *      name: Get events
     *      summary: Gets all events from userId
     *      security:
     *          - token: []
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      responses:
     *          '200':
     *              description: get all events available to user token
     *          '401':
     *              description: unauthorized, token is invalid or not provided
     *        
     */

    app.get('/api/events', events.validate('auth'), events.findAll);
}
