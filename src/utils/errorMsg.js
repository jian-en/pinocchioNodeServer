// parameters
exports.params = {
  EMAIL: 'email',
  PASSWORD: 'password',
  FIRSTNAME: 'firstname',
  LASTNAME: 'lastname',
  PHONE: 'phone',
  TOKEN: 'token',
  NAME: 'name',
  ATTENDEES: 'attendees',
  TYPE: 'type',
  ADDRESS: 'address',
  CITY: 'city',
  ZIPCODE: 'zipcode',
  STATE: 'state',
  PROMOTIONURL: 'promotionUrl',
  PUBLICKEY: 'publicKey',
};

// error messages
exports.messages = {
  EMAIL_REGISTERED: 'The email provided is already registered.',
  EMAIL_NOT_REGISTERED: 'The email provided is not registered.',
  EMAIL_NOT_VERIFIED: 'The email provided is not verified.',
  EMAIL_INVALID: 'The email provided is invalid.',
  EMAIL_INVALID_DOMAIN: 'The email provided is not a recognized trusted domain.',
  TOKEN_INVALID: 'The provided token is invalid.',
  TOKEN_EXPIRED: 'The provided token is expired.',
  TOKEN_SERVER_ERROR: 'A server error has occurred when generating the token',
  PASSWORD_INCORRECT: 'The provided password is incorrect',
  ACCOUNT_VERIFIED: 'The account has already been verified',
  ATTENDEE_COUNT_INVALID: 'The number of attendees provided is invalid',
  PUBLICKEY_REGISTERED: 'The publicKey provided is already registered.',
};
