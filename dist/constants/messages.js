"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = void 0;
exports.MESSAGES = {
    UPLOAD: {
        UPLOAD_SUCCESS: "Images uploaded successfully",
        UPLOAD_FAIL: "Image uploading failed",
        UPLOAD_UNAVAILABLE: 'Post are unavailable',
        UPLOAD_VIDEO_SUCCESS: 'Video uploaded successfully',
        UPLOAD_VIDEO_FAIL: 'Video uploading failed',
        UPLOAD_WENT_WRONG: 'Something went wrong'
    },
    AUTHENTICATION: {
        SUCCESS: "Athentication successfull",
        INVALID_USER: "No valid user signup again",
        BLOCK_USER: "You have been blocked by admin",
        INVALID_PASSWORD: "Invalid password",
        INVALID_CREDENTIIALS: "Invalid username or password",
        REFUSED_PASSWORD: "The password already used try another one",
        PASSWORD_SUCCESS: "Password updated successfully",
        PASSWORD_FAIL: 'Password updation failed',
        PASSWORD_INVALID: "Invalid password",
        FAIL: "Authentication failed",
        USER_BLOCK: "User has been blocked successfully",
        USER_UNBLOCK: "User has been unblocked successfully",
        DUPLICATE_EMAIL: "Email already in use"
    },
    OTP: {
        FAILED: 'Error occured in otp',
        EXPIRED: "OTP Expired",
        INVALID: 'Invalid OTP',
        SUCCESS: "OTP verification success",
        VERIFICATION_FAILED: "OTP verification failed"
    },
    POST: {
        BLOCKED_SUCCESS: "Post blocked successful",
        BLOCKED_FAILED: 'Post unblocked successful',
        SUCCESS: "Post added successfully",
        FAILED: "Post uploading failed",
        COMMENT_DELETION_SUCCESS: "Comment deleted successfully",
        COMMENT_DELETION_FAILED: "Comment not deleted"
    }
};
