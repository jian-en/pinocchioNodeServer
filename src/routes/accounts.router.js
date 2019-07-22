/*
/api/accounts routes; This will handle all account related api calls.
*/

module.exports = (app) => {
  const accounts = require('../controllers/accounts.controller.js');

  /**
     * @swagger
     * /api/accounts/register:
     *  post:
     *      tags:
     *          - Accounts
     *      name: Register
     *      summary: Registers a new account
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: firstname
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: lastname
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: email
     *            type: string
     *            format: email
     *            in: formData
     *          - name: password
     *            type: string
     *            minLength: 8
     *            format: password
     *            in: formData
     *          - name: phone
     *            type: string
     *            minLength: 10
     *            maxLength: 10
     *            in: formData
     *          - name: referral
     *            type: string
     *            in: formData
     *          - name: publicKey
     *            type: string
     *            in: formData
     *      responses:
     *          '200':
     *              description: account sucessfully created
     *          '422':
     *              description: invalid or missing body elements
     *          '500':
     *              description: user already exists
     *
     */
  app.post('/api/accounts/register', accounts.validate('register'), accounts.register);

  /**
     * @swagger
     * /api/accounts/activateAccount:
     *  post:
     *      tags:
     *          - Accounts
     *      name: Activate
     *      summary: Activates a new account
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: token
     *            type: string
     *            in: formData
     *      responses:
     *          '200':
     *              description: account sucessfully verified
     *          '422':
     *              description: invalid token/email; token expired; account already verified
     *          '500':
     *              description: error with database communication
     *
     */
  app.post('/api/accounts/activateAccount', accounts.activate);

  /**
     * @swagger
     * /api/accounts/login:
     *  post:
     *      tags:
     *          - Accounts
     *      name: Login
     *      summary: Organizer login
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: email
     *            type: string
     *            format: email
     *            in: formData
     *          - name: password
     *            type: string
     *            minLength: 8
     *            format: password
     *            in: formData
     *      responses:
     *          '200':
     *              description: account successfully logged in
     *          '422':
     *              description: invalid body elements or unverified account
     *          '500':
     *              description: error generating session token
     *
     */
  app.post('/api/accounts/login', accounts.validate('login'), accounts.login);

  /**
     * @swagger
     * /api/accounts/getUser:
     *  post:
     *      tags:
     *          - Accounts
     *      name: user details
     *      summary: get user details based on token
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: token
     *            type: string
     *            minLength: 1
     *            in: formData
     *      responses:
     *          '200':
     *              description: valid token; returns userId/email
     *          '422':
     *              description: invalid token
     *
     */
  app.post('/api/accounts/getUser', accounts.getUser);
};
