"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http_Status_Codes = void 0;
var Http_Status_Codes;
(function (Http_Status_Codes) {
    Http_Status_Codes[Http_Status_Codes["OK"] = 200] = "OK";
    Http_Status_Codes[Http_Status_Codes["CREATED"] = 201] = "CREATED";
    Http_Status_Codes[Http_Status_Codes["NO_CONTENT"] = 204] = "NO_CONTENT";
    Http_Status_Codes[Http_Status_Codes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Http_Status_Codes[Http_Status_Codes["FORBIDDEN"] = 403] = "FORBIDDEN";
    Http_Status_Codes[Http_Status_Codes["NOT_FOUND"] = 404] = "NOT_FOUND";
    Http_Status_Codes[Http_Status_Codes["CONFLICT"] = 409] = "CONFLICT";
    Http_Status_Codes[Http_Status_Codes["INTERNAL_SERVER_ERROR"] = 503] = "INTERNAL_SERVER_ERROR";
    Http_Status_Codes[Http_Status_Codes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
})(Http_Status_Codes || (exports.Http_Status_Codes = Http_Status_Codes = {}));
