// constants
exports.constants = {
  REFERRAL_LENGTH: 6,
  COUNTRY_CODE: 'us',
  // radius is in km from center
  RADIUS: 0.3,
  STATES: {
    'al': 'Alabama',
    'ak': 'Alaska',
    'as': 'American Samoa',
    'az': 'Arizona',
    'ar': 'Arkansas',
    'ca': 'California',
    'co': 'Colorado',
    'ct': 'Connecticut',
    'de': 'Delaware',
    'dc': 'District Of Columbia',
    'fm': 'Federated States Of Micronesia',
    'fl': 'Florida',
    'ga': 'Georgia',
    'gu': 'Guam',
    'hi': 'Hawaii',
    'id': 'Idaho',
    'il': 'Illinois',
    'in': 'Indiana',
    'ia': 'Iowa',
    'ks': 'Kansas',
    'ky': 'Kentucky',
    'la': 'Louisiana',
    'me': 'Maine',
    'mh': 'Marshall Islands',
    'md': 'Maryland',
    'ma': 'Massachusetts',
    'mi': 'Michigan',
    'mn': 'Minnesota',
    'ms': 'Mississippi',
    'mo': 'Missouri',
    'mt': 'Montana',
    'ne': 'Nebraska',
    'nv': 'Nevada',
    'nh': 'New Hampshire',
    'nj': 'New Jersey',
    'nm': 'New Mexico',
    'ny': 'New York',
    'nc': 'North Carolina',
    'nd': 'North Dakota',
    'mp': 'Northern Mariana Islands',
    'oh': 'Ohio',
    'ok': 'Oklahoma',
    'or': 'Oregon',
    'pw': 'Palau',
    'pa': 'Pennsylvania',
    'pr': 'Puerto Rico',
    'ri': 'Rhode Island',
    'sc': 'South Carolina',
    'sd': 'South Dakota',
    'tn': 'Tennessee',
    'tx': 'Texas',
    'ut': 'Utah',
    'vt': 'Vermont',
    'vi': 'Virgin Islands',
    'va': 'Virginia',
    'wa': 'Washington',
    'wv': 'West Virginia',
    'wi': 'Wisconsin',
    'wy': 'Wyoming',
  },
};

exports.eventStatuses = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

exports.eventMessage = {
  'pending': `Your event is currently being reviewed. Pinocchio will review your event and notify\
  you within 24 hours.`,
  'approved': `Your event has been approved! Please login to Pinocchio and select your event for\
  next steps.`,
  'rejected': `Your event has been rejected. Please login to Pinocchio and select your event for\
  more details.`,
};

exports.transcriptionStatuses = {
  IN_PROGRESS: 'IN_PROGRESS',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
};
