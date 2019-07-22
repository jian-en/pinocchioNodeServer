/*
responseMsg.js

Handles all responses going out of the nodeserver.
*/

// 200 response returns success: true and other params
module.exports.success = function(params) {
  if ('success' in params) return params;
  const response = {success: true};
  if (params.length != 0) {
    return Object.assign({}, response, params);
  }
  return response;
};

// handles validation errors
module.exports.validationError422 = function(params) {
  for (let i = 0; i < params.length; i++) {
    if (('msg' in params[i]) && ('param' in params[i])) {
      params[i]['msg'] = 'The ' + params[i]['param'] + ' has incorrect format.';
    }
  }
  const response = {
    success: false,
    errors: params,
  };
  return response;
};

// handles 422 errors
module.exports.error = function(param, msg) {
  const response = {
    success: false,
    errors: [{
      'msg': msg,
      'param': param,
    }],
  };
  return response;
};
