/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import logger from "../utils/logger";

function errorHandler(err: any, req: Request, res: Response) {

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
    });


    res.status(res.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}

export default errorHandler;