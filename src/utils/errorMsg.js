// parameters
const EMAIL = 'email';
const PASSWORD = 'password';
const FIRSTNAME = 'firstname';
const LASTNAME = 'lastname';
const PHONE = 'phone';
const TOKEN = 'token';
const NAME = 'name';
const ATTENDEES = 'attendees';
const TYPE = 'type';
const ADDRESS = 'address';
const CITY = 'city';
const ZIPCODE = 'zipcode';
const STATE = 'state';
const PROMOTIONURL = 'promotionUrl';

// error messages
const EMAIL_REGISTERED = 'The email provided is already registered.';
const EMAIL_NOT_REGISTERED = 'The email provided is not registered.';
const EMAIL_NOT_VERIFIED = 'The email provided is not verified.';
const EMAIL_INVALID = 'The email provided is invalid.';
const TOKEN_INVALID = 'The provided token is invalid.';
const TOKEN_EXPIRED = 'The provided token is expired.';
const TOKEN_SERVER_ERROR = 'A server error has occurred when generating the token';
const PASSWORD_INCORRECT = 'The provided password is incorrect';
const ACCOUNT_VERIFIED = 'The account has already been verified';
const ATTENDEE_COUNT_INVALID = 'The number of attendees provided is invalid';

// export params and error messages
exports.EMAIL = EMAIL;
exports.PASSWORD = PASSWORD;
exports.FIRSTNAME = FIRSTNAME;
exports.LASTNAME = LASTNAME;
exports.PHONE = PHONE;
exports.TOKEN = TOKEN;
exports.NAME = NAME;
exports.ATTENDEES = ATTENDEES;
exports.TYPE = TYPE;
exports.ADDRESS = ADDRESS;
exports.CITY = CITY;
exports.ZIPCODE = ZIPCODE;
exports.STATE = STATE;
exports.PROMOTIONURL = PROMOTIONURL;

exports.EMAIL_REGISTERED = EMAIL_REGISTERED;
exports.EMAIL_NOT_REGISTERED = EMAIL_NOT_REGISTERED;
exports.EMAIL_NOT_VERIFIED = EMAIL_NOT_VERIFIED;
exports.EMAIL_INVALID = EMAIL_INVALID;
exports.TOKEN_INVALID = TOKEN_INVALID;
exports.TOKEN_EXPIRED = TOKEN_EXPIRED;
exports.PASSWORD_INCORRECT = PASSWORD_INCORRECT;
exports.ACCOUNT_VERIFIED = ACCOUNT_VERIFIED;
exports.TOKEN_SERVER_ERROR = TOKEN_SERVER_ERROR;
exports.ATTENDEE_COUNT_INVALID = ATTENDEE_COUNT_INVALID;