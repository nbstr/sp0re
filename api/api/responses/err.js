var util = require("util");
var errorsType = require("../../config/locales/errorsTypes.json");
var errorsStripe = require("../../config/locales/errorsStripe.json");
var ERRORS = _.extend(errorsType, errorsStripe);
var ERRORS_FIELDS = require("../../config/locales/errorsFields.json");
var TAG = "[Error Handler] ";

var SPECIAL_DB_RULES = ["in", "unique", "min_numeric", "max_numeric", "required"];

var ERROR_LANGS = ["fr", "en"];

module.exports = function badRequest(errors) {
	var req = this.req;
	var res = this.res;
	var sails = req._sails;
	var lang = req.allParams().language || req.session.lang || "en";

	if (!errors) {
		errors = "unknown_error";
		sails.log.error(TAG, "Unkownw(empty) error has been returned");
	}

	//Error from database (waterline errors)
	//It's always an array of one or mmore errors
	if (typeof(errors) === "object" && (errors.error || errors.invalidAttributes)){
		res.errors = handleDBErrors(errors, lang, sails);
	}

	//Other error type
	//It's always one error here, but we put it in array so we always return an array of errors (easier for FE)
	else {
		res.errors = [handleOtherErrors(errors, lang, sails)];
	}
	
	return res.json({
		success: false,
		errors: res.errors
	});
};

var handleDBErrors = function(errors, lang, sails){
	/*
		Example error format from db:
		{
			invalidAttributes: {
				email: [
					{rule: "required"},
					{rule: "email"}
				],
				type: [
					rule: "in"
				]
			}
		}
	 */
	var errs = [];
	
	if (errors.error){
		return [{
			type: errors.error,
			message: getErrorMessage(errors.error, null, lang, sails)
		}];
	}

	var invalidAttrs = errors.invalidAttributes;
	for (var key in invalidAttrs){
		var field = getFieldTranslation(key, lang, sails);

	  	var json = invalidAttrs[key];
	  	var tmpErrs = [];
		for (var err in json){
			var rule = json[err].rule;
			//special treatment of min & max for FE
			if (rule == "min" || rule == "max"){
				rule += "_numeric";
			}
			var message;
			//special custom message for special rules (required, in, unique,...)
			if (SPECIAL_DB_RULES.indexOf(rule) > -1){
				message = getErrorMessage(rule, field, lang, sails);
			}
			//message of validation error (typeof float, int, boolean,...)
			else {	
				var ruleTrans = getFieldTranslation(rule, lang, sails);
				message = getErrorMessage("validation", [field, ruleTrans], lang, sails);
			}

			er = {
				type: "validation",
				field: key,
				rule: rule,
				message: message
			};
			//if rule is required, remove other rule (empty, email,...)
			//ie: if email is required and of type email, when the user send null or an empty string, there is two errors: required and email, we just keep required
			if (rule == "required"){
				tmpErrs = [er];
				break;
			}
			tmpErrs.push(er);
		}
		errs = errs.concat(tmpErrs);
 	}
 	return errs;
};

var handleOtherErrors = function(errors, lang, sails){
	var errorType,
		errorInfo;

	//Handle error info ttranslation
	if (errors.type){
		errorType = errors.type;
		if (errors.info) {
			errorInfo = errors.info;
		}
	}
	else
		errorType = errors;

	return handleErrorType(errorType, errorInfo, lang, sails);
};

var getFieldTranslation = function(errorInfo, lang, sails){
	if (!ERRORS_FIELDS[errorInfo]){
		sails.log.warn(TAG + "Missing translations in errorsFields." + errorInfo);
	}
	else if (ERRORS_FIELDS[errorInfo][lang]){
		return ERRORS_FIELDS[errorInfo][lang];
	}
	//take english version if previous is null or empty
	else if (ERRORS_FIELDS[errorInfo].en) {
		sails.log.warn(TAG + "Missing '" + lang + "' translation in errorsFields." + errorInfo);
		return ERRORS_FIELDS[errorInfo].en;
	}
	else {
		sails.log.warn(TAG + "Missing 'en' and '" + lang + "' translations in errorsFields." + errorInfo);
	}
	return errorInfo;
};

var parseErrorsInfo = function(errorInfo, lang, sails){
	trans = [];
	if (Array.isArray(errorInfo)){
		for (var key in errorInfo) {
			trans[key] = getFieldTranslation(errorInfo[key], lang, sails);
		}
		return trans;
	}
	else {
		return getFieldTranslation(errorInfo, lang, sails);
	}
};

var handleErrorType = function(errorType, errorInfo, lang, sails){
	var err = {};

	var errorInfoTranslated;
	if (errorInfo) 
		errorInfoTranslated = parseErrorsInfo(errorInfo, lang, sails);

	//Validation error
	if(typeof(errorType) === "string" && errorType.indexOf("validation_") === 0){
		err.rule = errorType.split("_")[1];
		err.type = "validation";

		if (errorType == "min" || errorType == "max"){
			errorType += "_numeric";
		}
		//special  validation as in, required, unique, min
		if (SPECIAL_DB_RULES.indexOf(errorType) > -1){
			err.message = getErrorMessage(errorType, errorInfoTranslated, lang, sails);
		}
		//message of validation error (typeof float, int, boolean,...)
		else {	
			var ruleTrans = getFieldTranslation(err.rule, lang, sails);
			err.message = getErrorMessage("validation", [errorInfoTranslated, ruleTrans], lang, sails);
		}
	}
	else if (errorType == "required"){
		err.rule = "required";
		err.type = "validation";
		err.message = getErrorMessage(errorType, errorInfoTranslated, lang, sails);
	}
	else {
		err.message = getErrorMessage(errorType, errorInfoTranslated, lang, sails);
		err.type = errorType;
	}

	if (errorInfo && Array.isArray(errorInfo))
		err.field = errorInfo[0];
	else if (errorInfo)
		err.field = errorInfo;
	
	return err;
};

var getErrorMessage = function(errorType, errorInfo, lang, sails){
	var errMsg;

	if (!ERRORS[errorType]){
		sails.log.error(TAG + "ERROR DECODING : " + errorType);
		sails.log.warn(TAG + "Missing translations in ErrorsTypes." + errorType);
		return errorType;
	}
	else if (ERRORS[errorType][lang]) {
		errMsg = ERRORS[errorType][lang];
	}
	else if (ERRORS[errorType].en) {
		sails.log.warn(TAG + "Missing '" + lang + "' translation in ErrorsTypes." + errorType);
		errMsg = ERRORS[errorType].en;
	}
	else {
		sails.log.warn(TAG + "Missing 'en' and '" + lang + "' translations in ErrorsTypes." + errorType);
		return errorType;
	}
	switch ((errMsg.match(new RegExp("%s", "g")) || []).length) {
		case 1:
			//Only one error info
			errMsg = util.format(errMsg, errorInfo);
		break;
		case 2:
			//Two error infos
			errMsg = util.format(errMsg, errorInfo[0], errorInfo[1]);
		break;
	}
	return errMsg;
};