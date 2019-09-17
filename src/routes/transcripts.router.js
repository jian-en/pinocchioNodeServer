/*
/api/transcripts routes; This will handle all transcripts related api calls.
*/

module.exports = (app) => {
  const transcripts = require('../controllers/transcripts.controller.js');

  /**
     * @swagger
     * /api/transcripts/update:
     *  get:
     *      tags:
     *          - Transcripts
     *      name: update transcript status
     *      summary: Update status for pending transcriptions
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      responses:
     *          '200':
     *              description: transcripts updated
     *          '500':
     *              description: internal server error
     *
     */

  app.get('/api/transcripts/update', transcripts.update);
};
