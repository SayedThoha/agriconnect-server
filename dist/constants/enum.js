"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.enumForKycVerification = exports.enumForStatus = void 0;
exports.enumForStatus = [true, false];
exports.enumForKycVerification = [true, false];
var DocumentType;
(function (DocumentType) {
    DocumentType["IDENTITY_PROOF"] = "identity_proof";
    DocumentType["EXPERT_LICENCE"] = "expert_licence";
    DocumentType["QUALIFICATION_CERTIFICATE"] = "qualification_certificate";
    DocumentType["EXPERIENCE_CERTIFICATE"] = "experience_certificate";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
