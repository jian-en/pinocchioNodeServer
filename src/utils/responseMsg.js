/*
responseMsg.js

Handles all responses going out of the nodeserver.
*/

// 200 response returns success: true and other params
module.exports.success = function(params) {
    if('success' in params) return params;
    var response = {success: true};
    if(params.length != 0){
        return Object.assign({}, response, params);
    }
    return response;
};

//handles validation errors
module.exports.validationError422 = function(params) {
    var response = {
        success: false,
        errors: params
    };
    return response;
}

// handles 422 errors 
module.exports.error = function(param, msg) {
    var response = {
        success: false,
        errors: [{
            'msg': msg,
            'param': param
        }]
    };
    return response;
}